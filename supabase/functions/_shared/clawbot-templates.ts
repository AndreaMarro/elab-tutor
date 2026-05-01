/**
 * ClawBot L2 Templates — Deno-portable inline registry.
 *
 * Sprint T iter 26 — agent gen-app — 2026-04-28.
 *
 * Source of truth: `scripts/openclaw/templates/L2-*.json` (20 JSON files).
 * Why inline: Edge Functions run on Deno deploy without filesystem access to
 * `scripts/`. Inlining avoids fetch-at-startup latency and bundles all 20
 * morphic templates into the worker.
 *
 * Each template encodes a Sense-1.5 morphic pattern (docente/classe/kit
 * adaptation) + Principio Zero ("Ragazzi," plurale + Vol/pag verbatim
 * citation). Sequences are arrays of tool dispatches with `${inputs.X}` and
 * `${prev.Y}` argument interpolation.
 *
 * Caveman tone applied: only fields needed by router + executor are kept
 * (id, name, description, category, principio_zero, inputs, sequence,
 * fallback_strategy). Telemetry + test_assertions live in the JSON source.
 */

export type ClawBotCategory =
  | 'lesson-explain'
  | 'lesson-introduce'
  | 'lesson-diagnose'
  | 'lesson-guide'
  | 'lesson-recap'
  | 'lesson-celebrate'
  | 'lesson-program-first'
  | 'feedback-positive'
  | 'critique-vision'
  | 'diagnose'
  | 'diagnose-error'
  | 'diagnose-vision'
  | 'guide-action'
  | 'guide-build'
  | 'error-recovery';

export type ClawBotFallback = 'halt-on-error' | 'continue' | 'retry' | 'retry-then-halt';

export interface ClawBotPrincipioZero {
  plurale_obbligatorio: string;
  citazione_verbatim: boolean;
  max_parole: number;
  max_frasi?: number;
  vol_pag?: string;
  analogia?: string;
}

export interface ClawBotStep {
  step: string;
  tool: string;
  args: Record<string, unknown>;
  expected_status: 'ok';
}

