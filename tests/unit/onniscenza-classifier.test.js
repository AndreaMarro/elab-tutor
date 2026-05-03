/**
 * Unit tests for onniscenza-classifier.ts (Sprint T iter 37 Atom A2).
 *
 * Validates pre-LLM regex classifier behavior matrix:
 *   - chit_chat (skip onniscenza, save ~500-1000ms latency)
 *   - safety_warning, deep_question, citation_vol_pag, plurale_ragazzi (keep)
 *   - default fallback
 *
 * NO LLM call. Pure regex + word count. Defensive: never throws.
 *
 * Reference: PDR-ITER-37-LATENCY-LIFT-DEPLOY-VERIFY.md §3 Atom A2.
 *
 * (c) Andrea Marro 2026-04-30 — ELAB Tutor
 */

import { describe, it, expect } from 'vitest';

// Use relative import — Deno-style ".ts" suffix is resolvable via vitest's
// TypeScript loader (esbuild). The shared module has zero Deno-only deps so
// it imports cleanly under Node + Vitest.
import {
  classifyPrompt,
  countWords,
  ONNISCENZA_CLASSIFIER_VERSION,
} from '../../supabase/functions/_shared/onniscenza-classifier.ts';

describe('onniscenza-classifier — countWords', () => {
  it('returns 0 for null / undefined / empty', () => {
    expect(countWords(null)).toBe(0);
    expect(countWords(undefined)).toBe(0);
    expect(countWords('')).toBe(0);
    expect(countWords('   ')).toBe(0);
  });

  it('counts simple word boundaries', () => {
    expect(countWords('Ciao ragazzi')).toBe(2);
    expect(countWords('Spiega cos\'è un LED')).toBe(4);
  });

  it('strips AZIONE / INTENT tags before counting', () => {
    expect(countWords('Ciao [AZIONE:loadexp:v3-cap6-esp1] ragazzi')).toBe(2);
    expect(countWords('Spiega [INTENT:{"tool":"x"}] LED')).toBe(2);
  });

  it('strips markdown punctuation before counting', () => {
    expect(countWords('**Ciao** _ragazzi_ `LED`')).toBe(3);
  });
});

describe('onniscenza-classifier — chit_chat (skip onniscenza)', () => {
  it('classifies short greeting as chit_chat with skipOnniscenza=true', () => {
    const r = classifyPrompt('Ciao');
    expect(r.category).toBe('chit_chat');
    expect(r.skipOnniscenza).toBe(true);
    expect(r.topK).toBe(0);
  });

  it('classifies "salve" greeting as chit_chat', () => {
    expect(classifyPrompt('Salve!').category).toBe('chit_chat');
  });

  it('classifies "grazie" as chit_chat', () => {
    expect(classifyPrompt('Grazie mille').category).toBe('chit_chat');
  });

  it('classifies multi-word greeting under 8 words as chit_chat', () => {
    const r = classifyPrompt('Ciao buongiorno come va oggi');
    expect(r.category).toBe('chit_chat');
    expect(r.skipOnniscenza).toBe(true);
  });

  it('handles empty/whitespace as chit_chat (zero words)', () => {
    expect(classifyPrompt('').category).toBe('chit_chat');
    expect(classifyPrompt('   ').category).toBe('chit_chat');
    expect(classifyPrompt(null).category).toBe('chit_chat');
  });

  it('does NOT trigger chit_chat on partial-word match (avoid false positives)', () => {
    // "ciaologico" must NOT match (\b boundary), but it's also clearly
    // not a greeting — falls to default with topK=3.
    const r = classifyPrompt('ciaologico discussione approfondita');
    expect(r.category).not.toBe('chit_chat');
  });
});

describe('onniscenza-classifier — safety_warning (top priority)', () => {
  it('classifies "pericolo" as safety_warning', () => {
    const r = classifyPrompt('Pericolo, sento odore di bruciato');
    expect(r.category).toBe('safety_warning');
    expect(r.skipOnniscenza).toBe(false);
    expect(r.topK).toBe(3);
  });

  it('classifies "scossa" as safety_warning', () => {
    expect(classifyPrompt('Ho preso la scossa').category).toBe('safety_warning');
  });

  it('classifies "bruciato" / "brucia" as safety_warning', () => {
    expect(classifyPrompt('il LED è bruciato').category).toBe('safety_warning');
    expect(classifyPrompt('il filo brucia').category).toBe('safety_warning');
  });

  it('classifies "cortocircuito" as safety_warning', () => {
    expect(classifyPrompt('cortocircuito sulla breadboard').category).toBe('safety_warning');
  });

  it('safety beats short greeting (priority 1)', () => {
    // "Ciao pericolo" — greeting + safety. Safety wins.
    const r = classifyPrompt('Ciao pericolo!');
    expect(r.category).toBe('safety_warning');
    expect(r.skipOnniscenza).toBe(false);
  });
});

