/**
 * INTENT_TOOLS_SCHEMA — Sprint T iter 38 Atom A7
 *
 * Canonical JSON Schema for Mistral La Plateforme structured-output
 * (`response_format = { type: 'json_schema', schema: ... }`).
 *
 * Replaces the legacy regex-based `[INTENT:{...}]` parsing path that
 * suffered 4-way schema drift (Tester-6 R7 v53: canonical 12.5%,
 * 17/200 params_fail = scorer drift). Mistral now validates the model
 * output server-side against this schema and returns parsed JSON.
 *
 * CRITICAL CANONICAL ALIGNMENT (iter 38 A7 fix):
 *   mountExperiment.args.id — STRING, NOT `experimentId`.
 *   This matches:
 *     1. system-prompt.ts few-shot Esempio 2: `{"tool":"mountExperiment","args":{"id":"v3-cap6-semaforo"}}`
 *     2. Browser API positional: `__ELAB_API.mountExperiment(id)` and the
 *        intentsDispatcher whitelist (iter 37 B-NEW Maker-1).
 *     3. ADR-028 §14 amend (surface-to-browser pivot iter 36).
 *
 * Prior drift cases (iter 36-37) used `experimentId` in some scorer fixtures
 * and `id` in others; this iter 38 schema is the single source of truth.
 *
 * Tools whitelist matches the 12 safe browser-side tools defined in
 * supabase/functions/_shared/intent-parser.ts and src/components/lavagna/
 * intentsDispatcher.js (iter 37 Maker-1 surface-to-browser pivot).
 *
 * Reference: PDR Sprint T iter 38 §3 Atom A7.
 * Mistral docs: https://docs.mistral.ai/capabilities/structured-output/json_schema/
 *
 * (c) Andrea Marro 2026-04-30 — ELAB Tutor Maker-1
 */

import type { MistralResponseFormat } from './mistral-client.ts';

/**
 * Canonical tool names — single source of truth (Sprint T iter 31 ralph 20 Atom 20.1).
 *
 * Iter 38 baseline: 12 browser-side tools (Maker-1 surface-to-browser pivot iter 36).
 * Iter 31 ralph 20 expansion: +38 NEW UI action tools per ADR-041 §3 L0b API surface
 * (50 methods enumerated; this Atom 20.1 lifts schema +38 most-used primitives spread
 * across §3.1 mouse/keyboard, §3.2 window+nav, §3.3 modalita+lesson, §3.4 voice,
 * §3.5 simulator-specific, §3.6 lavagna+chat, §3.7 volumi+cronologia).
 *
 * Total post iter 31 ralph 20: 12 + 38 = 50 canonical actions whitelisted.
 *
 * MUST mirror intent-parser.ts ALLOWED_UI_ACTIONS (Maker-1 iter 31 ralph 20.1) +
 * intentsDispatcher.js whitelist (Maker-2 iter 31 ralph 20.2 parallel).
 *
 * DESTRUCTIVE actions FORBIDDEN per ADR-041 §5.2 (admin CRUD, manual-doc-remove,
 * notebook-delete, teacher-class-delete, deleteAll, submitForm, fetchExternalUrl,
 * resetMemory, cronologia-delete-session, stopSync). NOT included here.
 */
export const CANONICAL_INTENT_TOOLS = [
  // ═══════════════════════════════════════════════════════════════════════
  // BASELINE 12 (iter 38) — preserve canonical browser-side tools
  // ═══════════════════════════════════════════════════════════════════════
  'highlightComponent',
  'mountExperiment',
  'captureScreenshot',
  'highlightPin',
  'clearHighlights',
  'clearCircuit',
  'getCircuitState',
  'getCircuitDescription',
  'setComponentValue',
  'toggleDrawing',
  'serialWrite',
  'clearHighlightPins',

  // ═══════════════════════════════════════════════════════════════════════
  // L0b NEW iter 31 ralph 20.1 — 38 NEW UI action tools per ADR-041 §3
  // ═══════════════════════════════════════════════════════════════════════

  // §3.1 Mouse + keyboard primitives (10)
  'click',
  'doubleClick',
  'rightClick',
  'hover',
  'scroll',
  'type',
  'key',
  'keyDown',
  'keyUp',
  'drag',

  // §3.2 Window + modal + navigation (8)
  'openModal',
  'closeModal',
  'minimizeWindow',
  'maximizeWindow',
  'closeWindow',
  'navigate',
  'back',
  'forward',

  // §3.3 Modalità 4 + lesson-paths (7)
  'toggleModalita',
  'highlightStep',
  'nextStep',
  'prevStep',
  'nextExperiment',
  'prevExperiment',
  'restartLessonPath',

  // §3.4 Voice + TTS playback (6)
  'voicePlayback',
  'voiceSetVolume',
  'voiceSetMode',
  'startWakeWord',
  'stopWakeWord',
  'speak',

  // §3.5 Simulator-specific (4 most-used; rest deferred Atom 20.2 dispatcher scope)
  'zoom',
  'pan',
  'centerOn',
  'selectComponent',

  // §3.6 Lavagna + chatbot + chat (3 most-used)
  'expandChatUnlim',
  'switchTab',
  'togglePanel',
] as const;

