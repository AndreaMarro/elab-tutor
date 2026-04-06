// ═══════════════════════════════════════════════════════════════════════
// Generated buildSteps for Cap 5 and Cap 6 experiments
// ═══════════════════════════════════════════════════════════════════════

const GENERATED_BUILD_STEPS = {

  // ─── v3-cap5-esp1: Blink LED_BUILTIN (0 wires, nano+bb only) ───
  'v3-cap5-esp1': [
    {
      step: 1,
      text: "Posiziona l'Arduino Nano sulla breadboard, con i pin che entrano nei fori centrali",
      componentId: "nano1",
      componentType: "nano-r4",
      targetPins: {},
      hint: "L'Arduino Nano si inserisce a cavallo della scanalatura centrale della breadboard."
    },
    {
      step: 2,
      text: "Collega il cavo USB al computer e carica il programma Blink. Il LED integrato (pin 13) lampeggia!",
      componentId: null,
      componentType: null,
      targetPins: {},
      hint: "Non servono componenti esterni: il LED integrato sulla scheda e gia collegato al pin 13."
    }
  ],

  // ─── v3-cap5-esp2: Modifica tempi Blink (0 wires, nano+bb only) ───
  'v3-cap5-esp2': [
    {
      step: 1,
      text: "Posiziona l'Arduino Nano sulla breadboard, come nell'esperimento precedente",
      componentId: "nano1",
      componentType: "nano-r4",
      targetPins: {},
      hint: "Stesso circuito del Blink: solo Arduino sulla breadboard, nessun componente esterno."
    },
    {
      step: 2,
      text: "Modifica i valori di delay() nel codice e carica. Prova delay(200) per un lampeggio veloce!",
      componentId: null,
      componentType: null,
      targetPins: {},
      hint: "Cambia i numeri dentro delay(): numeri piccoli = lampeggio veloce, numeri grandi = lampeggio lento."
    }
  ],

  // ─── v3-cap6-esp1: AND/OR con pulsanti (6 wires, btn1+btn2+r1+led1) ───
  'v3-cap6-esp1': [
    {
      step: 1,
      text: "Prendi il primo pulsante (BTN1) e posizionalo a cavallo della scanalatura, nei fori E18-F18 e E22-F22",
      componentId: "btn1",
      componentType: "push-button",
      targetPins: { "btn1:pin1": "bb1:e18", "btn1:pin2": "bb1:e22", "btn1:pin3": "bb1:f18", "btn1:pin4": "bb1:f22" },
      hint: "Il pulsante ha 4 piedini: 2 sopra e 2 sotto la scanalatura."
    },
    {
      step: 2,
      text: "Prendi il secondo pulsante (BTN2) e posizionalo nei fori E22-F22 e E26-F26",
      componentId: "btn2",
      componentType: "push-button",
      targetPins: { "btn2:pin1": "bb1:e22", "btn2:pin2": "bb1:e26", "btn2:pin3": "bb1:f22", "btn2:pin4": "bb1:f26" },
      hint: "Il secondo pulsante e collegato in serie col primo: serve premerli entrambi (AND)."
    },
    {
      step: 3,
      text: "Prendi il resistore R1 (470 ohm) e posizionalo nei fori C25 e C30",
      componentId: "r1",
      componentType: "resistor",
      targetPins: { "r1:pin1": "bb1:c25", "r1:pin2": "bb1:c30" },
      hint: "Il resistore protegge il LED dalla troppa corrente."
    },
    {
      step: 4,
      text: "Prendi il LED rosso e mettilo nei fori D29 (anodo +) e D30 (catodo -)",
      componentId: "led1",
      componentType: "led",
      targetPins: { "led1:anode": "bb1:d29", "led1:cathode": "bb1:d30" },
      hint: "Il piedino piu lungo del LED e l'anodo (+). Va nel foro D29."
    },
    {
      step: 5,
      text: "Collega un filo ROSSO dal pin 5V dell'Arduino al binario + della breadboard",
      wireFrom: "nano1:5V",
      wireTo: "bb1:bus-bot-plus-1",
      wireColor: "red",
      hint: "Il filo rosso porta l'alimentazione 5V al binario positivo."
    },
    {
      step: 6,
      text: "Collega un filo NERO dal pin GND dell'Arduino al binario - della breadboard",
      wireFrom: "nano1:GND_R",
      wireTo: "bb1:bus-bot-minus-1",
      wireColor: "black",
      hint: "Il filo nero collega la massa (GND) al binario negativo."
    },
    {
      step: 7,
      text: "Collega un filo ROSSO dal binario + (colonna 18) al foro A18",
      wireFrom: "bb1:bus-bot-plus-18",
      wireTo: "bb1:a18",
      wireColor: "red",
      hint: "Porta la corrente dal binario + al primo pulsante."
    },
    {
      step: 8,
      text: "Collega un filo ARANCIONE dal foro J22 al foro A22",
      wireFrom: "bb1:j22",
      wireTo: "bb1:a22",
      wireColor: "orange",
      hint: "Ponte che collega le due meta della breadboard alla colonna 22."
    },
    {
      step: 9,
      text: "Collega un filo ARANCIONE dal foro A26 al foro A25",
      wireFrom: "bb1:a26",
      wireTo: "bb1:a25",
      wireColor: "orange",
      hint: "Collega l'uscita del secondo pulsante al resistore."
    },
    {
      step: 10,
      text: "Collega un filo NERO dal foro D30 al binario GND (-) alla colonna 30. Il circuito AND e pronto!",
      wireFrom: "bb1:d30",
      wireTo: "bb1:bus-bot-minus-30",
      wireColor: "black",
      hint: "Il catodo del LED va a massa. Premi entrambi i pulsanti per accendere il LED!"
    }
  ],

  // ─── v3-cap6-esp2: Colleghiamo la resistenza (5 wires, r1+led1) ───
  'v3-cap6-esp2': [
    {
      step: 1,
      text: "Prendi il resistore R1 (470 ohm) e posizionalo nei fori C18 e C25",
      componentId: "r1",
      componentType: "resistor",
      targetPins: { "r1:pin1": "bb1:c18", "r1:pin2": "bb1:c25" },
      hint: "Il resistore protegge il LED. Un piedino in C18, l'altro in C25."
    },
    {
      step: 2,
      text: "Prendi il LED rosso e mettilo nei fori D27 (anodo +) e D28 (catodo -)",
      componentId: "led1",
      componentType: "led",
      targetPins: { "led1:anode": "bb1:d27", "led1:cathode": "bb1:d28" },
      hint: "Il piedino piu lungo e l'anodo (+), va in D27."
    },
    {
      step: 3,
      text: "Collega un filo ARANCIONE dal pin D13 dell'Arduino al foro A18",
      wireFrom: "nano1:W_D13",
      wireTo: "bb1:a18",
      wireColor: "orange",
      hint: "Il pin D13 controlla il LED, come nel Blink ma ora il LED e esterno!"
    },
    {
      step: 4,
      text: "Collega un filo VERDE dal foro D25 al foro D27 (ponte resistore-LED)",
      wireFrom: "bb1:d25",
      wireTo: "bb1:d27",
      wireColor: "green",
      hint: "Questo filo collega il resistore all'anodo del LED."
    },
    {
      step: 5,
      text: "Collega un filo NERO dal foro A28 al binario GND (-) alla colonna 28",
      wireFrom: "bb1:a28",
      wireTo: "bb1:bus-bot-minus-28",
      wireColor: "black",
      hint: "Il catodo del LED va a massa attraverso il binario GND."
    },
    {
      step: 6,
      text: "Collega un filo NERO dal pin GND dell'Arduino al binario GND (-)",
      wireFrom: "nano1:GND_R",
      wireTo: "bb1:bus-bot-minus-1",
      wireColor: "black",
      hint: "Massa dell'Arduino al binario negativo della breadboard."
    },
    {
      step: 7,
      text: "Collega un filo ROSSO dal pin 5V dell'Arduino al binario + della breadboard. Carica il Blink!",
      wireFrom: "nano1:5V",
      wireTo: "bb1:bus-bot-plus-1",
      wireColor: "red",
      hint: "Ora il LED esterno lampeggia insieme a quello integrato sulla scheda!"
    }
  ],

  // ─── v3-cap6-morse: SOS in codice Morse (5 wires, r1+led1) ───
  'v3-cap6-morse': [
    {
      step: 1,
      text: "Prendi il resistore R1 (470 ohm) e posizionalo nei fori C18 e C25",
      componentId: "r1",
      componentType: "resistor",
      targetPins: { "r1:pin1": "bb1:c18", "r1:pin2": "bb1:c25" },
      hint: "Stesso circuito dell'esperimento precedente: resistore + LED su pin 13."
    },
// © Andrea Marro — 06/04/2026 — ELAB Tutor — Tutti i diritti riservati
    {
      step: 2,
      text: "Prendi il LED rosso e mettilo nei fori D27 (anodo +) e D28 (catodo -)",
      componentId: "led1",
      componentType: "led",
      targetPins: { "led1:anode": "bb1:d27", "led1:cathode": "bb1:d28" },
      hint: "Il LED lampeggia in codice Morse: punti brevi e linee lunghe."
    },
    {
      step: 3,
      text: "Collega un filo ARANCIONE dal pin D13 dell'Arduino al foro A18",
      wireFrom: "nano1:W_D13",
      wireTo: "bb1:a18",
      wireColor: "orange",
      hint: "Il pin D13 manda il segnale Morse al LED."
    },
    {
      step: 4,
      text: "Collega un filo VERDE dal foro D25 al foro D27 (ponte resistore-LED)",
      wireFrom: "bb1:d25",
      wireTo: "bb1:d27",
      wireColor: "green",
      hint: "Collega il resistore all'anodo del LED."
    },
    {
      step: 5,
      text: "Collega un filo NERO dal foro A28 al binario GND (-) alla colonna 28",
      wireFrom: "bb1:a28",
      wireTo: "bb1:bus-bot-minus-28",
      wireColor: "black",
      hint: "Il catodo del LED va a massa."
    },
    {
      step: 6,
      text: "Collega un filo NERO dal pin GND dell'Arduino al binario GND (-)",
      wireFrom: "nano1:GND_R",
      wireTo: "bb1:bus-bot-minus-1",
      wireColor: "black",
      hint: "Massa dell'Arduino."
    },
    {
      step: 7,
      text: "Collega un filo ROSSO dal pin 5V al binario +. Carica il codice SOS e osserva il Morse!",
      wireFrom: "nano1:5V",
      wireTo: "bb1:bus-bot-plus-1",
      wireColor: "red",
      hint: "S = tre lampi brevi, O = tre lampi lunghi. SOS e il segnale di soccorso!"
    }
  ],

  // ─── v3-cap6-esp3: Cambia pin (5 wires, r1+led1) ───
  'v3-cap6-esp3': [
    {
      step: 1,
      text: "Prendi il resistore R1 (470 ohm) e posizionalo nei fori C18 e C25",
      componentId: "r1",
      componentType: "resistor",
      targetPins: { "r1:pin1": "bb1:c18", "r1:pin2": "bb1:c25" },
      hint: "Stesso resistore, ma questa volta il filo viene dal pin 5 invece che dal 13!"
    },
    {
      step: 2,
      text: "Prendi il LED verde e mettilo nei fori D27 (anodo +) e D28 (catodo -)",
      componentId: "led1",
      componentType: "led",
      targetPins: { "led1:anode": "bb1:d27", "led1:cathode": "bb1:d28" },
      hint: "Il LED funziona uguale su qualsiasi pin digitale."
    },
    {
      step: 3,
      text: "Collega un filo VERDE dal pin D5 dell'Arduino (breakout wing W_D5) al foro A18",
      wireFrom: "nano1:W_D5",
      wireTo: "bb1:a18",
      wireColor: "green",
      hint: "Questa volta usiamo il pin 5 invece del 13. Cambia anche il numero nel codice!"
    },
    {
      step: 4,
      text: "Collega un filo VERDE dal foro D25 al foro D27 (ponte resistore-LED)",
      wireFrom: "bb1:d25",
      wireTo: "bb1:d27",
      wireColor: "green",
      hint: "Collega il resistore all'anodo del LED."
    },
    {
      step: 5,
      text: "Collega un filo NERO dal foro A28 al binario GND (-) alla colonna 28",
      wireFrom: "bb1:a28",
      wireTo: "bb1:bus-bot-minus-28",
      wireColor: "black",
      hint: "Il catodo del LED va a massa."
    },
    {
      step: 6,
      text: "Collega un filo NERO dal pin GND dell'Arduino al binario GND (-)",
      wireFrom: "nano1:GND_R",
      wireTo: "bb1:bus-bot-minus-1",
      wireColor: "black",
      hint: "Massa dell'Arduino."
    },
    {
      step: 7,
      text: "Collega un filo ROSSO dal pin 5V al binario +. Ora il LED lampeggia dal pin 5!",
      wireFrom: "nano1:5V",
      wireTo: "bb1:bus-bot-plus-1",
      wireColor: "red",
      hint: "Tutti i pin digitali di Arduino funzionano allo stesso modo. Prova anche pin 3, 6, 9!"
    }
  ],

  // ─── v3-cap6-esp4: Due LED effetto polizia / semaforo (10 wires, r1+r2+r3+led1+led2+led3) ───
  'v3-cap6-esp4': [
    {
      step: 1,
      text: "Prendi il resistore R1 (470 ohm) e posizionalo nei fori B16 e B23 — circuito verde",
      componentId: "r1",
      componentType: "resistor",
      targetPins: { "r1:pin1": "bb1:b16", "r1:pin2": "bb1:b23" },
      hint: "R1 e il resistore del LED verde, nella fila B a sinistra."
    },
    {
      step: 2,
      text: "Prendi il LED verde e mettilo nei fori D25 (anodo +) e D26 (catodo -)",
      componentId: "led1",
      componentType: "led",
      targetPins: { "led1:anode": "bb1:d25", "led1:cathode": "bb1:d26" },
      hint: "Il LED verde e il primo colore del semaforo."
    },
    {
      step: 3,
      text: "Prendi il resistore R2 (470 ohm) e posizionalo nei fori E22 e E29 — circuito giallo",
      componentId: "r2",
      componentType: "resistor",
      targetPins: { "r2:pin1": "bb1:e22", "r2:pin2": "bb1:e29" },
      hint: "R2 e il resistore del LED giallo, nella fila E."
    },
    {
      step: 4,
      text: "Prendi il LED giallo e mettilo nei fori D29 (anodo +) e D30 (catodo -)",
      componentId: "led2",
      componentType: "led",
      targetPins: { "led2:anode": "bb1:d29", "led2:cathode": "bb1:d30" },
      hint: "Il LED giallo e il secondo colore del semaforo."
    },
    {
      step: 5,
      text: "Prendi il resistore R3 (470 ohm) e posizionalo nei fori I16 e I23 — circuito rosso",
      componentId: "r3",
      componentType: "resistor",
      targetPins: { "r3:pin1": "bb1:i16", "r3:pin2": "bb1:i23" },
      hint: "R3 e il resistore del LED rosso, nella fila I (parte bassa)."
    },
    {
      step: 6,
      text: "Prendi il LED rosso e mettilo nei fori H30 (anodo +) e H29 (catodo -)",
      componentId: "led3",
      componentType: "led",
      targetPins: { "led3:anode": "bb1:h30", "led3:cathode": "bb1:h29" },
      hint: "Il LED rosso e il terzo colore. Attenzione: l'anodo e in H30 e il catodo in H29!"
    },
    {
      step: 7,
      text: "Collega un filo VERDE dal pin D5 dell'Arduino al foro A16",
      wireFrom: "nano1:W_D5",
      wireTo: "bb1:a16",
      wireColor: "green",
      hint: "D5 controlla il LED verde."
    },
    {
      step: 8,
      text: "Collega un filo VERDE dal foro D23 al foro D25 (ponte R1 verso LED verde)",
      wireFrom: "bb1:d23",
      wireTo: "bb1:d25",
      wireColor: "green",
      hint: "Collega il resistore R1 all'anodo del LED verde."
    },
    {
      step: 9,
      text: "Collega un filo NERO dal foro A26 al binario GND (-) — catodo LED verde",
      wireFrom: "bb1:a26",
      wireTo: "bb1:bus-bot-minus-26",
      wireColor: "black",
      hint: "Il catodo del LED verde va a massa."
    },
    {
      step: 10,
      text: "Collega un filo GIALLO dal pin D6 dell'Arduino al foro A22",
      wireFrom: "nano1:W_D6",
      wireTo: "bb1:a22",
      wireColor: "yellow",
      hint: "D6 controlla il LED giallo."
    },
    {
      step: 11,
      text: "Collega un filo NERO dal foro A30 al binario GND (-) — catodo LED giallo",
      wireFrom: "bb1:a30",
      wireTo: "bb1:bus-bot-minus-30",
      wireColor: "black",
      hint: "Il catodo del LED giallo va a massa."
    },
// © Andrea Marro — 06/04/2026 — ELAB Tutor — Tutti i diritti riservati
    {
      step: 12,
      text: "Collega un filo ROSSO dal pin D9 dell'Arduino al foro F16",
      wireFrom: "nano1:W_D9",
      wireTo: "bb1:f16",
      wireColor: "red",
      hint: "D9 controlla il LED rosso."
    },
    {
      step: 13,
      text: "Collega un filo VERDE dal foro H23 al foro H30 (ponte R3 verso LED rosso)",
      wireFrom: "bb1:h23",
      wireTo: "bb1:h30",
      wireColor: "green",
      hint: "Collega il resistore R3 all'anodo del LED rosso."
    },
    {
      step: 14,
      text: "Collega un filo NERO dal foro F29 al binario GND (-) — catodo LED rosso",
      wireFrom: "bb1:f29",
      wireTo: "bb1:bus-bot-minus-29",
      wireColor: "black",
      hint: "Il catodo del LED rosso va a massa."
    },
    {
      step: 15,
      text: "Collega un filo NERO dal pin GND dell'Arduino al binario GND (-)",
      wireFrom: "nano1:GND_R",
      wireTo: "bb1:bus-bot-minus-1",
      wireColor: "black",
      hint: "Massa dell'Arduino."
    },
    {
      step: 16,
      text: "Collega un filo ROSSO dal pin 5V al binario +. Il semaforo a 3 LED e pronto!",
      wireFrom: "nano1:5V",
      wireTo: "bb1:bus-bot-plus-1",
      wireColor: "red",
      hint: "3 LED su 3 pin diversi (D5, D6, D9). Il codice li accende uno alla volta!"
    }
  ],

  // ─── v3-cap6-esp5: INPUT_PULLUP (7 wires, btn1+r1+led1) ───
  'v3-cap6-esp5': [
    {
      step: 1,
      text: "Prendi il pulsante e posizionalo a cavallo della scanalatura, nei fori E20-F20 e E24-F24",
      componentId: "btn1",
      componentType: "push-button",
      targetPins: { "btn1:pin1": "bb1:e20", "btn1:pin2": "bb1:e24", "btn1:pin3": "bb1:f20", "btn1:pin4": "bb1:f24" },
      hint: "Il pulsante ha 4 piedini che vanno a cavallo della scanalatura centrale."
    },
    {
      step: 2,
      text: "Prendi il resistore R1 (470 ohm) e posizionalo nei fori C18 e C25",
      componentId: "r1",
      componentType: "resistor",
      targetPins: { "r1:pin1": "bb1:c18", "r1:pin2": "bb1:c25" },
      hint: "Il resistore protegge il LED verde."
    },
    {
      step: 3,
      text: "Prendi il LED verde e mettilo nei fori D27 (anodo +) e D28 (catodo -)",
      componentId: "led1",
      componentType: "led",
      targetPins: { "led1:anode": "bb1:d27", "led1:cathode": "bb1:d28" },
      hint: "Il LED si accende quando premi il pulsante (toggle)."
    },
    {
      step: 4,
      text: "Collega un filo GIALLO dal pin D10 dell'Arduino (W_D10) al foro A20",
      wireFrom: "nano1:W_D10",
      wireTo: "bb1:a20",
      wireColor: "yellow",
      hint: "D10 legge il pulsante con INPUT_PULLUP (resistenza interna attivata)."
    },
    {
      step: 5,
      text: "Collega un filo NERO dal foro J20 al binario GND (-) alla colonna 20",
      wireFrom: "bb1:j20",
      wireTo: "bb1:bus-bot-minus-20",
      wireColor: "black",
      hint: "L'altro lato del pulsante va a GND. Quando premi, il pin 10 legge LOW."
    },
    {
      step: 6,
      text: "Collega un filo VERDE dal pin D5 dell'Arduino (W_D5) al foro A18",
      wireFrom: "nano1:W_D5",
      wireTo: "bb1:a18",
      wireColor: "green",
      hint: "D5 controlla il LED verde."
    },
    {
      step: 7,
      text: "Collega un filo VERDE dal foro D25 al foro D27 (ponte resistore-LED)",
      wireFrom: "bb1:d25",
      wireTo: "bb1:d27",
      wireColor: "green",
      hint: "Collega il resistore all'anodo del LED."
    },
    {
      step: 8,
      text: "Collega un filo NERO dal foro A28 al binario GND (-) alla colonna 28",
      wireFrom: "bb1:a28",
      wireTo: "bb1:bus-bot-minus-28",
      wireColor: "black",
      hint: "Il catodo del LED va a massa."
    },
    {
      step: 9,
      text: "Collega un filo NERO dal pin GND dell'Arduino al binario GND (-)",
      wireFrom: "nano1:GND_R",
      wireTo: "bb1:bus-bot-minus-1",
      wireColor: "black",
      hint: "Massa dell'Arduino."
    },
    {
      step: 10,
      text: "Collega un filo ROSSO dal pin 5V al binario +. Premi il pulsante per il toggle!",
      wireFrom: "nano1:5V",
      wireTo: "bb1:bus-bot-plus-1",
      wireColor: "red",
      hint: "Ogni pressione cambia stato: LED acceso diventa spento e viceversa!"
    }
  ],

  // ─── v3-cap6-esp7: Debounce (7 wires, btn1+r1+led1) ───
  'v3-cap6-esp7': [
    {
      step: 1,
      text: "Prendi il pulsante e posizionalo a cavallo della scanalatura, nei fori E20-F20 e E24-F24",
      componentId: "btn1",
      componentType: "push-button",
      targetPins: { "btn1:pin1": "bb1:e20", "btn1:pin2": "bb1:e24", "btn1:pin3": "bb1:f20", "btn1:pin4": "bb1:f24" },
      hint: "Stesso circuito dell'Es. INPUT_PULLUP, ma il codice ha il debounce migliorato."
    },
    {
      step: 2,
      text: "Prendi il resistore R1 (470 ohm) e posizionalo nei fori C18 e C25",
      componentId: "r1",
      componentType: "resistor",
      targetPins: { "r1:pin1": "bb1:c18", "r1:pin2": "bb1:c25" },
      hint: "Il resistore protegge il LED verde."
    },
    {
      step: 3,
      text: "Prendi il LED verde e mettilo nei fori D27 (anodo +) e D28 (catodo -)",
      componentId: "led1",
      componentType: "led",
      targetPins: { "led1:anode": "bb1:d27", "led1:cathode": "bb1:d28" },
      hint: "Il LED cambia stato in modo piu pulito grazie al debounce con while."
    },
    {
      step: 4,
      text: "Collega un filo GIALLO dal pin D10 dell'Arduino (W_D10) al foro A20",
      wireFrom: "nano1:W_D10",
      wireTo: "bb1:a20",
      wireColor: "yellow",
      hint: "D10 legge il pulsante con INPUT_PULLUP."
    },
    {
      step: 5,
      text: "Collega un filo NERO dal foro J20 al binario GND (-) alla colonna 20",
      wireFrom: "bb1:j20",
      wireTo: "bb1:bus-bot-minus-20",
      wireColor: "black",
      hint: "L'altro lato del pulsante va a GND."
    },
    {
      step: 6,
      text: "Collega un filo VERDE dal pin D5 dell'Arduino (W_D5) al foro A18",
      wireFrom: "nano1:W_D5",
      wireTo: "bb1:a18",
      wireColor: "green",
      hint: "D5 controlla il LED verde."
    },
    {
      step: 7,
      text: "Collega un filo VERDE dal foro D25 al foro D27 (ponte resistore-LED)",
      wireFrom: "bb1:d25",
      wireTo: "bb1:d27",
      wireColor: "green",
      hint: "Collega il resistore all'anodo del LED."
    },
    {
      step: 8,
      text: "Collega un filo NERO dal foro A28 al binario GND (-) alla colonna 28",
      wireFrom: "bb1:a28",
      wireTo: "bb1:bus-bot-minus-28",
      wireColor: "black",
      hint: "Il catodo del LED va a massa."
    },
    {
      step: 9,
      text: "Collega un filo NERO dal pin GND dell'Arduino al binario GND (-)",
      wireFrom: "nano1:GND_R",
      wireTo: "bb1:bus-bot-minus-1",
      wireColor: "black",
      hint: "Massa dell'Arduino."
    },
// © Andrea Marro — 06/04/2026 — ELAB Tutor — Tutti i diritti riservati
    {
      step: 10,
      text: "Collega un filo ROSSO dal pin 5V al binario +. Il debounce con while rende il toggle preciso!",
      wireFrom: "nano1:5V",
      wireTo: "bb1:bus-bot-plus-1",
      wireColor: "red",
      hint: "Il while aspetta che rilasci il pulsante prima di continuare. Ogni tocco = 1 cambio!"
    }
  ]

};

export default GENERATED_BUILD_STEPS;