describe('onniscenza-classifier — citation_vol_pag (top-2)', () => {
  it('classifies "Vol.1 pag.27" as citation_vol_pag with topK=2', () => {
    const r = classifyPrompt('Spiega Vol.1 pag.27');
    expect(r.category).toBe('citation_vol_pag');
    expect(r.skipOnniscenza).toBe(false);
    expect(r.topK).toBe(2);
  });

  it('matches "Volume 2 pagina 45" prose form', () => {
    const r = classifyPrompt('Apriamo il Volume 2 pagina 45');
    expect(r.category).toBe('citation_vol_pag');
  });

  it('matches "vol 3" without dot', () => {
    expect(classifyPrompt('vediamo vol 3 esercizio').category).toBe('citation_vol_pag');
  });

  it('matches "p. 12" abbreviation', () => {
    // Note: SAFETY_RE has priority; avoid safety keywords in fixture.
    expect(classifyPrompt('rileggi p. 12 con calma').category).toBe('citation_vol_pag');
  });
});

describe('onniscenza-classifier — plurale_ragazzi (top-2)', () => {
  it('classifies "ragazzi" plural marker as plurale_ragazzi with topK=2', () => {
    const r = classifyPrompt('Adesso ragazzi montiamo il LED sulla breadboard');
    expect(r.category).toBe('plurale_ragazzi');
    expect(r.skipOnniscenza).toBe(false);
    expect(r.topK).toBe(2);
  });

  it('matches "ragazze" feminine plural too', () => {
    expect(classifyPrompt('Ragazze e ragazzi guardate il circuito').category).toBe('plurale_ragazzi');
  });

  it('does NOT match singular "ragazzo" / "ragazza"', () => {
    const r = classifyPrompt('Quel ragazzo ha collegato male il filo');
    expect(r.category).not.toBe('plurale_ragazzi');
  });
});

describe('onniscenza-classifier — deep_question (top-3)', () => {
  it('classifies long question as deep_question with topK=3', () => {
    const text =
      'Mi puoi spiegare in dettaglio come funziona la legge di Ohm e perché ' +
      'è importante usare il resistore prima del LED quando colleghiamo ' +
      'la batteria nove volt al circuito sulla breadboard?';
    const r = classifyPrompt(text);
    expect(r.category).toBe('deep_question');
    expect(r.topK).toBe(3);
    expect(r.skipOnniscenza).toBe(false);
  });

  it('does NOT classify short question as deep_question', () => {
    const r = classifyPrompt('Cos\'è un LED?');
    // Short question → default (5 words, has '?' but <20 words)
    expect(r.category).not.toBe('deep_question');
  });

  it('long statement WITHOUT "?" is NOT deep_question', () => {
    const text =
      'Stiamo costruendo un circuito completo con LED resistore e batteria ' +
      'come spiegato in classe seguendo le istruzioni del libro stampato.';
    const r = classifyPrompt(text);
    expect(r.category).not.toBe('deep_question');
    expect(r.category).toBe('default');
  });
});

describe('onniscenza-classifier — default fallback (top-3)', () => {
  it('classifies medium-length statement as default with topK=3', () => {
    const r = classifyPrompt('Spiega cosa fa la breadboard nei nostri esperimenti');
    expect(r.category).toBe('default');
    expect(r.topK).toBe(3);
    expect(r.skipOnniscenza).toBe(false);
  });

  it('preserves topK=3 on uncertain inputs (safer default)', () => {
    const r = classifyPrompt('Mostrami il prossimo passo');
    expect(r.topK).toBe(3);
  });
});

describe('onniscenza-classifier — defensive', () => {
  it('never throws on weird inputs', () => {
    expect(() => classifyPrompt('🎉🎊🚀')).not.toThrow();
    expect(() => classifyPrompt('a'.repeat(10000))).not.toThrow();
    expect(() => classifyPrompt('\n\t   \r\n')).not.toThrow();
  });

  it('classifies pure emoji as chit_chat (zero word count)', () => {
    // Emoji-only is essentially silence — treat as chit_chat skip.
    // Word boundary regex sees \w+ — emoji are not word chars.
    const r = classifyPrompt('🎉');
    expect(r.skipOnniscenza).toBe(true);
  });

  it('exposes version marker', () => {
    expect(ONNISCENZA_CLASSIFIER_VERSION).toMatch(/iter37/);
  });
});

// ============================================================================
// Iter 34 Atom A1 — Cap conditional 6→8 categories tests
// ============================================================================