export type CanonicalIntentTool = typeof CANONICAL_INTENT_TOOLS[number];

/**
 * Per-action JSON Schema for `args` validation (Mistral La Plateforme structured-output).
 *
 * Each entry mirrors the L0b API surface signatures in ADR-041 §3 (TypeScript interface
 * `ElabUiApi`). Mistral FC validates server-side BEFORE returning parsed JSON to caller.
 *
 * Schema design notes:
 *   - All `args` objects use `additionalProperties: false` to reject extras (strict mode).
 *   - Selector targets accept `string | UiIntent`-shaped object (per ADR-041 §4 HYBRID
 *     resolver). To keep Mistral schema simple, we accept `string` (CSS selector OR
 *     ariaLabel OR text) and let the browser-side resolver disambiguate.
 *   - Enums constrain values where ADR-041 §3 declares closed sets (e.g., `direction`
 *     for scroll, `action` for voicePlayback, `mode` for voiceSetMode).
 *   - Ranges (e.g. zoom clamp [0.3, 3.0], voiceSetVolume [0,1]) enforced server-side
 *     in intent-parser.ts (Atom 20.1 §3 anti-absurd) per ADR-041 §6.2.
 *
 * Reference: ADR-041 §3.1-§3.7 + ADR-030 §3 Mistral FC canonical schema design.
 */
