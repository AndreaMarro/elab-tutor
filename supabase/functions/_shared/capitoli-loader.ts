/**
 * capitoli-loader — Deno-compat per Edge Function unlim-chat (Q3.D)
 * Andrea Marro 2026-04-25
 *
 * Carica capitoli.json (37 Capitoli aggregati) e fornisce lookup API.
 * Equivalente Deno di src/services/percorsoService.js (Vite-only).
 *
 * Source: ../capitoli.json (1MB) generato da scripts/aggregate-capitoli-for-edge.mjs
 */

import capitoliBundle from "../capitoli.json" with { type: "json" };

interface Capitolo {
  id: string;
  volume: number;
  capitolo: number | null;
  type: "theory" | "experiment" | "project" | "bonus" | "wip";
  titolo: string;
  titolo_classe: string;
  pageStart: number | null;
  pageEnd: number | null;
  theory: {
    testo_classe: string;
    citazioni_volume: Array<{ page: number; quote: string; context?: string }>;
    figure_refs: Array<{ page: number; caption: string }>;
    analogies_classe: Array<{ concept: string; text: string; evidence?: string }>;
  };
  narrative_flow?: {
    intro_text: string;
    transitions: Array<{ between: [string, string]; text_classe: string; text_docente_action: string; incremental_mode: string }>;
    closing_text: string;
  };
  esperimenti: Array<{
    id: string;
    num: number;
    title_classe: string;
    title_docente: string;
    volume_ref: { page_start: number; page_end: number; fig_refs: any[] };
    duration_minutes: number;
    components_needed: Array<{ name: string; quantity: number; icon: string }>;
    build_circuit: any;
    phases: Array<any>;
    assessment_invisible: string[];
    session_save: { concepts_covered: string[]; next_suggested: string | null; resume_message: string };
  }>;
}

interface CapitoliBundle {
  generated: string;
  count: number;
  capitoli: Capitolo[];
}

const bundle = capitoliBundle as unknown as CapitoliBundle;
const byId = new Map<string, Capitolo>();
for (const cap of bundle.capitoli) {
  byId.set(cap.id, cap);
}

export function getCapitolo(id: string): Capitolo | null {
  return byId.get(id) ?? null;
}

export function getCapitoloByExperimentId(expId: string): { capitolo: Capitolo; esperimento: any } | null {
  for (const cap of bundle.capitoli) {
    const esp = cap.esperimenti.find((e) => e.id === expId);
    if (esp) return { capitolo: cap, esperimento: esp };
  }
  return null;
}

export function listCapitoliByVolume(volNum: number): Capitolo[] {
  return bundle.capitoli
    .filter((c) => c.volume === volNum && c.type !== "bonus")
    .sort((a, b) => (a.capitolo ?? 0) - (b.capitolo ?? 0));
}

export function listAllCapitoli(): Capitolo[] {
  return bundle.capitoli;
}

export function getBonusCapitoli(): Capitolo[] {
  return bundle.capitoli.filter((c) => c.type === "bonus");
}

export function getCapitoliCount(): number {
  return bundle.count;
}

export function getCapitoliBundleGenerated(): string {
  return bundle.generated;
}

// ────────────────────────────────────────────────────────────────────────────
// Sprint S iter 2 Task A1 — buildCapitoloPromptFragment
// ────────────────────────────────────────────────────────────────────────────

/**
 * Build a Markdown-formatted prompt fragment from a Capitolo, scoped to an
 * optional experiment id. The fragment is appended to the system prompt by
 * unlim-chat to ground UNLIM responses in the actual book chapter (theory
 * narrative, citazioni autorevoli, transitions tra esperimenti).
 *
 * Default decisions per ADR-008 (architect-opus ADR not yet available; use
 * defaults from sprint-S-iter-2-contract.md and master plan v2 §4.4):
 *   - Format: Markdown sections inside system prompt
 *   - Scope: if experimentId provided, slice to that exp + immediate transitions
 *           (prev/next); else full chapter
 *   - Token budget: target ~200-600 chars sliced, ~800-1500 chars full
 *   - Citazioni format: «{quote}» — Vol.{N} pag.{page}
 *   - Narrative: include capitolo intro_text always; transitions only in
 *     multi-experiment context (i.e. unscoped or for non-first experiment)
 *
 * Defensive: returns '' (empty string) if capitolo is null/undefined OR if
 * the input fails minimal shape checks. Caller must concatenate safely.
 */