export interface ClawBotTemplate {
  id: string;
  name: string;
  description: string;
  category: ClawBotCategory;
  principio_zero: ClawBotPrincipioZero;
  inputs: Record<string, unknown>;
  sequence: ClawBotStep[];
  fallback_strategy: ClawBotFallback;
  expected_total_latency_ms?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// 20 L2 TEMPLATES (inlined — synced from scripts/openclaw/templates/L2-*.json
// 2026-04-28).
// ─────────────────────────────────────────────────────────────────────────────

export const TEMPLATES_L2: ClawBotTemplate[] = [
  {
    id: 'L2-celebrate-end-volume',
    name: 'celebrateEndVolume',
    description: "Morphic template iter 15: chiusura volume completo — riassunto capitoli + transizione next volume. Citazione VERBATIM ultima pagina Vol + voice TTS Isabella + analogia traguardo tappa Giro.",
    category: 'lesson-celebrate',
    principio_zero: { plurale_obbligatorio: 'Ragazzi,', citazione_verbatim: true, max_parole: 60, max_frasi: 3, vol_pag: 'Vol.1 pag.156', analogia: "fine volume come traguardo di tappa Giro d'Italia" },
    inputs: { experimentId: 'v1-end', volumeId: 'vol1' },
    sequence: [
      { step: 'highlight-all-experiments-done', tool: 'highlightComponent', args: { ids: ['progress:vol1'], color: 'green' }, expected_status: 'ok' },
      { step: 'ask-unlim-recap', tool: 'askUNLIM', args: { query: 'Riassumi capitoli Vol.1 completati + introduci Vol.2 cap.7', vol: 'Vol.1', cap: 'all' }, expected_status: 'ok' },
      { step: 'show-nudge-next-volume', tool: 'showNudge', args: { text: 'Avete completato Volume 1! Prossima sessione apriamo Volume 2 capitolo 7: scheda Arduino', duration_ms: 5500 }, expected_status: 'ok' },
      { step: 'capture-screenshot-celebration', tool: 'captureScreenshot', args: { target: 'volume-completion-screen' }, expected_status: 'ok' },
      { step: 'speak-celebrate', tool: 'speakTTS', args: { text: "Ragazzi, Vol.1 pag.156: 'fine del primo viaggio'. Avete completato 6 capitoli. E come traguardo tappa Giro d'Italia. Prossima tappa: Vol.2 Arduino.", voice: 'it-IT-IsabellaNeural', speed: 0.95 }, expected_status: 'ok' },
    ],
    fallback_strategy: 'halt-on-error',
    expected_total_latency_ms: 5800,
  },
  {
    id: 'L2-celebrate-experiment-complete',
    name: 'celebrateExperimentComplete',
    description: 'Morphic template: feedback positivo classe dopo esperimento completato con successo + suggerimento next experiment coerente percorso. Capture screenshot finale, nudge celebrativo, voice TTS Isabella tono caldo, citazione volume.',
    category: 'feedback-positive',
    principio_zero: { plurale_obbligatorio: 'Ragazzi,', citazione_verbatim: true, max_parole: 60, max_frasi: 3, vol_pag: 'Vol.1 pag.10', analogia: 'primo passo da elettronici veri' },
    inputs: { experimentId: '', nextExperimentId: '', completionTime_s: 0 },
    sequence: [
      { step: 'capture-screenshot-success', tool: 'captureScreenshot', args: { target: 'experiment-complete', annotate: true, saveToReport: true }, expected_status: 'ok' },
      { step: 'highlight-led-success', tool: 'highlightComponent', args: { ids: ['led1'], color: 'green', duration_ms: 5000, pulse: true }, expected_status: 'ok' },
      { step: 'ask-unlim-next-suggestion', tool: 'askUNLIM', args: { query: 'esperimento completato successo suggerimento next coerente percorso volume', context: 'celebrate-and-suggest-next', experimentCompleted: '${inputs.experimentId}' }, expected_status: 'ok' },
      { step: 'show-nudge-celebrate', tool: 'showNudge', args: { text: 'Bravissimi! Esperimento riuscito. Pronti per il prossimo?', type: 'celebration', duration_ms: 7000 }, expected_status: 'ok' },
      { step: 'speak-celebrate', tool: 'speakTTS', args: { text: 'Ragazzi, bravissimi! Avete fatto il vostro primo passo da elettronici veri. Vol.1 pag.10: ogni circuito che funziona è una piccola vittoria. Pronti per il prossimo esperimento?', voice: 'it-IT-IsabellaNeural', speed: 0.95 }, expected_status: 'ok' },
    ],
    fallback_strategy: 'halt-on-error',
    expected_total_latency_ms: 4800,
  },
  {
    id: 'L2-critique-circuit-photo',
    name: 'critiqueCircuitPhoto',
    description: "Morphic template: critica costruttiva foto webcam del circuito fisico ragazzi. Vision EU identifica differenze vs riferimento volume, sintetizza 1 punto positivo + 1 da migliorare con citazione verbatim, parla pronunciando plurale 'Ragazzi,'.",
    category: 'critique-vision',
    principio_zero: { plurale_obbligatorio: 'Ragazzi,', citazione_verbatim: true, max_parole: 60, max_frasi: 3 },
    inputs: { photoUrl: '', experimentId: '', referenceFigureId: '' },
    sequence: [
      { step: 'post-vision-photo', tool: 'postToVisionEndpoint', args: { image: '${inputs.photoUrl}', task: 'compare-vs-reference', referenceFigureId: '${inputs.referenceFigureId}' }, expected_status: 'ok' },
      { step: 'rag-retrieve-reference', tool: 'ragRetrieve', args: { query: '${inputs.experimentId} schema riferimento corretto kit', topK: 3, wikiFusion: true }, expected_status: 'ok' },
      { step: 'highlight-positive-area', tool: 'highlightComponent', args: { ids: '${prev.positiveAreaIds}', color: 'green' }, expected_status: 'ok' },
      { step: 'highlight-improvement-area', tool: 'highlightComponent', args: { ids: '${prev.improvementAreaIds}', color: 'orange' }, expected_status: 'ok' },
      { step: 'speak-critique', tool: 'speakTTS', args: { text: "Ragazzi, ottimo lavoro sul collegamento verde. Vol.${citation.vol} pag.${citation.page}: '${citation.verbatim}'. Verifichiamo la zona arancione insieme.", voice: 'it-IT-IsabellaNeural', speed: 0.95 }, expected_status: 'ok' },
    ],
    fallback_strategy: 'halt-on-error',
    expected_total_latency_ms: 5800,
  },
  {
    id: 'L2-debug-short-circuit',
    name: 'debugShortCircuit',
    description: "Morphic template: rilevamento corto-circuito breadboard via vision Gemini + suggerimento riposiziona componenti. Highlight rotaie alimentazione, captura foto kit, diagnosi automatica, voice TTS Isabella avverte classe. Citazione Vol.1 pag.45 'attenzione cortocircuito'.",
    category: 'diagnose-error',
    principio_zero: { plurale_obbligatorio: 'Ragazzi,', citazione_verbatim: true, max_parole: 60, max_frasi: 3, vol_pag: 'Vol.1 pag.45', analogia: 'ponte diretto tra positivo e negativo = scorciatoia che brucia' },
    inputs: { experimentId: '', errorContext: {} },
    sequence: [
      { step: 'highlight-power-rails', tool: 'highlightComponent', args: { ids: ['bus-bot-plus', 'bus-bot-minus'], color: 'red', duration_ms: 3000 }, expected_status: 'ok' },
      { step: 'capture-screenshot-breadboard', tool: 'captureScreenshot', args: { target: 'breadboard-full', annotate: true, submitToVision: true }, expected_status: 'ok' },
      { step: 'ask-unlim-diagnose-short', tool: 'askUNLIM', args: { query: 'diagnosi corto circuito breadboard rotaie positivo negativo collegate diretto', context: 'diagnose-short-circuit', useVision: true }, expected_status: 'ok' },
      { step: 'show-nudge-disconnect', tool: 'showNudge', args: { text: 'STOP! Scollegate la batteria subito. Controllate filo rosso e nero non si tocchino.', type: 'warning', duration_ms: 8000 }, expected_status: 'ok' },
      { step: 'speak-warning-short', tool: 'speakTTS', args: { text: 'Ragazzi, Vol.1 pag.45 dice attenzione cortocircuito. Il filo rosso tocca il nero: scollegate subito la batteria e separate i fili.', voice: 'it-IT-IsabellaNeural', speed: 0.92 }, expected_status: 'ok' },
    ],
    fallback_strategy: 'halt-on-error',
    expected_total_latency_ms: 5500,
  },
  {
    id: 'L2-diagnose-led-fioco',
    name: 'diagnoseLedFioco',
    description: 'Morphic template iter 15: LED basso brightness diagnosi vision — captureScreenshot + postToVisionEndpoint detect resistenza troppo alta + suggerisci R 220Ohm. Citazione VERBATIM Vol.1 + voice TTS Isabella.',
    category: 'lesson-diagnose',
    principio_zero: { plurale_obbligatorio: 'Ragazzi,', citazione_verbatim: true, max_parole: 60, max_frasi: 3, vol_pag: 'Vol.1 pag.78', analogia: 'LED fioco come lampadina con cavo troppo sottile = poca corrente' },
    inputs: { experimentId: 'v1-cap6-esp2' },
    sequence: [
      { step: 'capture-screenshot-led-dim', tool: 'captureScreenshot', args: { target: 'led-brightness-check' }, expected_status: 'ok' },
      { step: 'post-vision-detect-fioco', tool: 'postToVisionEndpoint', args: { diagnosis: 'led-low-brightness', expected_resistor_ohm: 220 }, expected_status: 'ok' },
      { step: 'highlight-resistor-too-high', tool: 'highlightComponent', args: { ids: ['r1'], color: 'red' }, expected_status: 'ok' },
      { step: 'show-nudge-replace-220', tool: 'showNudge', args: { text: 'Sostituite la resistenza con 220Ohm (rosso-rosso-marrone): LED tornera luminoso', duration_ms: 5000 }, expected_status: 'ok' },
      { step: 'speak-diagnosis', tool: 'speakTTS', args: { text: "Ragazzi, Vol.1 pag.78: 'resistenza troppo alta limita la corrente'. Il LED e fioco perche la R e troppo alta. Sostituite con 220Ohm.", voice: 'it-IT-IsabellaNeural', speed: 0.95 }, expected_status: 'ok' },
    ],
    fallback_strategy: 'halt-on-error',
    expected_total_latency_ms: 5800,
  },
  {
    id: 'L2-diagnose-led-rovesciato',
    name: 'diagnoseLedRovesciato',
    description: 'Morphic template diagnosi vision LED catodo errato (anodo invertito polarità) — captureScreenshot + Vision detect + animazione rotazione 180° + nudge orientamento gamba lunga + cita Vol.1 cap.6.',
    category: 'diagnose-vision',
    principio_zero: { plurale_obbligatorio: 'Ragazzi,', citazione_verbatim: true, max_parole: 60, max_frasi: 3, vol_pag: 'Vol.1 pag.52', analogia: 'il LED ha una freccia: gamba lunga (anodo) verso il +' },
    inputs: { experimentId: 'v1-cap6-esp1' },
    sequence: [
      { step: 'capture-screenshot-led', tool: 'captureScreenshot', args: { purpose: 'diagnose-led-polarity', focus: 'led1' }, expected_status: 'ok' },
      { step: 'ask-unlim-vision-diagnose', tool: 'askUNLIM', args: { query: 'Vedi il LED del kit fisico: anodo gamba lunga verso + o gamba corta? Ribaltato?', context: 'Vol.1 cap.6 polarità LED' }, expected_status: 'ok' },
      { step: 'highlight-component-led-error', tool: 'highlightComponent', args: { ids: ['led1'], color: 'red', animation: 'rotate-180' }, expected_status: 'ok' },
      { step: 'show-nudge-flip', tool: 'showNudge', args: { text: 'Ragazzi, ruotate il LED di 180°: gamba lunga (anodo) verso la riga rossa del +', position: 'near-component', duration_ms: 5000 }, expected_status: 'ok' },
      { step: 'speak-correction', tool: 'speakTTS', args: { text: "Ragazzi, Vol.1 pag.52 'il LED ha polarità: gamba lunga verso il +'. Sul kit ruotate il LED di 180 gradi: gamba lunga vicino alla riga rossa.", voice: 'it-IT-IsabellaNeural', speed: 0.95 }, expected_status: 'ok' },
    ],
    fallback_strategy: 'halt-on-error',
    expected_total_latency_ms: 5800,
  },
  {
    id: 'L2-diagnose-no-current',
    name: 'diagnoseNoCurrent',
    description: "Morphic template: diagnosi 'circuito non funziona / corrente assente'. Cattura screenshot kit fisico, posta a Vision EU, identifica 1 errore principale (polarità invertita / resistenza mancante / batteria scarica), highlight componente, parla diagnosi al docente.",
    category: 'diagnose',
    principio_zero: { plurale_obbligatorio: 'Ragazzi,', citazione_verbatim: true, max_parole: 60, max_frasi: 3 },
    inputs: { circuitState: {}, experimentId: '' },
    sequence: [
      { step: 'capture-screenshot', tool: 'captureScreenshot', args: { target: 'simulator-canvas' }, expected_status: 'ok' },
      { step: 'post-vision-endpoint', tool: 'postToVisionEndpoint', args: { image: '${prev.image}', task: 'identify-circuit-fault' }, expected_status: 'ok' },
      { step: 'rag-retrieve-fault', tool: 'ragRetrieve', args: { query: 'circuito aperto polarità LED batteria scarica', topK: 3, wikiFusion: true }, expected_status: 'ok' },
      { step: 'highlight-faulty-component', tool: 'highlightComponent', args: { ids: '${prev.faultyIds}', color: 'red' }, expected_status: 'ok' },
      { step: 'speak-diagnosis', tool: 'speakTTS', args: { text: "Ragazzi, Vol.${citation.vol} pag.${citation.page} dice '${citation.verbatim}'. Controllate il componente evidenziato in rosso sul kit.", voice: 'it-IT-IsabellaNeural', speed: 0.95 }, expected_status: 'ok' },
    ],
    fallback_strategy: 'halt-on-error',
    expected_total_latency_ms: 5500,
  },
  {
    id: 'L2-explain-condensatore-tempo',
    name: 'explainCondensatoreTempo',
    description: 'Morphic template condensatore + costante tempo τ=RC Vol.2 cap.10 — analogia secchio acqua riempimento progressivo + highlight componenti + grafico carica + cita testo verbatim volume.',
    category: 'lesson-explain',
    principio_zero: { plurale_obbligatorio: 'Ragazzi,', citazione_verbatim: true, max_parole: 60, max_frasi: 3, vol_pag: 'Vol.2 pag.78', analogia: 'il condensatore è un secchio: la resistenza è il rubinetto, τ è il tempo per riempirlo al 63%' },
    inputs: { experimentId: 'v2-cap10-esp1' },
    sequence: [
      { step: 'highlight-rc-circuit', tool: 'highlightComponent', args: { ids: ['c1', 'r1'], color: 'orange', pulse: true }, expected_status: 'ok' },
      { step: 'ask-unlim-rc-formula', tool: 'askUNLIM', args: { query: 'Spiega τ = R × C analogia secchio acqua per classe secondaria', context: 'Vol.2 cap.10 condensatore costante tempo' }, expected_status: 'ok' },
      { step: 'show-nudge-formula', tool: 'showNudge', args: { text: 'τ = R × C → con R=10kΩ e C=100µF il secchio si riempie al 63% in 1 secondo', position: 'side-panel', duration_ms: 6000 }, expected_status: 'ok' },
      { step: 'capture-screenshot-curve', tool: 'captureScreenshot', args: { purpose: 'verify-rc-curve', annotateTau: true }, expected_status: 'ok' },
      { step: 'speak-explain', tool: 'speakTTS', args: { text: "Ragazzi, Vol.2 pag.78 'il prodotto R per C è la costante di tempo tau'. Pensate al condensatore come secchio: tau è quanto tempo serve a riempirlo al 63 per cento.", voice: 'it-IT-IsabellaNeural', speed: 0.95 }, expected_status: 'ok' },
    ],
    fallback_strategy: 'halt-on-error',
    expected_total_latency_ms: 5500,
  },
  {
    id: 'L2-explain-led-blink',
    name: 'explainLedBlink',
    description: "Morphic template: spiega l'esperimento LED lampeggiante (Blink) con highlight visuale, citazione VERBATIM dal Volume e voice TTS Isabella. Adatta tono per docente esperto vs primo anno (Sense 1.5).",
    category: 'lesson-explain',
    principio_zero: { plurale_obbligatorio: 'Ragazzi,', citazione_verbatim: true, max_parole: 60, max_frasi: 3 },
    inputs: { experimentId: 'v1-cap6-esp1' },
    sequence: [
      { step: 'highlight-experiment', tool: 'highlightExperiment', args: { experimentId: '${inputs.experimentId}' }, expected_status: 'ok' },
      { step: 'mount-experiment', tool: 'mountExperiment', args: { experimentId: '${inputs.experimentId}' }, expected_status: 'ok' },
      { step: 'highlight-component-led', tool: 'highlightComponent', args: { ids: ['led1', 'r1'] }, expected_status: 'ok' },
      { step: 'rag-retrieve-led-blink', tool: 'ragRetrieve', args: { query: 'LED Blink lampeggio digitalWrite delay', topK: 3, wikiFusion: true }, expected_status: 'ok' },
      { step: 'speak-intro', tool: 'speakTTS', args: { text: "Ragazzi, Vol.1 pag.${citation.page} '${citation.verbatim}'. Sul kit guardate il LED rosso e la resistenza da 220Ω in serie.", voice: 'it-IT-IsabellaNeural', speed: 0.95 }, expected_status: 'ok' },
    ],
    fallback_strategy: 'halt-on-error',
    expected_total_latency_ms: 4500,
  },
  {
    id: 'L2-explain-pwm-fade',
    name: 'explainPwmFade',
    description: 'Morphic template: spiegazione PWM + analogWrite via analogia rubinetto rapido aperto/chiuso (Vol.1 cap.6 / Vol.2 cap.8 LED fade). Highlight pin PWM (D3,D5,D6,D9,D10,D11) sul Nano, esempio fade 0-255, citazione VERBATIM, voice TTS Isabella.',
    category: 'lesson-explain',
    principio_zero: { plurale_obbligatorio: 'Ragazzi,', citazione_verbatim: true, max_parole: 60, max_frasi: 3, vol_pag: 'Vol.2 pag.78', analogia: 'rubinetto rapido aperto/chiuso = LED che lampeggia velocissimo sembra dimmer' },
    inputs: { experimentId: 'v2-cap8-esp1', pwmPin: 'D9', fadeRange: '0-255' },
    sequence: [
      { step: 'highlight-pwm-pins', tool: 'highlightPin', args: { ids: ['nano:D3', 'nano:D5', 'nano:D6', 'nano:D9', 'nano:D10', 'nano:D11'], color: 'orange', duration_ms: 4000 }, expected_status: 'ok' },
      { step: 'ask-unlim-pwm-context', tool: 'askUNLIM', args: { query: 'spiegazione PWM analogWrite duty cycle 0-255 LED fade rubinetto rapido', context: 'explain-pwm-fade' }, expected_status: 'ok' },
      { step: 'show-nudge-pwm-pins', tool: 'showNudge', args: { text: 'Solo i pin con tilde (~) supportano PWM: D3, D5, D6, D9, D10, D11. Sul Nano cercate il simbolo.', type: 'info', duration_ms: 6000 }, expected_status: 'ok' },
      { step: 'capture-screenshot-fade-circuit', tool: 'captureScreenshot', args: { target: 'led-pwm-circuit', annotate: true }, expected_status: 'ok' },
      { step: 'speak-explain-pwm', tool: 'speakTTS', args: { text: 'Ragazzi, Vol.2 pag.78: PWM apre e chiude rapido come un rubinetto. analogWrite va da 0 a 255: il LED sembra cambiare luminosità ma in realtà lampeggia.', voice: 'it-IT-IsabellaNeural', speed: 0.95 }, expected_status: 'ok' },
    ],
    fallback_strategy: 'halt-on-error',
    expected_total_latency_ms: 5200,
  },
  {
    id: 'L2-explain-resistenza-pull-up',
    name: 'explainResistenzaPullUp',
    description: 'Morphic template iter 15: pull-up resistor Vol.2 cap.9 — analogia palla in cima alla scala + INPUT_PULLUP keyword. Citazione VERBATIM Vol.2 + voice TTS Isabella + highlight resistore 10kOhm.',
    category: 'lesson-explain',
    principio_zero: { plurale_obbligatorio: 'Ragazzi,', citazione_verbatim: true, max_parole: 60, max_frasi: 3, vol_pag: 'Vol.2 pag.58', analogia: 'pull-up come palla in cima alla scala che cade quando spingi pulsante' },
    inputs: { experimentId: 'v2-cap9-esp3' },
    sequence: [
      { step: 'highlight-resistor-pullup', tool: 'highlightComponent', args: { ids: ['r10k', 'btn1'], color: 'orange' }, expected_status: 'ok' },
      { step: 'ask-unlim-pullup-logic', tool: 'askUNLIM', args: { query: 'Spiega resistenza pull-up 10kOhm + INPUT_PULLUP keyword Arduino', vol: 'Vol.2', cap: 9 }, expected_status: 'ok' },
      { step: 'show-nudge-input-pullup', tool: 'showNudge', args: { text: 'pinMode(2, INPUT_PULLUP) attiva resistenza interna: pulsante non premuto = HIGH', duration_ms: 4500 }, expected_status: 'ok' },
      { step: 'capture-screenshot-circuit', tool: 'captureScreenshot', args: { target: 'pull-up-circuit' }, expected_status: 'ok' },
      { step: 'speak-explain', tool: 'speakTTS', args: { text: "Ragazzi, Vol.2 pag.58: 'pull-up tiene il pin a HIGH'. Pensate a una palla in cima alla scala. Premete il pulsante: la palla cade, pin diventa LOW.", voice: 'it-IT-IsabellaNeural', speed: 0.92 }, expected_status: 'ok' },
    ],
    fallback_strategy: 'halt-on-error',
    expected_total_latency_ms: 5800,
  },
  {
    id: 'L2-guide-arduino-compile',
    name: 'guideArduinoCompile',
    description: 'Morphic template: guida primo compile Arduino via n8n endpoint. Highlight bottone compile, ask UNLIM verify codice prima invio, controllo errori output HEX, retry on failure, voice TTS Isabella spiega processo classe (Vol.1 pag.58).',
    category: 'guide-action',
    principio_zero: { plurale_obbligatorio: 'Ragazzi,', citazione_verbatim: true, max_parole: 60, max_frasi: 3, vol_pag: 'Vol.1 pag.58', analogia: "compilare = tradurre dall'italiano alla lingua del Nano" },
    inputs: { sketchCode: '', compileEndpoint: 'https://n8n.srv1022317.hstgr.cloud/compile', retryOnFailure: true },
    sequence: [
      { step: 'highlight-compile-button', tool: 'highlightComponent', args: { ids: ['compile-btn'], color: 'navy', duration_ms: 3000, pulse: true }, expected_status: 'ok' },
      { step: 'ask-unlim-verify-code', tool: 'askUNLIM', args: { query: 'verifica sintassi codice Arduino prima compile setup loop semicolon graffe', context: 'pre-compile-check', code: '${inputs.sketchCode}' }, expected_status: 'ok' },
      { step: 'show-nudge-compile-process', tool: 'showNudge', args: { text: 'Ora compilo: il codice diventa HEX (lingua del Nano). Se errore, leggiamo riga insieme e riprovo.', type: 'info', duration_ms: 6000 }, expected_status: 'ok' },
      { step: 'capture-screenshot-compile-result', tool: 'captureScreenshot', args: { target: 'compile-output', annotate: true, waitForResult: true, timeout_ms: 8000 }, expected_status: 'ok' },
      { step: 'speak-guide-compile', tool: 'speakTTS', args: { text: "Ragazzi, Vol.1 pag.58: compilare significa tradurre dall'italiano alla lingua del Nano. Premete compile: se vedete OK il codice è pronto, se errore leggiamo la riga insieme.", voice: 'it-IT-IsabellaNeural', speed: 0.93 }, expected_status: 'ok' },
    ],
    fallback_strategy: 'retry-then-halt',
    expected_total_latency_ms: 9000,
  },
  {
    id: 'L2-guide-mount-experiment',
    name: 'guideMountExperiment',
    description: 'Morphic template: guida montaggio esperimento step-by-step sul kit fisico. Mostra componenti del kit Omaric uno alla volta sulla LIM con highlight breadboard fila/colonna e dispenser progressivo per le mani dei ragazzi.',
    category: 'guide-build',
    principio_zero: { plurale_obbligatorio: 'Ragazzi,', citazione_verbatim: true, max_parole: 60, max_frasi: 3 },
    inputs: { experimentId: '', stepIndex: 0 },
    sequence: [
      { step: 'mount-experiment', tool: 'mountExperiment', args: { experimentId: '${inputs.experimentId}' }, expected_status: 'ok' },
      { step: 'rag-retrieve-build-steps', tool: 'ragRetrieve', args: { query: 'montaggio breadboard fila colonna kit ${inputs.experimentId}', topK: 3, wikiFusion: true }, expected_status: 'ok' },
      { step: 'highlight-step-component', tool: 'highlightComponent', args: { ids: '${stepData.componentIds}', stepIndex: '${inputs.stepIndex}' }, expected_status: 'ok' },
      { step: 'highlight-pin-target', tool: 'highlightPin', args: { pins: '${stepData.targetPins}' }, expected_status: 'ok' },
      { step: 'speak-step-guidance', tool: 'speakTTS', args: { text: "Ragazzi, Vol.${citation.vol} pag.${citation.page}: '${citation.verbatim}'. Inserite il componente nella fila evidenziata sulla breadboard.", voice: 'it-IT-IsabellaNeural', speed: 0.95 }, expected_status: 'ok' },
    ],
    fallback_strategy: 'halt-on-error',
    expected_total_latency_ms: 4200,
  },
  {
    id: 'L2-guide-scratch-blockly-first',
    name: 'guideScratchBlocklyFirst',
    description: 'Morphic template primo programma Scratch/Blockly — digitalWrite blink LED, highlight blocchi colorati, mapping Scratch → C++ Arduino, cita Vol.1 cap.7 setup() + loop().',
    category: 'lesson-program-first',
    principio_zero: { plurale_obbligatorio: 'Ragazzi,', citazione_verbatim: true, max_parole: 60, max_frasi: 3, vol_pag: 'Vol.1 pag.62', analogia: 'i blocchi Scratch sono come pezzi LEGO: ogni colore = istruzione Arduino diversa' },
    inputs: { experimentId: 'v1-cap7-esp1' },
    sequence: [
      { step: 'highlight-blockly-blocks', tool: 'highlightComponent', args: { ids: ['block-pinmode', 'block-digitalwrite', 'block-delay'], color: 'green', pulse: true }, expected_status: 'ok' },
      { step: 'ask-unlim-mapping', tool: 'askUNLIM', args: { query: 'Spiega come blocchi Scratch verde-pinMode + arancio-digitalWrite + blu-delay diventano codice C++ Arduino', context: 'Vol.1 cap.7 primo programma Blink' }, expected_status: 'ok' },
      { step: 'show-nudge-mapping', tool: 'showNudge', args: { text: 'Blocco verde = pinMode(13, OUTPUT) → blocco arancio = digitalWrite(13, HIGH) → blocco blu = delay(1000)', position: 'code-panel', duration_ms: 6000 }, expected_status: 'ok' },
      { step: 'capture-screenshot-code', tool: 'captureScreenshot', args: { purpose: 'verify-blockly-to-cpp', showBoth: true }, expected_status: 'ok' },
      { step: 'speak-explain-mapping', tool: 'speakTTS', args: { text: "Ragazzi, Vol.1 pag.62 'ogni blocco Scratch corrisponde a una istruzione Arduino'. I blocchi colorati sono LEGO: verde è pinMode, arancio è digitalWrite, blu è delay.", voice: 'it-IT-IsabellaNeural', speed: 0.95 }, expected_status: 'ok' },
    ],
    fallback_strategy: 'halt-on-error',
    expected_total_latency_ms: 5400,
  },
  {
    id: 'L2-guide-serial-monitor',
    name: 'guideSerialMonitor',
    description: 'Morphic template iter 15: prima volta Serial Monitor Vol.2 cap.10 — Serial.begin(9600) + Serial.println + analogia walkie-talkie 9600 baud. Citazione VERBATIM Vol.2 + voice TTS Isabella.',
    category: 'lesson-guide',
    principio_zero: { plurale_obbligatorio: 'Ragazzi,', citazione_verbatim: true, max_parole: 60, max_frasi: 3, vol_pag: 'Vol.2 pag.66', analogia: 'Serial Monitor come walkie-talkie tra Arduino e PC, baud 9600 = velocita radio' },
    inputs: { experimentId: 'v2-cap10-esp1' },
    sequence: [
      { step: 'highlight-serial-pins', tool: 'highlightComponent', args: { ids: ['nano:D0-RX', 'nano:D1-TX'], color: 'purple' }, expected_status: 'ok' },
      { step: 'ask-unlim-serial-begin', tool: 'askUNLIM', args: { query: 'Spiega Serial.begin(9600) + Serial.println e apertura Serial Monitor IDE', vol: 'Vol.2', cap: 10 }, expected_status: 'ok' },
      { step: 'show-nudge-open-monitor', tool: 'showNudge', args: { text: 'Strumenti > Monitor seriale (Ctrl+Shift+M). Selezionate 9600 baud in basso a destra', duration_ms: 4500 }, expected_status: 'ok' },
      { step: 'capture-screenshot-monitor', tool: 'captureScreenshot', args: { target: 'serial-monitor-output' }, expected_status: 'ok' },
      { step: 'speak-walkie-talkie', tool: 'speakTTS', args: { text: "Ragazzi, Vol.2 pag.66: 'Serial Monitor mostra messaggi'. Serial.begin(9600) e come accendere walkie-talkie. Serial.println invia messaggio al PC.", voice: 'it-IT-IsabellaNeural', speed: 0.95 }, expected_status: 'ok' },
    ],
    fallback_strategy: 'halt-on-error',
    expected_total_latency_ms: 5500,
  },
  {
    id: 'L2-introduce-arduino-board',
    name: 'introduceArduinoBoard',
    description: 'Morphic template iter 15: prima sessione Arduino Vol.2 cap.7 — pin map digitali/analogici, USB power, IDE first run. Citazione VERBATIM Vol.2 + voice TTS Isabella + analogia citta-strade per pin map.',
    category: 'lesson-introduce',
    principio_zero: { plurale_obbligatorio: 'Ragazzi,', citazione_verbatim: true, max_parole: 60, max_frasi: 3, vol_pag: 'Vol.2 pag.42', analogia: 'scheda Arduino come citta con strade (pin) numerate' },
    inputs: { experimentId: 'v2-cap7-esp1' },
    sequence: [
      { step: 'highlight-arduino-board', tool: 'highlightComponent', args: { ids: ['nano:board'], color: 'blue' }, expected_status: 'ok' },
      { step: 'ask-unlim-pin-map', tool: 'askUNLIM', args: { query: 'Spiega pin map Arduino Nano D0-D13 PORTD/PORTB e A0-A5 PORTC', vol: 'Vol.2', cap: 7 }, expected_status: 'ok' },
      { step: 'show-nudge-usb-power', tool: 'showNudge', args: { text: 'Collegate USB al PC: il LED ON si accende = scheda alimentata', duration_ms: 4000 }, expected_status: 'ok' },
      { step: 'capture-screenshot-board', tool: 'captureScreenshot', args: { target: 'arduino-board-overview' }, expected_status: 'ok' },
      { step: 'speak-intro', tool: 'speakTTS', args: { text: "Ragazzi, Vol.2 pag.42: 'Arduino Nano e una scheda con strade numerate'. Guardate i pin D0-D13 sopra e A0-A5 sotto. USB accende il LED ON.", voice: 'it-IT-IsabellaNeural', speed: 0.95 }, expected_status: 'ok' },
    ],
    fallback_strategy: 'halt-on-error',
    expected_total_latency_ms: 5500,
  },
  {
    id: 'L2-introduce-breadboard',
    name: 'introduceBreadboard',
    description: 'Morphic template prima sessione kit Vol.1 cap.4 — orientamento bus alimentazione + righe centrali + collegamento batteria. Adatta per docente primo anno (analogie esplicite righe come autostrada) vs esperto (jump diretto a setup esperimento).',
    category: 'lesson-introduce',
    principio_zero: { plurale_obbligatorio: 'Ragazzi,', citazione_verbatim: true, max_parole: 60, max_frasi: 3, vol_pag: 'Vol.1 pag.34', analogia: 'righe orizzontali come binari di una stazione, bus laterali come autostrada del + e del -' },
    inputs: { experimentId: 'v1-cap4-esp1' },
    sequence: [
      { step: 'highlight-breadboard', tool: 'highlightComponent', args: { ids: ['bb1'], color: 'blue', pulse: true }, expected_status: 'ok' },
      { step: 'ask-unlim-orientation', tool: 'askUNLIM', args: { query: 'Spiega orientamento breadboard prima volta classe primaria', context: 'Vol.1 cap.4 setup iniziale' }, expected_status: 'ok' },
      { step: 'show-nudge-bus-power', tool: 'showNudge', args: { text: "Guardate i due binari laterali rossi e neri: sono l'autostrada del + e del - per tutta la breadboard", position: 'top', duration_ms: 4000 }, expected_status: 'ok' },
      { step: 'capture-screenshot-setup', tool: 'captureScreenshot', args: { purpose: 'verify-orientation', annotateBus: true }, expected_status: 'ok' },
      { step: 'speak-intro', tool: 'speakTTS', args: { text: "Ragazzi, Vol.1 pag.34 'la breadboard ha due bus laterali per l'alimentazione e righe centrali per i componenti'. Sul kit guardate le strisce rosse e nere: sono autostrada di + e -.", voice: 'it-IT-IsabellaNeural', speed: 0.95 }, expected_status: 'ok' },
    ],
    fallback_strategy: 'halt-on-error',
    expected_total_latency_ms: 5200,
  },
  {
    id: 'L2-introduce-resistor',
    name: 'introduceResistor',
    description: 'Morphic template: prima introduzione resistore alla classe (Vol.1 cap.3) — verbose introductive con analogia rubinetto, highlight visuale resistenza 220 ohm sul kit, citazione VERBATIM volume, voice TTS Isabella. Adatta tono per docente primo anno (più analogie esplicite) vs esperto.',
    category: 'lesson-introduce',
    principio_zero: { plurale_obbligatorio: 'Ragazzi,', citazione_verbatim: true, max_parole: 60, max_frasi: 3, vol_pag: 'Vol.1 pag.32', analogia: 'rubinetto che limita acqua = resistore che limita corrente' },
    inputs: { experimentId: 'v1-cap3-esp1', resistorValue: '220' },
    sequence: [
      { step: 'highlight-component-resistor', tool: 'highlightComponent', args: { ids: ['r1'], color: 'orange', duration_ms: 4000 }, expected_status: 'ok' },
      { step: 'ask-unlim-resistor-context', tool: 'askUNLIM', args: { query: 'introduzione resistore prima volta classe analogia rubinetto Vol.1 cap.3', context: 'introduce-resistor' }, expected_status: 'ok' },
      { step: 'show-nudge-rubinetto', tool: 'showNudge', args: { text: 'Mostrate il rubinetto: aprite poco = poca acqua. Resistore stessa cosa con la corrente.', type: 'analogy', duration_ms: 6000 }, expected_status: 'ok' },
      { step: 'capture-screenshot-kit', tool: 'captureScreenshot', args: { target: 'resistor-on-breadboard', annotate: true }, expected_status: 'ok' },
      { step: 'speak-intro-resistor', tool: 'speakTTS', args: { text: "Ragazzi, Vol.1 pag.32: il resistore limita la corrente come un rubinetto limita l'acqua. Sul kit cercate la resistenza da ${inputs.resistorValue} ohm con le bande colorate.", voice: 'it-IT-IsabellaNeural', speed: 0.95 }, expected_status: 'ok' },
    ],
    fallback_strategy: 'halt-on-error',
    expected_total_latency_ms: 5000,
  },
  {
    id: 'L2-recap-fine-lezione',
    name: 'recapFineLezione',
    description: "Morphic template chiusura lezione classe — sintesi 3 punti chiave + frase 'ai ragazzi vediamo cosa abbiamo imparato' + nudge feedback + cita testo finale capitolo dal volume.",
    category: 'lesson-recap',
    principio_zero: { plurale_obbligatorio: 'Ragazzi,', citazione_verbatim: true, max_parole: 60, max_frasi: 3, vol_pag: 'Vol.1 pag.70', analogia: 'ricapitolare è come fare lo zaino prima di tornare a casa: prendiamo i 3 oggetti più importanti' },
    inputs: { experimentId: 'v1-cap6-esp1', lessonKeyPoints: ['LED polarità', 'resistenza serie', 'blink delay'] },
    sequence: [
      { step: 'highlight-key-components', tool: 'highlightComponent', args: { ids: ['led1', 'r1', 'nano'], color: 'navy', pulse: false }, expected_status: 'ok' },
      { step: 'ask-unlim-recap', tool: 'askUNLIM', args: { query: 'Genera recap 3 punti chiave lezione: LED polarità + resistenza serie 220Ω + delay blink', context: 'Vol.1 cap.6 chiusura lezione' }, expected_status: 'ok' },
      { step: 'show-nudge-3-points', tool: 'showNudge', args: { text: 'Oggi abbiamo imparato: 1) LED ha polarità (gamba lunga +) 2) resistenza 220Ω in serie protegge 3) delay 1000 fa lampeggio 1 secondo', position: 'center', duration_ms: 8000 }, expected_status: 'ok' },
      { step: 'capture-screenshot-final-state', tool: 'captureScreenshot', args: { purpose: 'save-lesson-final-state', saveToReport: true }, expected_status: 'ok' },
      { step: 'speak-recap', tool: 'speakTTS', args: { text: "Ragazzi, vediamo cosa abbiamo imparato. Vol.1 pag.70 'tre cose: LED polarità, resistenza serie, delay temporizza il blink'. Bravissimi tutti, alla prossima lezione.", voice: 'it-IT-IsabellaNeural', speed: 0.95 }, expected_status: 'ok' },
    ],
    fallback_strategy: 'halt-on-error',
    expected_total_latency_ms: 6000,
  },
  {
    id: 'L2-reroute-from-error',
    name: 'rerouteFromError',
    description: 'Morphic template: ricovero post-errore compilazione/runtime. Estrae errore, RAG su pattern errore comune, suggerisce fix minimo con riferimento Vol.X pag.Y, applica fix tramite simulator-api senza intervento ragazzi.',
    category: 'error-recovery',
    principio_zero: { plurale_obbligatorio: 'Ragazzi,', citazione_verbatim: true, max_parole: 60, max_frasi: 3 },
    inputs: { compileError: '', runtimeError: '', errorLine: 0, experimentId: '' },
    sequence: [
      { step: 'rag-retrieve-error-pattern', tool: 'ragRetrieve', args: { query: 'errore Arduino ${inputs.compileError}${inputs.runtimeError} causa comune fix', topK: 3, wikiFusion: true }, expected_status: 'ok' },
      { step: 'wiki-retrieve-error-concept', tool: 'wikiRetrieve', args: { concept: '${prev.errorConceptId}', topK: 1 }, expected_status: 'ok' },
      { step: 'highlight-error-line', tool: 'highlightCodeLine', args: { line: '${inputs.errorLine}' }, expected_status: 'ok' },
      { step: 'suggest-fix', tool: 'suggestCodeFix', args: { errorPattern: '${prev.errorPattern}', fix: '${prev.suggestedFix}' }, expected_status: 'ok' },
      { step: 'speak-reroute', tool: 'speakTTS', args: { text: "Ragazzi, niente paura. Vol.${citation.vol} pag.${citation.page}: '${citation.verbatim}'. Ho evidenziato la riga, proviamo insieme la correzione.", voice: 'it-IT-IsabellaNeural', speed: 0.92 }, expected_status: 'ok' },
    ],
    fallback_strategy: 'halt-on-error',
    expected_total_latency_ms: 4800,
  },
];

/**
 * Lookup helper: O(20) linear scan, fine for the inline registry.
 */
export function getTemplateById(id: string): ClawBotTemplate | null {
  for (const t of TEMPLATES_L2) {
    if (t.id === id) return t;
  }
  return null;
}