export const INTENT_TOOL_ARGS_SCHEMAS: Record<string, Record<string, unknown>> = {
  // ─── BASELINE 12 (iter 38) — preserved permissive args (additionalProperties:true) ───
  // Per intent-parser.ts iter 36 surface-to-browser pivot, args validation lives in
  // browser dispatcher. Schema kept permissive for backward-compat with iter 36-38 LLM
  // prompts that emit heterogeneous shapes (highlightComponent.args.ids vs args.id).

  highlightComponent: {
    type: 'object',
    properties: {
      ids: { type: 'array', items: { type: 'string' }, description: 'Component IDs to highlight (e.g. ["led1","r1"])' },
    },
    additionalProperties: true,
  },
  mountExperiment: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'Canonical experiment id (e.g. "v3-cap6-semaforo"). NOT experimentId.' },
    },
    required: ['id'],
    additionalProperties: false,
  },
  captureScreenshot: {
    type: 'object',
    properties: {
      target: { type: 'string', description: 'Optional: "circuit" | "lavagna" | "fullscreen". Default "circuit".' },
    },
    additionalProperties: true,
  },
  highlightPin: {
    type: 'object',
    properties: {
      ids: { type: 'array', items: { type: 'string' }, description: 'Pin refs (e.g. ["nano:D13"])' },
    },
    additionalProperties: true,
  },
  clearHighlights: { type: 'object', properties: {}, additionalProperties: false },
  clearCircuit: { type: 'object', properties: {}, additionalProperties: false },
  getCircuitState: { type: 'object', properties: {}, additionalProperties: false },
  getCircuitDescription: { type: 'object', properties: {}, additionalProperties: false },
  setComponentValue: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      field: { type: 'string', description: 'e.g. "value", "color", "resistance"' },
      value: { description: 'New value (string|number|boolean per field type)' },
    },
    required: ['id', 'field', 'value'],
    additionalProperties: false,
  },
  toggleDrawing: {
    type: 'object',
    properties: {
      enabled: { type: 'boolean' },
    },
    additionalProperties: true,
  },
  serialWrite: {
    type: 'object',
    properties: {
      text: { type: 'string', description: 'Text to write to serial monitor' },
    },
    required: ['text'],
    additionalProperties: false,
  },
  clearHighlightPins: { type: 'object', properties: {}, additionalProperties: false },

  // ─── §3.1 Mouse primitives (5) — iter 31 ralph 20.1 NEW ───

  click: {
    type: 'object',
    properties: {
      target: { type: 'string', description: 'CSS selector OR aria-label OR data-elab-action OR natural-language phrase.' },
      modifiers: {
        type: 'array',
        items: { type: 'string', enum: ['ctrl', 'shift', 'alt', 'meta'] },
        description: 'Optional modifier keys held during click.',
      },
    },
    required: ['target'],
    additionalProperties: false,
  },
  doubleClick: {
    type: 'object',
    properties: {
      target: { type: 'string', description: 'CSS selector OR aria-label OR data-elab-action OR natural-language phrase.' },
    },
    required: ['target'],
    additionalProperties: false,
  },
  rightClick: {
    type: 'object',
    properties: {
      target: { type: 'string' },
    },
    required: ['target'],
    additionalProperties: false,
  },
  hover: {
    type: 'object',
    properties: {
      target: { type: 'string' },
    },
    required: ['target'],
    additionalProperties: false,
  },
  scroll: {
    type: 'object',
    properties: {
      target: { type: 'string', description: 'Container element (CSS selector OR aria-label). Use "window" for page scroll.' },
      direction: { type: 'string', enum: ['up', 'down', 'left', 'right'] },
      amount: { type: 'number', description: 'Pixels to scroll. Default 200.' },
    },
    required: ['target', 'direction'],
    additionalProperties: false,
  },

  // ─── §3.1 Keyboard primitives (5) — iter 31 ralph 20.1 NEW ───

  type: {
    type: 'object',
    properties: {
      target: {
        type: ['string', 'null'],
        description: 'CSS selector OR aria-label of input. Null targets currently focused element.',
      },
      text: { type: 'string', description: 'Text to type. NEVER fill credentials/passwords (server pre-check rejects).' },
    },
    required: ['text'],
    additionalProperties: false,
  },
  key: {
    type: 'object',
    properties: {
      combo: {
        type: 'string',
        description: 'Key or combo (e.g. "Enter", "Escape", "Tab", "ctrl+z", "shift+Tab").',
      },
    },
    required: ['combo'],
    additionalProperties: false,
  },
  keyDown: {
    type: 'object',
    properties: {
      key: { type: 'string', description: 'Single key to hold down (e.g. "Shift").' },
    },
    required: ['key'],
    additionalProperties: false,
  },
  keyUp: {
    type: 'object',
    properties: {
      key: { type: 'string', description: 'Single key to release (must match prior keyDown).' },
    },
    required: ['key'],
    additionalProperties: false,
  },
  drag: {
    type: 'object',
    properties: {
      from: { type: 'string', description: 'Source CSS selector OR aria-label OR component id.' },
      to: { type: 'string', description: 'Destination CSS selector OR aria-label OR coordinate "x,y".' },
    },
    required: ['from', 'to'],
    additionalProperties: false,
  },

  // ─── §3.2 Window + modal + navigation (8) — iter 31 ralph 20.1 NEW ───

  openModal: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Modal canonical name (e.g. "easter", "update-prompt", "mic-permission", "passo-passo").',
      },
    },
    required: ['name'],
    additionalProperties: false,
  },
  closeModal: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Modal canonical name to close. Use "*" to close all.' },
    },
    required: ['name'],
    additionalProperties: false,
  },
  minimizeWindow: {
    type: 'object',
    properties: {
      title: { type: 'string', description: 'FloatingWindow title or aria-label.' },
    },
    required: ['title'],
    additionalProperties: false,
  },
  maximizeWindow: {
    type: 'object',
    properties: {
      title: { type: 'string', description: 'FloatingWindow title or aria-label.' },
    },
    required: ['title'],
    additionalProperties: false,
  },
  closeWindow: {
    type: 'object',
    properties: {
      title: { type: 'string', description: 'FloatingWindow title or aria-label.' },
    },
    required: ['title'],
    additionalProperties: false,
  },
  navigate: {
    type: 'object',
    properties: {
      route: {
        type: 'string',
        description: 'Hash route from VALID_HASHES (e.g. "#lavagna","#tutor","#chatbot-only","#about-easter","#home"). REQUIRES voice "sì conferma" gate per ADR-041 §5.3.',
      },
    },
    required: ['route'],
    additionalProperties: false,
  },
  back: { type: 'object', properties: {}, additionalProperties: false },
  forward: { type: 'object', properties: {}, additionalProperties: false },

  // ─── §3.3 Modalità 4 + lesson-paths (7) — iter 31 ralph 20.1 NEW ───

  toggleModalita: {
    type: 'object',
    properties: {
      modalita: {
        type: 'string',
        enum: ['percorso', 'libero', 'gia-montato', 'esperimento'],
        description: 'Modalità 4 simplified per ADR-025.',
      },
    },
    required: ['modalita'],
    additionalProperties: false,
  },
  highlightStep: {
    type: 'object',
    properties: {
      index: { type: 'integer', minimum: 0, description: 'Lesson-path step 0-indexed.' },
    },
    required: ['index'],
    additionalProperties: false,
  },
  nextStep: { type: 'object', properties: {}, additionalProperties: false },
  prevStep: { type: 'object', properties: {}, additionalProperties: false },
  nextExperiment: { type: 'object', properties: {}, additionalProperties: false },
  prevExperiment: { type: 'object', properties: {}, additionalProperties: false },
  restartLessonPath: { type: 'object', properties: {}, additionalProperties: false },

  // ─── §3.4 Voice + TTS playback (6) — iter 31 ralph 20.1 NEW ───

  voicePlayback: {
    type: 'object',
    properties: {
      action: {
        type: 'string',
        enum: ['play', 'pause', 'skip', 'replay', 'stop'],
      },
    },
    required: ['action'],
    additionalProperties: false,
  },
  voiceSetVolume: {
    type: 'object',
    properties: {
      percent: { type: 'number', minimum: 0, maximum: 1, description: 'Volume 0..1 (0=mute, 1=max).' },
    },
    required: ['percent'],
    additionalProperties: false,
  },
  voiceSetMode: {
    type: 'object',
    properties: {
      mode: { type: 'string', enum: ['always', 'ptt'], description: 'always-on vs push-to-talk.' },
    },
    required: ['mode'],
    additionalProperties: false,
  },
  startWakeWord: { type: 'object', properties: {}, additionalProperties: false },
  stopWakeWord: { type: 'object', properties: {}, additionalProperties: false },
  speak: {
    type: 'object',
    properties: {
      text: { type: 'string', minLength: 1, description: 'Italian text K-12 plurale "Ragazzi,". TTS via __ELAB_API.voice.speak.' },
    },
    required: ['text'],
    additionalProperties: false,
  },

  // ─── §3.5 Simulator-specific (4 most-used) — iter 31 ralph 20.1 NEW ───

  zoom: {
    type: 'object',
    properties: {
      direction: {
        description: 'Either "in"|"out"|"fit" OR a target zoom factor (number clamped [0.3,3.0] server-side).',
      },
    },
    required: ['direction'],
    additionalProperties: false,
  },
  pan: {
    type: 'object',
    properties: {
      dx: { type: 'number', description: 'Horizontal pan delta in pixels.' },
      dy: { type: 'number', description: 'Vertical pan delta in pixels.' },
    },
    required: ['dx', 'dy'],
    additionalProperties: false,
  },
  centerOn: {
    type: 'object',
    properties: {
      componentId: { type: 'string', description: 'Component id to center viewport on.' },
    },
    required: ['componentId'],
    additionalProperties: false,
  },
  selectComponent: {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'Component id to select on canvas.' },
    },
    required: ['id'],
    additionalProperties: false,
  },

  // ─── §3.6 Lavagna + chatbot + chat (3 most-used) — iter 31 ralph 20.1 NEW ───

  expandChatUnlim: { type: 'object', properties: {}, additionalProperties: false },
  switchTab: {
    type: 'object',
    properties: {
      tabId: { type: 'string', description: 'Tab canonical id (e.g. "lezione","manuale","fumetto","cronologia").' },
    },
    required: ['tabId'],
    additionalProperties: false,
  },
  togglePanel: {
    type: 'object',
    properties: {
      direction: { type: 'string', enum: ['left', 'right', 'bottom'] },
    },
    required: ['direction'],
    additionalProperties: false,
  },
};

