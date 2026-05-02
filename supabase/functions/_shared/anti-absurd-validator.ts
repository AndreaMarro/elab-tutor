// Iter 41 Phase B Task B4 — Anti-absurd validator post-LLM.
//
// User mandate: "no risposte assurde". NER cross-ref RAG chunks + Arduino Nano pin
// validity check. Reduces hallucination risk for kit Omaric component references.
//
// Plan: docs/superpowers/plans/2026-05-02-iter-41-velocita-onniscenza-onnipotenza-wake-word.md §Phase B Task B4
// Wire-up: post cap_words in unlim-chat/index.ts, telemetry-only iter 41 (no block).

// Arduino Nano valid pins (D0-D13 + A0-A7 + power/special)
const VALID_NANO_PINS = new Set([
  'D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12', 'D13',
  'A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7',
  'GND', 'VCC', '5V', '3V3', 'RESET', 'AREF',
]);

// Kit Omaric component family roots — partial-match permissive
// (e.g. "LED rosso" → "LED" matches "LED basics" in chunks).
const COMPONENT_REGEX = /\b(LED|resistore|condensatore|transistor|diodo|MOSFET|breadboard|pulsante|potenziometro|buzzer|Arduino|Nano|Uno|servo|encoder|sensore)\b/gi;

const SCORE_REASONS_DIVISOR = 10; // crude confidence: score = 1 - reasons/10

export interface AntiAbsurdInput {
  response: string;
  ragChunks?: Array<{ content: string }>;
  experimentId?: string;
}

export interface AntiAbsurdResult {
  suspicious: boolean;
  reasons: string[];
  score: number;
}

export function validateAbsurd(input: AntiAbsurdInput): AntiAbsurdResult {
  const reasons: string[] = [];
  const response = input.response ?? '';

  if (!response.trim()) {
    return { suspicious: false, reasons: [], score: 1 };
  }

  // ── Pin validity check ──
  // Match D|A followed by digits, NOT preceded by a letter (to avoid matching
  // "AD17" or middle of word). Word boundary anchors.
  const pinRefs = [...response.matchAll(/\b([DA])(\d+)\b/g)];
  for (const m of pinRefs) {
    const pin = `${m[1]}${m[2]}`;
    if (!VALID_NANO_PINS.has(pin)) {
      reasons.push(`invalid_pin:${pin}`);
    }
  }

  // ── NER component cross-ref RAG chunks ──
  // Only flag when RAG chunks were actually provided (skip when chunks empty —
  // can't compare against empty corpus, defer iter 42+ stricter mode).
  if (input.ragChunks && input.ragChunks.length > 0) {
    const respComponents = [
      ...response.matchAll(COMPONENT_REGEX),
    ].map((m) => m[1].toLowerCase());
    const chunkText = input.ragChunks.map((c) => c.content).join(' ').toLowerCase();
    const seen = new Set<string>();
    for (const comp of respComponents) {
      if (seen.has(comp)) continue;
      seen.add(comp);
      // Partial root match: comp appears anywhere in chunk text
      if (!chunkText.includes(comp)) {
        reasons.push(`ner_unmatched_component:${comp}`);
      }
    }
  }

  // Score: crude confidence (1 - reasons/10), clamped [0, 1]
  const score = Math.max(0, Math.min(1, 1 - reasons.length / SCORE_REASONS_DIVISOR));

  return {
    suspicious: reasons.length > 0,
    reasons,
    score,
  };
}
