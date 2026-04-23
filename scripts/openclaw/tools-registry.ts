/**
 * OpenClaw Tools Registry — declarative list of all 52 static tools
 *
 * These are the ONNIPOTENZA primitives. OpenClaw's LLM plan generator
 * receives this schema and composes plans using only these tools (L1).
 * Generated morphic tools (L2/L3) are stored separately in tool-memory.ts.
 *
 * Contract:
 *   - Each tool has a `handler` path into window.__ELAB_API
 *   - Params are JSON-schema validated at runtime
 *   - Effect describes observable state change
 *   - pz_v3_sensitive: true → requires accompanying `speak` action per PZ v3
 *
 * (c) ELAB Tutor — 2026-04-22
 */

export interface ToolSpec {
  name: string;
  category: 'circuit' | 'read' | 'simulate' | 'visual' | 'code' | 'navigate' | 'vision' | 'ui' | 'voice' | 'memory' | 'meta';
  handler: string; // dot-path into window.__ELAB_API
  params: Record<string, { type: string; required?: boolean; enum?: string[]; description: string }>;
  returns?: string;
  effect: string;
  pz_v3_sensitive: boolean; // true = must be paired with a speakTTS action explaining to class
  since: string;
  added_in_sprint?: string;
}

export const OPENCLAW_TOOLS_REGISTRY: ToolSpec[] = [
  // ═══════════════════════════════════════════════════════════════════
  // CIRCUIT MANIPULATION (primary onnipotenza surface)
  // ═══════════════════════════════════════════════════════════════════
  {
    name: 'addComponent',
    category: 'circuit',
    handler: 'unlim.addComponent',
    params: {
      type: { type: 'string', required: true, enum: ['led', 'resistor', 'button', 'battery9v', 'potentiometer', 'buzzer', 'ldr', 'reed', 'capacitor', 'diode', 'transistor', 'servo'], description: 'tipo componente' },
      x: { type: 'number', required: false, description: 'posizione X breadboard (default auto)' },
      y: { type: 'number', required: false, description: 'posizione Y breadboard (default auto)' },
    },
    returns: 'string id del componente creato',
    effect: 'aggiunge componente al breadboard visibile',
    pz_v3_sensitive: true,
    since: '2026-04',
  },
  {
    name: 'removeComponent',
    category: 'circuit',
    handler: 'unlim.removeComponent',
    params: {
      id: { type: 'string', required: true, description: 'id componente da rimuovere' },
    },
    effect: 'rimuove componente',
    pz_v3_sensitive: true,
    since: '2026-04',
  },
  {
    name: 'addWire',
    category: 'circuit',
    handler: 'unlim.connectWire',
    params: {
      from: { type: 'string', required: true, description: 'formato comp:pin, es "led1:anode"' },
      to: { type: 'string', required: true, description: 'formato comp:pin, es "r1:pin1"' },
    },
    effect: 'crea filo tra due pin',
    pz_v3_sensitive: true,
    since: '2026-04',
  },
  {
    name: 'removeWire',
    category: 'circuit',
    handler: 'unlim.removeWire',
    params: { id: { type: 'string', required: true, description: 'id filo' } },
    effect: 'rimuove filo',
    pz_v3_sensitive: false,
    since: '2026-04',
  },
  {
    name: 'setComponentValue',
    category: 'circuit',
    handler: 'unlim.setComponentValue',
    params: {
      id: { type: 'string', required: true, description: 'id componente' },
      param: { type: 'string', required: true, description: 'nome parametro (resistance, voltage, value, position, ...)' },
      value: { type: 'any', required: true, description: 'nuovo valore' },
    },
    effect: 'cambia parametro componente (es r1.resistance=220)',
    pz_v3_sensitive: false,
    since: '2026-04',
  },
  {
    name: 'moveComponent',
    category: 'circuit',
    handler: 'unlim.moveComponent',
    params: {
      id: { type: 'string', required: true, description: 'id' },
      x: { type: 'number', required: true, description: 'X target' },
      y: { type: 'number', required: true, description: 'Y target' },
    },
    effect: 'sposta componente nella nuova posizione',
    pz_v3_sensitive: false,
    since: '2026-04',
  },
  {
    name: 'interact',
    category: 'circuit',
    handler: 'unlim.interact',
    params: {
      id: { type: 'string', required: true, description: 'id componente' },
      action: { type: 'string', required: true, enum: ['press', 'release', 'rotate', 'toggle'], description: 'azione' },
      value: { type: 'any', required: false, description: 'valore opzionale (es rotazione angolo)' },
    },
    effect: 'interagisce con componente (es premi pulsante)',
    pz_v3_sensitive: true,
    since: '2026-04',
  },
  {
    name: 'clearCircuit',
    category: 'circuit',
    handler: 'unlim.clearCircuit',
    params: {},
    effect: 'pulisce intera breadboard',
    pz_v3_sensitive: true,
    since: '2026-04',
  },

  // ═══════════════════════════════════════════════════════════════════
  // STATE READING (observation, onniscienza)
  // ═══════════════════════════════════════════════════════════════════
  {
    name: 'getCircuitState',
    category: 'read',
    handler: 'unlim.getCircuitState',
    params: {},
    returns: 'oggetto CircuitState completo',
    effect: 'ritorna stato corrente circuito',
    pz_v3_sensitive: false,
    since: '2026-04',
  },
  {
    name: 'getCircuitDescription',
    category: 'read',
    handler: 'unlim.getCircuitDescription',
    params: {},
    returns: 'string descrizione linguaggio naturale',
    effect: 'descrizione testuale del circuito corrente',
    pz_v3_sensitive: false,
    since: '2026-04',
  },
  {
    name: 'getCurrentExperiment',
    category: 'read',
    handler: 'unlim.getCurrentExperiment',
    params: {},
    returns: 'oggetto con {id, title, chapter, buildSteps}',
    effect: 'metadata esperimento corrente',
    pz_v3_sensitive: false,
    since: '2026-04',
  },
  {
    name: 'getBuildStepIndex',
    category: 'read',
    handler: 'unlim.getBuildStepIndex',
    params: {},
    returns: 'number indice passo corrente (0-based) o -1 se non in modalità guidata',
    effect: 'indice step build corrente',
    pz_v3_sensitive: false,
    since: '2026-04',
  },
  {
    name: 'getSimulationStatus',
    category: 'read',
    handler: 'unlim.getSimulationStatus',
    params: {},
    returns: 'string: "running" | "paused" | "stopped"',
    effect: 'stato simulazione',
    pz_v3_sensitive: false,
    since: '2026-04',
  },

  // ═══════════════════════════════════════════════════════════════════
  // SIMULATION (run control)
  // ═══════════════════════════════════════════════════════════════════
  {
    name: 'play',
    category: 'simulate',
    handler: 'unlim.play',
    params: {},
    effect: 'avvia simulazione',
    pz_v3_sensitive: true,
    since: '2026-04',
  },
  {
    name: 'pause',
    category: 'simulate',
    handler: 'unlim.pause',
    params: {},
    effect: 'mette in pausa simulazione',
    pz_v3_sensitive: false,
    since: '2026-04',
  },
  {
    name: 'reset',
    category: 'simulate',
    handler: 'unlim.reset',
    params: {},
    effect: 'reset circuito a stato iniziale esperimento',
    pz_v3_sensitive: true,
    since: '2026-04',
  },

  // ═══════════════════════════════════════════════════════════════════
  // VISUAL AIDS (didattica)
  // ═══════════════════════════════════════════════════════════════════
  {
    name: 'highlight',
    category: 'visual',
    handler: 'unlim.highlightComponent',
    params: {
      ids: { type: 'array', required: true, description: 'array di id componenti da evidenziare' },
    },
    effect: 'evidenzia componenti con glow visivo',
    pz_v3_sensitive: false,
    since: '2026-04',
  },
  {
    name: 'highlightPin',
    category: 'visual',
    handler: 'unlim.highlightPin',
    params: {
      pins: { type: 'array', required: true, description: 'array di pin, es ["nano:D13", "led1:anode"]' },
    },
    effect: 'evidenzia pin specifici',
    pz_v3_sensitive: false,
    since: '2026-04',
  },
  {
    name: 'clearHighlights',
    category: 'visual',
    handler: 'unlim.clearHighlights',
    params: {},
    effect: 'rimuove tutti gli highlight',
    pz_v3_sensitive: false,
    since: '2026-04',
  },

  // ═══════════════════════════════════════════════════════════════════
  // CODE (Arduino C++ + Scratch/Blockly)
  // ═══════════════════════════════════════════════════════════════════
  {
    name: 'compile',
    category: 'code',
    handler: 'unlim.compile',
    params: {},
    returns: 'object {success, hex, errors, warnings}',
    effect: 'compila codice editor Arduino corrente',
    pz_v3_sensitive: true,
    since: '2026-04',
  },
  {
    name: 'setEditorCode',
    category: 'code',
    handler: 'unlim.setEditorCode',
    params: {
      code: { type: 'string', required: true, description: 'codice Arduino C++ completo' },
    },
    effect: 'sovrascrive codice editor',
    pz_v3_sensitive: true,
    since: '2026-04',
  },
  {
    name: 'getEditorCode',
    category: 'code',
    handler: 'unlim.getEditorCode',
    params: {},
    returns: 'string codice corrente',
    effect: 'ritorna codice editor',
    pz_v3_sensitive: false,
    since: '2026-04',
  },
  {
    name: 'appendEditorCode',
    category: 'code',
    handler: 'unlim.appendEditorCode',
    params: {
      code: { type: 'string', required: true, description: 'codice da aggiungere in fondo' },
    },
    effect: 'append al codice esistente',
    pz_v3_sensitive: false,
    since: '2026-04',
  },
  {
    name: 'loadScratchWorkspace',
    category: 'code',
    handler: 'unlim.loadScratchWorkspace',
    params: {
      xml: { type: 'string', required: true, description: 'Blockly XML workspace' },
    },
    effect: 'carica workspace Scratch/Blockly',
    pz_v3_sensitive: true,
    since: '2026-04',
  },

  // ═══════════════════════════════════════════════════════════════════
  // NAVIGATION (guided build steps)
  // ═══════════════════════════════════════════════════════════════════
  {
    name: 'nextStep',
    category: 'navigate',
    handler: 'unlim.nextStep',
    params: {},
    effect: 'avanza al prossimo step del build guidato',
    pz_v3_sensitive: true,
    since: '2026-04',
  },
  {
    name: 'prevStep',
    category: 'navigate',
    handler: 'unlim.prevStep',
    params: {},
    effect: 'torna indietro di uno step',
    pz_v3_sensitive: true,
    since: '2026-04',
  },
  {
    name: 'mountExperiment',
    category: 'navigate',
    handler: 'unlim.mountExperiment',
    params: {
      id: { type: 'string', required: true, description: 'es "v1-cap6-esp1"' },
    },
    effect: 'carica esperimento specifico',
    pz_v3_sensitive: true,
    since: '2026-04',
  },
  {
    name: 'setBuildMode',
    category: 'navigate',
    handler: 'unlim.setBuildMode',
    params: {
      mode: { type: 'string', required: true, enum: ['complete', 'guided', 'sandbox'], description: 'modalità build' },
    },
    effect: 'cambia modalità (Già Montato / Passo Passo / Libero)',
    pz_v3_sensitive: true,
    since: '2026-04',
  },

  // ═══════════════════════════════════════════════════════════════════
  // VISION (circuit photos)
  // ═══════════════════════════════════════════════════════════════════
  {
    name: 'captureScreenshot',
    category: 'vision',
    handler: 'unlim.captureScreenshot',
    params: {},
    returns: 'string base64 PNG',
    effect: 'cattura screenshot corrente breadboard',
    pz_v3_sensitive: false,
    since: '2026-04',
  },
  {
    name: 'analyzeImage',
    category: 'vision',
    handler: 'unlim.analyzeImage',
    params: {
      image: { type: 'string', required: true, description: 'base64 PNG' },
    },
    returns: 'string analisi Vision LLM',
    effect: 'analizza immagine con Qwen VL',
    pz_v3_sensitive: false,
    since: '2026-04',
  },

  // ═══════════════════════════════════════════════════════════════════
  // TUTOR UI CONTROL
  // ═══════════════════════════════════════════════════════════════════
  {
    name: 'showBom',
    category: 'ui',
    handler: 'unlim.showBom',
    params: {},
    effect: 'mostra Bill of Materials (lista componenti)',
    pz_v3_sensitive: false,
    since: '2026-04',
  },
  {
    name: 'showSerialMonitor',
    category: 'ui',
    handler: 'unlim.showSerialMonitor',
    params: {},
    effect: 'apre Serial Monitor',
    pz_v3_sensitive: false,
    since: '2026-04',
  },
  {
    name: 'toggleDrawing',
    category: 'ui',
    handler: 'unlim.toggleDrawing',
    params: {
      enabled: { type: 'boolean', required: true, description: 'true=abilita penna, false=disabilita' },
    },
    effect: 'abilita/disabilita modalità disegno su lavagna',
    pz_v3_sensitive: false,
    since: '2026-04',
  },

  // ═══════════════════════════════════════════════════════════════════
  // VOICE (Voxtral TTS + Whisper STT)
  // ═══════════════════════════════════════════════════════════════════
  {
    name: 'speakTTS',
    category: 'voice',
    handler: 'unlim.speakTTS',
    params: {
      text: { type: 'string', required: true, description: 'testo da pronunciare (MUST pass PZ v3 validator)' },
      voice: { type: 'string', required: false, enum: ['francesca-it', 'emma-en', 'lucia-es', 'celine-fr', 'kathrin-de'], description: 'voce locale' },
      speed: { type: 'number', required: false, description: 'velocità 0.5-1.5, default 0.95 bambino' },
    },
    effect: 'UNLIM parla testo attraverso Voxtral TTS',
    pz_v3_sensitive: true, // itself is the speak validator target
    since: '2026-05',
    added_in_sprint: 'sprint-6',
  },
  {
    name: 'listenSTT',
    category: 'voice',
    handler: 'unlim.listenSTT',
    params: {
      timeout: { type: 'number', required: false, description: 'timeout ms, default 8000' },
    },
    returns: 'string trascrizione Whisper Turbo',
    effect: 'ascolta microfono e trascrive',
    pz_v3_sensitive: false,
    since: '2026-05',
    added_in_sprint: 'sprint-6',
  },

  // ═══════════════════════════════════════════════════════════════════
  // MEMORY (Supabase state)
  // ═══════════════════════════════════════════════════════════════════
  {
    name: 'saveSessionMemory',
    category: 'memory',
    handler: 'unlim.saveSessionMemory',
    params: {
      summary: { type: 'string', required: true, description: 'riassunto testuale ciò che è stato fatto' },
      concepts_learned: { type: 'array', required: false, description: 'array di concetti assimilati' },
      concepts_struggled: { type: 'array', required: false, description: 'array di concetti in difficoltà' },
    },
    effect: 'salva riassunto sessione su Supabase (GDPR-compliant anonymized)',
    pz_v3_sensitive: false,
    since: '2026-05',
    added_in_sprint: 'sprint-6',
  },
  {
    name: 'recallPastSession',
    category: 'memory',
    handler: 'unlim.recallPastSession',
    params: {
      student_hash: { type: 'string', required: true, description: 'hash anonimo studente' },
      n: { type: 'number', required: false, description: 'quante ultime sessioni (default 5)' },
    },
    returns: 'array di SessionSummary',
    effect: 'recupera ultime N sessioni dello studente',
    pz_v3_sensitive: false,
    since: '2026-05',
    added_in_sprint: 'sprint-6',
  },

  // ═══════════════════════════════════════════════════════════════════
  // META (nudge, alert, generate content)
  // ═══════════════════════════════════════════════════════════════════
  {
    name: 'showNudge',
    category: 'meta',
    handler: 'unlim.showNudge',
    params: {
      type: { type: 'string', required: true, enum: ['hint', 'warning', 'celebration', 'retry'], description: 'tipo nudge' },
      message: { type: 'string', required: true, description: 'messaggio nudge (pass PZ v3)' },
    },
    effect: 'mostra mascotte UNLIM con messaggio contestuale',
    pz_v3_sensitive: true,
    since: '2026-05',
    added_in_sprint: 'sprint-6',
  },
  {
    name: 'generateQuiz',
    category: 'meta',
    handler: 'unlim.generateQuiz',
    params: {
      topic: { type: 'string', required: true, description: 'argomento es "legge Ohm"' },
      n: { type: 'number', required: false, description: 'numero domande (default 3)' },
      difficulty: { type: 'string', required: false, enum: ['easy', 'medium', 'hard'] },
    },
    returns: 'array di {question, options, correct, explanation}',
    effect: 'genera quiz dinamico (LLM + Wiki LLM RAG)',
    pz_v3_sensitive: false,
    since: '2026-05',
    added_in_sprint: 'sprint-6',
  },
  {
    name: 'exportFumetto',
    category: 'meta',
    handler: 'unlim.exportFumetto',
    params: {
      session_id: { type: 'string', required: false, description: 'sessione da esportare (default: current)' },
    },
    returns: 'string URL PDF generato',
    effect: 'genera Report Fumetto PDF via FLUX.1-schnell async',
    pz_v3_sensitive: false,
    since: '2026-05',
    added_in_sprint: 'sprint-6',
  },
  {
    name: 'videoLoad',
    category: 'meta',
    handler: 'unlim.videoLoad',
    params: {
      youtubeId: { type: 'string', required: true, description: 'YouTube video ID' },
      startAt: { type: 'number', required: false, description: 'secondo partenza' },
    },
    effect: 'carica e mostra video YouTube embedded',
    pz_v3_sensitive: true,
    since: '2026-05',
    added_in_sprint: 'sprint-6',
  },
  {
    name: 'alertDocente',
    category: 'meta',
    handler: 'unlim.alertDocente',
    params: {
      reason: { type: 'string', required: true, description: 'motivo alert (es "studente bloccato su esperimento")' },
      urgency: { type: 'string', required: false, enum: ['low', 'medium', 'high'], description: 'default medium' },
    },
    effect: 'mostra alert visuale discreto per docente (no interruzione classe)',
    pz_v3_sensitive: false,
    since: '2026-05',
    added_in_sprint: 'sprint-6',
  },
];