/**
 * INTENT_TOOLS_SCHEMA — wrapped in MistralResponseFormat for direct
 * pass-through to `callLLM({ ..., responseFormat: INTENT_TOOLS_SCHEMA })`.
 *
 * Schema shape (per PDR §3 A7):
 *   {
 *     intents: [{ tool, args }],   // optional array of structured intents
 *     text: "Italian K-12 prose"   // mandatory plurale "Ragazzi," ≤60 parole
 *   }
 *
 * `text` is REQUIRED (every UNLIM reply needs prose). `intents` is OPTIONAL
 * (replies that don't trigger any browser action — e.g. pure explanation —
 * omit it). Browser-side intentsDispatcher iterates `intents[]` if present.
 *
 * Note on canonical args alignment:
 *   - mountExperiment.args.id : string  (NOT experimentId)
 *   - highlightComponent.args.ids : string[]
 *   - highlightPin.args.ids : string[] (e.g. ["nano:D13"])
 *   - setComponentValue.args : { id, field, value }
 * The schema below intentionally uses `additionalProperties: true` on the
 * inner `args` object because tools have heterogeneous argument shapes;
 * the per-tool args validation lives in the browser dispatcher (defensive
 * second line of defense + keeps Mistral happy with a permissive schema).
 */
export const INTENT_TOOLS_SCHEMA: MistralResponseFormat = {
  type: 'json_schema',
  json_schema: {
    name: 'unlim_response_with_intents',
    strict: false,
    schema: {
      type: 'object',
      properties: {
        intents: {
          type: 'array',
          description: 'Optional sequence of browser-dispatchable intents (highlight, mount, screenshot, etc.). Empty array or omitted when no UI action is needed.',
          items: {
            type: 'object',
            properties: {
              tool: {
                type: 'string',
                enum: [...CANONICAL_INTENT_TOOLS],
                description: 'Canonical tool name from the 12-tool browser whitelist.',
              },
              args: {
                type: 'object',
                additionalProperties: true,
                description: 'Per-tool arguments. mountExperiment.args.id (string), highlightComponent.args.ids (string[]), etc.',
              },
            },
            required: ['tool', 'args'],
            additionalProperties: false,
          },
        },
        text: {
          type: 'string',
          description: 'Italian K-12 plurale "Ragazzi," prose response. Max ~60 words. Cita Vol/pag verbatim quando RAG context lo include. Mention kit fisico in ultima frase.',
          minLength: 1,
        },
      },
      required: ['text'],
      additionalProperties: false,
    },
  },
};

