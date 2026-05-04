/**
 * unlim-session-description — pure helpers (runtime-agnostic Deno + Node).
 *
 * iter 35 Phase 2 Atom I3 — extracted from index.ts so vitest unit tests
 * (Node runtime) can import without resolving deno.land/x https URLs that
 * the Deno serve handler in index.ts pulls in at module-load time.
 *
 * Functions exported:
 *   - fallbackSummary(row)       — stale safe fallback when LLM unavailable
 *   - buildPrompt(row, ?excerpt) — Italian K-12 system + user prompt pair
 *   - MAX_CHARS                  — output cap (80 chars metadata)
 *   - MAX_TRANSCRIPT_CHARS       — input transcript cap (500 chars)
 *
 * (c) Andrea Marro 2026-05-04 — ELAB Tutor iter 35 Phase 2
 */

export const MAX_CHARS = 80;
export const MAX_TRANSCRIPT_CHARS = 500;

export interface SessionRow {
  id: string;
  experiment_id: string | null;
  modalita: string | null;
  started_at: string | null;
  ended_at: string | null;
  events: unknown;
  description_unlim: string | null;
}

export function fallbackSummary(row: SessionRow): string {
  const expId = row.experiment_id || 'esperimento';
  const events = Array.isArray(row.events) ? row.events.length : 0;
  const dur = row.started_at && row.ended_at
    ? Math.max(1, Math.round((new Date(row.ended_at).getTime() - new Date(row.started_at).getTime()) / 60000))
    : 0;
  const parts: string[] = [`Sessione su ${expId}`];
  if (dur) parts.push(`${dur} min`);
  if (events) parts.push(`${events} eventi`);
  return parts.join(' · ').slice(0, MAX_CHARS);
}

/**
 * Build the system + user prompt pair for an Italian K-12 session summary.
 *
 * Andrea-explicit Italian summary prompt (iter 35 Phase 2 Atom I3):
 *   "Riassumi questa sessione di lezione ELAB in max 80 caratteri (italiano,
 *    plurale Ragazzi se applicabile, focus su esperimento + concetto)"
 *
 * @param row                Supabase unlim_sessions row
 * @param transcriptExcerpt  Optional ≤500-char verbatim chat snippet for
 *                           sparse-events sessions (defensive: empty string
 *                           is dropped from prompt context to keep tokens low).
 */
export function buildPrompt(
  row: SessionRow,
  transcriptExcerpt?: string,
): { systemPrompt: string; message: string } {
  const expId = row.experiment_id || 'sconosciuto';
  const modalita = row.modalita || 'percorso';
  const events = Array.isArray(row.events) ? row.events.slice(0, 12) : [];
  const dur = row.started_at && row.ended_at
    ? Math.max(1, Math.round((new Date(row.ended_at).getTime() - new Date(row.started_at).getTime()) / 60000))
    : null;

  const systemPrompt = [
    'Sei UNLIM, tutor AI ELAB Tutor.',
    'Riassumi questa sessione di lezione ELAB in MAX 80 caratteri (italiano).',
    'Focus: esperimento svolto + concetto principale appreso.',
    'Tono: neutro, fattuale, plurale impersonale ("Esplorato", "Costruito", "Verificato").',
    'NIENTE saluti, NIENTE imperativi al docente, NIENTE emoji.',
    'Cita SOLO concetti realmente presenti negli eventi/transcript. Se non sai, ometti.',
  ].join(' ');

  const trimmedTranscript = (transcriptExcerpt || '').trim().slice(0, MAX_TRANSCRIPT_CHARS);
  const messageParts: string[] = [
    `Esperimento: ${expId}`,
    `Modalità: ${modalita}`,
    dur ? `Durata: ${dur} min` : '',
    `Eventi recenti: ${JSON.stringify(events)}`,
  ];
  if (trimmedTranscript) {
    messageParts.push(`Estratto trascritto: ${trimmedTranscript}`);
  }
  messageParts.push('Restituisci SOLO la descrizione, senza prefissi.');
  const message = messageParts.filter(Boolean).join('\n');

  return { systemPrompt, message };
}