describe('onniscenza-classifier — meta_question (NEW iter 34)', () => {
  it('classifies "Chi sei?" as meta_question with skipOnniscenza=true topK=0', () => {
    const r = classifyPrompt('Chi sei?');
    expect(r.category).toBe('meta_question');
    expect(r.skipOnniscenza).toBe(true);
    expect(r.topK).toBe(0);
    expect(r.capWords).toBe(50);
  });

  it('classifies "Come ti chiami?" as meta_question', () => {
    expect(classifyPrompt('Come ti chiami?').category).toBe('meta_question');
  });

  it('classifies "Come funzioni?" as meta_question', () => {
    expect(classifyPrompt('Come funzioni esattamente?').category).toBe('meta_question');
  });

  it('classifies "Cosa sai fare" as meta_question', () => {
    expect(classifyPrompt('Cosa sai fare?').category).toBe('meta_question');
  });

  it('classifies "sei un robot" as meta_question', () => {
    expect(classifyPrompt('Sei un robot vero?').category).toBe('meta_question');
  });

  it('meta_question beats plurale_ragazzi (priority 2 > 6)', () => {
    // "Ragazzi chi siete" — meta-self addressed plurale. Meta wins (intent is meta).
    const r = classifyPrompt('Ragazzi chi siete?');
    expect(r.category).toBe('meta_question');
    expect(r.skipOnniscenza).toBe(true);
  });
});

describe('onniscenza-classifier — off_topic (NEW iter 34)', () => {
  it('classifies "parliamo di calcio" as off_topic with skipOnniscenza=true capWords=40', () => {
    const r = classifyPrompt('Parliamo di calcio invece');
    expect(r.category).toBe('off_topic');
    expect(r.skipOnniscenza).toBe(true);
    expect(r.topK).toBe(0);
    expect(r.capWords).toBe(40);
  });

  it('classifies "Juventus" / "Inter" / "Milan" as off_topic', () => {
    expect(classifyPrompt('La Juventus ieri ha vinto').category).toBe('off_topic');
    expect(classifyPrompt('Tifo Inter da sempre').category).toBe('off_topic');
    expect(classifyPrompt('Il Milan questa stagione').category).toBe('off_topic');
  });

  it('classifies "Fortnite" / "Minecraft" / "PS5" as off_topic', () => {
    expect(classifyPrompt('Giochiamo a Fortnite stasera').category).toBe('off_topic');
    expect(classifyPrompt('Minecraft è il mio preferito').category).toBe('off_topic');
    expect(classifyPrompt('Vorrei una PS5').category).toBe('off_topic');
  });

  it('classifies social media / streaming as off_topic', () => {
    expect(classifyPrompt('Visto su TikTok un trend').category).toBe('off_topic');
    expect(classifyPrompt('Ascolto Spotify mentre studio').category).toBe('off_topic');
  });

  it('does NOT trigger off_topic on educational mentions', () => {
    // "sensore temperatura" is educational, must NOT trigger OFFTOPIC.
    // OFFTOPIC_RE has explicit non-educational lemmi only (no "temperatura").
    const r = classifyPrompt('Spiega sensore temperatura DHT11');
    expect(r.category).not.toBe('off_topic');
  });

  it('off_topic beats plurale_ragazzi (priority 3 > 6)', () => {
    // "ragazzi parliamo di calcio" — off-topic with plurale addressing.
    // Off-topic wins, then UNLIM soft-deflects to kit ELAB.
    const r = classifyPrompt('Ragazzi parliamo di calcio Serie A');
    expect(r.category).toBe('off_topic');
    expect(r.skipOnniscenza).toBe(true);
  });
});

describe('onniscenza-classifier — capWords field (NEW iter 34)', () => {
  it('returns capWords=80 for safety_warning', () => {
    expect(classifyPrompt('pericolo brucia').capWords).toBe(80);
  });

  it('returns capWords=30 for chit_chat (shortest)', () => {
    expect(classifyPrompt('Ciao').capWords).toBe(30);
    expect(classifyPrompt('').capWords).toBe(30);
  });

  it('returns capWords=60 for citation_vol_pag (cap default preserve)', () => {
    expect(classifyPrompt('Vol.1 pag.27 dimmi').capWords).toBe(60);
  });

  it('returns capWords=60 for plurale_ragazzi (cap default preserve)', () => {
    expect(classifyPrompt('Ragazzi montiamo il LED').capWords).toBe(60);
  });

  it('returns capWords=120 for deep_question (deep needs words)', () => {
    const text =
      'Mi puoi spiegare in dettaglio come funziona la legge di Ohm e perché ' +
      'è importante usare il resistore prima del LED quando colleghiamo ' +
      'la batteria nove volt al circuito sulla breadboard?';
    expect(classifyPrompt(text).capWords).toBe(120);
  });

  it('returns capWords=60 for default (cap default preserve)', () => {
    expect(classifyPrompt('Spiega la breadboard nei nostri esperimenti').capWords).toBe(60);
  });
});