/**
 * Detector heuristic — should the caller request structured output?
 *
 * The schema mode adds ~50-150ms latency (Mistral validates) and constrains
 * generation, so it's only worth using when the prompt LIKELY triggers a
 * browser action. Conservative trigger: explicit verbs like "mostra",
 * "evidenzia", "carica", "schermata", "screenshot", "monta", "highlight"
 * that map to one of the 12 tools.
 *
 * Returns false for chit-chat / pure-explanation prompts where the legacy
 * regex path is faster and equivalent.
 */
const ACTION_TRIGGER_RE =
  /\b(mostra|mostrami|evidenzi[ai]|highlight|carica|monta|montami|montiamo|screenshot|cattura|foto|scatta|pulisci|cancella|connect[ai]?|collega|cambia|imposta|apri|chiudi|vai|naviga|clicca|premi|scrivi|digita|ingrandisci|riduci|zoom|sposta|seleziona|prossim[oa]|precedente|riavvia|modalita|modalità|passo|esperimento|parla|leggi|silenzia|alza|abbassa|attiva|disattiva|finestra|pannello|tab|scheda)\b/i;

export function shouldUseIntentSchema(message: string | null | undefined): boolean {
  if (!message || typeof message !== 'string') return false;
  return ACTION_TRIGGER_RE.test(message);
}

export const INTENT_TOOLS_SCHEMA_VERSION = '2.0-iter31-ralph20.1';