export function buildCapitoloPromptFragment(
  capitolo: Capitolo | null | undefined,
  experimentId?: string,
): string {
  if (!capitolo || typeof capitolo !== 'object') return '';

  const lines: string[] = [];

  // Header
  const volLabel = `Vol.${capitolo.volume}`;
  const capLabel = capitolo.capitolo != null ? `Cap.${capitolo.capitolo}` : capitolo.type;
  const pageRange = capitolo.pageStart && capitolo.pageEnd
    ? `pag.${capitolo.pageStart}-${capitolo.pageEnd}`
    : '';
  lines.push(`[CONTESTO CAPITOLO LIBRO]`);
  lines.push(`${volLabel} ${capLabel}: ${capitolo.titolo_classe || capitolo.titolo}${pageRange ? ` (${pageRange})` : ''}`);

  // Narrative intro (always)
  const introText = capitolo.narrative_flow?.intro_text;
  if (introText && typeof introText === 'string' && introText.trim()) {
    lines.push('');
    lines.push(`Intro narrativa (testo per i ragazzi):`);
    lines.push(introText.trim());
  }

  // Scoped to experiment vs full chapter
  let targetEsp: any | null = null;
  let espIdx = -1;
  if (experimentId && Array.isArray(capitolo.esperimenti)) {
    espIdx = capitolo.esperimenti.findIndex((e) => e.id === experimentId);
    if (espIdx >= 0) targetEsp = capitolo.esperimenti[espIdx];
  }

  if (targetEsp) {
    // SLICED MODE: target exp + immediate transitions
    lines.push('');
    lines.push(`Esperimento attivo: "${targetEsp.title_classe}" (esp. ${targetEsp.num}).`);
    if (targetEsp.volume_ref?.page_start) {
      const ps = targetEsp.volume_ref.page_start;
      const pe = targetEsp.volume_ref.page_end || ps;
      lines.push(`Riferimento libro: ${volLabel} pag.${ps}${pe !== ps ? `-${pe}` : ''}.`);
    }

    // Citazioni rilevanti (cap-level): include 1-2 più rilevanti per pag.
    const cits = capitolo.theory?.citazioni_volume;
    if (Array.isArray(cits) && cits.length > 0) {
      const espStart = targetEsp.volume_ref?.page_start ?? 0;
      const espEnd = targetEsp.volume_ref?.page_end ?? espStart;
      // prefer citazioni in range exp pages, fallback first 2
      const inRange = cits.filter((c) => c.page >= espStart && c.page <= espEnd);
      const pick = (inRange.length > 0 ? inRange : cits).slice(0, 2);
      if (pick.length > 0) {
        lines.push('');
        lines.push(`Citazioni autorevoli dal libro:`);
        for (const c of pick) {
          if (c?.quote && c?.page) {
            lines.push(`«${c.quote.trim()}» — ${volLabel} pag.${c.page}`);
          }
        }
      }
    }

    // Transitions adiacenti (prev → this, this → next)
    const transitions = capitolo.narrative_flow?.transitions;
    if (Array.isArray(transitions) && transitions.length > 0) {
      const adjacent = transitions.filter((t) =>
        Array.isArray(t.between) && (t.between[0] === targetEsp.id || t.between[1] === targetEsp.id),
      );
      if (adjacent.length > 0) {
        lines.push('');
        lines.push(`Transizioni narrative collegate:`);
        for (const t of adjacent.slice(0, 2)) {
          if (t.text_classe) lines.push(`— ${t.text_classe.trim()}`);
        }
      }
    }
  } else {
    // FULL CHAPTER MODE: list esperimenti + 1-2 citazioni globali
    const esps = Array.isArray(capitolo.esperimenti) ? capitolo.esperimenti : [];
    if (esps.length > 0) {
      lines.push('');
      lines.push(`Esperimenti del capitolo (${esps.length}):`);
      for (const e of esps.slice(0, 6)) {
        lines.push(`- esp.${e.num} "${e.title_classe}"`);
      }
      if (esps.length > 6) lines.push(`- (+${esps.length - 6} altri)`);
    }

    const cits = capitolo.theory?.citazioni_volume;
    if (Array.isArray(cits) && cits.length > 0) {
      lines.push('');
      lines.push(`Citazioni autorevoli dal capitolo:`);
      for (const c of cits.slice(0, 2)) {
        if (c?.quote && c?.page) {
          lines.push(`«${c.quote.trim()}» — ${volLabel} pag.${c.page}`);
        }
      }
    }
  }

  // Closing instruction (synthesis, NOT verbatim)
  lines.push('');
  lines.push(`Usa questo contesto per SINTETIZZARE in linguaggio 10-14 anni. Cita il libro («...» Vol.N pag.X) solo quando aggiunge autorevolezza, mai 3+ frasi consecutive copiate.`);

  return lines.join('\n');
}

