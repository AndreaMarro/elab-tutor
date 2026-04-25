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
