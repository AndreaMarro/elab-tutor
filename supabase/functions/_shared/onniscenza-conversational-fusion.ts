// Iter 41 Phase B Task B3 — Onniscenza V2.1 conversational fusion impl.
//
// Replaces V2 cross-attention REJECTED iter 39 (-1.0pp PZ V3 + 36% slower regression).
// V2.1 minimal-risk: RRF k=60 base preserved + 4 weighted boost factors capped +0.50:
//   - experiment-anchor +0.15 (chunk experimentId === query.experimentId)
//   - kit-mention +0.10 (Omaric component regex match)
//   - recent-history +0.20 × cosineSim (Voyage embed last 10 messages)
//   - docente-stylistic +0.05 (esperto/primoAnno Morfismo Sense 1.5)
//
// Plan: docs/superpowers/plans/2026-05-02-iter-41-velocita-onniscenza-onnipotenza-wake-word.md §Phase B Task B3
// ADR: docs/adrs/ADR-035-onniscenza-v2-1-conversational-fusion.md

import { embedConversationHistory } from './conversation-history-embed.ts';

// Iter 41 D1 + Andrea iter 21 plurale "Ragazzi" anchored: kit Omaric components ELAB.
const KIT_OMARIC_REGEX = /\b(LED(?:\s+\w+)?|breadboard|arduino(?:\s+nano)?|nano|resistore|condensatore|mosfet|diodo|pulsante|potenziometro|buzzer)\b/i;

// Stylistic boost regex per Morfismo Sense 1.5 docente memoria adapt.
const ESPERTO_REGEX = /\b(avanzato|approfondimento|bonus|spunto|estensione)\b/i;
const PRIMO_ANNO_REGEX = /\b(analogia|come\s+un|esempio\s+semplice|paragone)\b/i;

const COSINE_THRESHOLD = 0.6;
const BOOST_CAP = 0.50;

interface ConversationMessage {
  role: string;
  content: string;
}

interface RagChunk {
  id: string;
  score: number;
  content: string;
  experimentId?: string;
  metadata?: { embedding?: number[] };
}

interface DocenteStyle {
  esperto?: boolean;
  primoAnno?: boolean;
}

export interface FusionInput {
  ragChunks: RagChunk[];
  query: string;
  experimentId?: string;
  conversationMessages?: ConversationMessage[];
  classKey?: string;
  docenteStyle?: DocenteStyle;
}

export interface FusionResult {
  id: string;
  finalScore: number;
  boostBreakdown: Record<string, number>;
}

/**
 * Cosine similarity between two equal-length vectors.
 * Returns 0 defensively when:
 *   - either vector is empty
 *   - lengths differ
 *   - either has zero magnitude (avoid divide-by-zero)
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a || !b || a.length === 0 || b.length === 0 || a.length !== b.length) return 0;
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

/**
 * Aggregate V2.1 fusion: RRF k=60 base + 4 weighted boost factors capped +0.50.
 *
 * Each chunk receives a `finalScore = rrfScore + cappedBoost` and a
 * `boostBreakdown` map showing which factors contributed.
 *
 * Output sorted descending by finalScore.
 */
export async function aggregateOnniscenzaV21(input: FusionInput): Promise<FusionResult[]> {
  const historyEmbed = input.conversationMessages && input.conversationMessages.length > 0
    ? await embedConversationHistory(input.conversationMessages)
    : null;

  const fused = input.ragChunks.map((chunk) => {
    const breakdown: Record<string, number> = { rrf_base: chunk.score };
    let boost = 0;

    // +0.15 experiment-anchor
    if (input.experimentId && chunk.experimentId === input.experimentId) {
      boost += 0.15;
      breakdown.experiment_anchor = 0.15;
    }

    // +0.10 kit-mention (Omaric component regex)
    if (KIT_OMARIC_REGEX.test(chunk.content)) {
      boost += 0.10;
      breakdown.kit_mention = 0.10;
    }

    // +0.20 × cosineSim recent-history
    if (historyEmbed?.vector && chunk.metadata?.embedding) {
      const sim = cosineSimilarity(historyEmbed.vector, chunk.metadata.embedding);
      if (sim > COSINE_THRESHOLD) {
        const histBoost = 0.20 * sim;
        boost += histBoost;
        breakdown.recent_history = histBoost;
      }
    }

    // +0.05 docente-stylistic (Morfismo Sense 1.5)
    if (input.docenteStyle?.esperto && ESPERTO_REGEX.test(chunk.content)) {
      boost += 0.05;
      breakdown.docente_stylistic = 0.05;
    } else if (input.docenteStyle?.primoAnno && PRIMO_ANNO_REGEX.test(chunk.content)) {
      boost += 0.05;
      breakdown.docente_stylistic = 0.05;
    }

    // Cap total boost
    const capped = Math.min(boost, BOOST_CAP);
    if (capped < boost) {
      breakdown.cap_applied = 1;
    }

    return {
      id: chunk.id,
      finalScore: chunk.score + capped,
      boostBreakdown: breakdown,
    };
  });

  return fused.sort((a, b) => b.finalScore - a.finalScore);
}