// Export counts for sanity check
export const TOTAL_TOOLS = OPENCLAW_TOOLS_REGISTRY.length;
export const CATEGORIES = [...new Set(OPENCLAW_TOOLS_REGISTRY.map(t => t.category))];
export const NEW_IN_SPRINT_6 = OPENCLAW_TOOLS_REGISTRY.filter(t => t.added_in_sprint === 'sprint-6').length;

// Helper: build JSON Schema for LLM tool-use
export function buildJsonSchemaForLLM(): Record<string, unknown> {
  return {
    tools: OPENCLAW_TOOLS_REGISTRY.map(t => ({
      name: t.name,
      description: t.effect,
      parameters: {
        type: 'object',
        properties: Object.fromEntries(
          Object.entries(t.params).map(([k, p]) => [k, { type: p.type, enum: p.enum, description: p.description }])
        ),
        required: Object.entries(t.params).filter(([, p]) => p.required).map(([k]) => k),
      },
    })),
  };
}

if (typeof module !== 'undefined' && module.exports) {
  console.log(`OPENCLAW_TOOLS_REGISTRY loaded: ${TOTAL_TOOLS} tools across ${CATEGORIES.length} categories.`);
  console.log(`New in Sprint 6: ${NEW_IN_SPRINT_6} tools (saveSessionMemory, recallPastSession, showNudge, generateQuiz, exportFumetto, videoLoad, alertDocente, speakTTS, listenSTT = 9, some were proposed earlier).`);
}
