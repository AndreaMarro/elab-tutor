// ═══════════════════════════════════════════════════════════════════
// GENERATED BUILD STEPS — Cap 7 & Cap 8 (Vol 3)
// Pin assignments e connections estratti da experiments-vol3.js
// ═══════════════════════════════════════════════════════════════════

const GENERATED_BUILD_STEPS = {

  // ─────────────────────────────────────────────────
  // v3-cap7-esp1 — analogRead base (pot1 + r1 + led1, 8 wires)
  // ─────────────────────────────────────────────────
  'v3-cap7-esp1': [
    {
      step: 1,
      text: "Prendi il potenziometro da 10kΩ e posizionalo nei fori H22, H23, H24 della breadboard",
      componentId: "pot1",
      componentType: "potentiometer",
      targetPins: { "pot1:vcc": "bb1:h22", "pot1:signal": "bb1:h23", "pot1:gnd": "bb1:h24" },
      hint: "Il potenziometro ha 3 piedini: VCC, segnale e GND. Il segnale (centrale) va ad A0."
    },
    {
      step: 2,
      text: "Prendi il resistore R1 (470Ω) e posizionalo nei fori C18 e C25",
      componentId: "r1",
      componentType: "resistor",
      targetPins: { "r1:pin1": "bb1:c18", "r1:pin2": "bb1:c25" },
      hint: "Il resistore protegge il LED dalla troppa corrente. 470Ω è perfetto per un LED rosso."
    },
    {
      step: 3,
      text: "Prendi il LED rosso e mettilo nei fori D27 e D28. L'anodo (+, gambetta lunga) in D27!",
      componentId: "led1",
      componentType: "led",
      targetPins: { "led1:anode": "bb1:d27", "led1:cathode": "bb1:d28" },
      hint: "Ricorda: l'anodo è la gambetta più lunga. Se lo metti al contrario, non si accende."
    },
    {
      step: 4,
      text: "Collega un filo ROSSO dal foro F22 al binario + (5V)",
      wireFrom: "bb1:f22",
      wireTo: "bb1:bus-bot-plus-22",
      wireColor: "red",
      hint: "Porta il 5V al piedino VCC del potenziometro."
    },
    {
      step: 5,
      text: "Collega un filo GIALLO dal pin A0 dell'Arduino al foro F23",
      wireFrom: "nano1:W_A0",
      wireTo: "bb1:f23",
      wireColor: "yellow",
      hint: "Il segnale del potenziometro va al pin analogico A0. analogRead(A0) leggerà valori 0-1023."
    },
    {
      step: 6,
      text: "Collega un filo NERO dal foro F24 al binario GND (−)",
      wireFrom: "bb1:f24",
      wireTo: "bb1:bus-bot-minus-24",
      wireColor: "black",
      hint: "GND del potenziometro va a massa."
    },
    {
      step: 7,
      text: "Collega un filo ARANCIONE dal pin D13 dell'Arduino al foro A18",
      wireFrom: "nano1:W_D13",
      wireTo: "bb1:a18",
      wireColor: "orange",
      hint: "Il pin 13 controlla il LED. Quando il trimmer supera 511, il LED si accende!"
    },
    {
      step: 8,
      text: "Collega un filo VERDE dal foro D25 al foro D27 (ponte resistore→LED)",
      wireFrom: "bb1:d25",
      wireTo: "bb1:d27",
      wireColor: "green",
      hint: "Questo filo collega il resistore all'anodo del LED."
    },
    {
      step: 9,
      text: "Collega un filo NERO dal foro A28 al binario GND (−) — catodo LED",
      wireFrom: "bb1:a28",
      wireTo: "bb1:bus-bot-minus-28",
      wireColor: "black",
      hint: "Il catodo del LED va a massa per chiudere il circuito."
    },
    {
      step: 10,
      text: "Collega un filo NERO dal pin GND dell'Arduino al binario GND (−)",
      wireFrom: "nano1:GND_R",
      wireTo: "bb1:bus-bot-minus-1",
      wireColor: "black",
      hint: "Massa dell'Arduino collegata alla breadboard."
    },
    {
      step: 11,
      text: "Collega un filo ROSSO dal pin 5V dell'Arduino al binario + (5V). Gira il trimmer e guarda il LED!",
      wireFrom: "nano1:5V",
      wireTo: "bb1:bus-bot-plus-1",
      wireColor: "red",
      hint: "Alimentazione 5V dalla scheda alla breadboard. Ora prova a girare il potenziometro!"
    }
  ],

  // ─────────────────────────────────────────────────
  // v3-cap7-esp2 — analogRead con tensione (pot1 + r1 + led1, 8 wires)
  // Stesso circuito di esp1, diverso solo il codice
  // ─────────────────────────────────────────────────
  'v3-cap7-esp2': [
    {
      step: 1,
      text: "Prendi il potenziometro da 10kΩ e posizionalo nei fori H22, H23, H24",
      componentId: "pot1",
      componentType: "potentiometer",
      targetPins: { "pot1:vcc": "bb1:h22", "pot1:signal": "bb1:h23", "pot1:gnd": "bb1:h24" },
      hint: "Stesso circuito dell'esperimento 7.1. Il trimmer legge la tensione."
    },
    {
      step: 2,
      text: "Prendi il resistore R1 (470Ω) e posizionalo nei fori C18 e C25",
      componentId: "r1",
      componentType: "resistor",
      targetPins: { "r1:pin1": "bb1:c18", "r1:pin2": "bb1:c25" },
      hint: "Il resistore protegge il LED dalla troppa corrente."
    },
    {
      step: 3,
      text: "Prendi il LED rosso e mettilo nei fori D27 e D28. L'anodo (+) in D27!",
      componentId: "led1",
      componentType: "led",
      targetPins: { "led1:anode": "bb1:d27", "led1:cathode": "bb1:d28" },
      hint: "Gambetta lunga = anodo (+). Il LED si accende sopra 2.5V."
    },
    {
      step: 4,
      text: "Collega un filo ROSSO dal foro F22 al binario + (5V)",
      wireFrom: "bb1:f22",
      wireTo: "bb1:bus-bot-plus-22",
      wireColor: "red",
      hint: "VCC del potenziometro → 5V."
    },
    {
      step: 5,
      text: "Collega un filo GIALLO dal pin A0 dell'Arduino al foro F23",
      wireFrom: "nano1:W_A0",
      wireTo: "bb1:f23",
      wireColor: "yellow",
      hint: "Segnale del trimmer → A0. Il codice converte il valore in Volt!"
    },
    {
      step: 6,
      text: "Collega un filo NERO dal foro F24 al binario GND (−)",
      wireFrom: "bb1:f24",
      wireTo: "bb1:bus-bot-minus-24",
      wireColor: "black",
      hint: "GND del potenziometro → massa."
    },
    {
      step: 7,
      text: "Collega un filo ARANCIONE dal pin D13 dell'Arduino al foro A18",
      wireFrom: "nano1:W_D13",
      wireTo: "bb1:a18",
      wireColor: "orange",
      hint: "Il pin 13 controlla il LED. Si accende quando la tensione supera 2.5V."
    },
    {
      step: 8,
      text: "Collega un filo VERDE dal foro D25 al foro D27 (ponte resistore→LED)",
      wireFrom: "bb1:d25",
      wireTo: "bb1:d27",
      wireColor: "green",
      hint: "Collega il resistore all'anodo del LED."
    },
    {
      step: 9,
      text: "Collega un filo NERO dal foro A28 al binario GND (−) — catodo LED",
      wireFrom: "bb1:a28",
      wireTo: "bb1:bus-bot-minus-28",
      wireColor: "black",
      hint: "Il catodo del LED va a massa."
    },
    {
      step: 10,
      text: "Collega un filo NERO dal pin GND dell'Arduino al binario GND (−)",
      wireFrom: "nano1:GND_R",
      wireTo: "bb1:bus-bot-minus-1",
      wireColor: "black",
      hint: "Massa dell'Arduino."
    },
    {
      step: 11,
      text: "Collega un filo ROSSO dal pin 5V al binario +. Ora il codice converte in Volt reali!",
      wireFrom: "nano1:5V",
      wireTo: "bb1:bus-bot-plus-1",
      wireColor: "red",
      hint: "La formula (valore * 5.0) / 1023 converte il numero in Volt. Soglia: 2.5V."
    }
  ],

  // ─────────────────────────────────────────────────
  // v3-cap7-esp3 — Trimmer controlla 3 LED (pot1 + r1+r2+r3 + led1+led2+led3, 13 wires)
  // ─────────────────────────────────────────────────
  'v3-cap7-esp3': [
// © Andrea Marro — 06/04/2026 — ELAB Tutor — Tutti i diritti riservati
    {
      step: 1,
      text: "Prendi il potenziometro da 10kΩ e posizionalo nei fori H22, H23, H24",
      componentId: "pot1",
      componentType: "potentiometer",
      targetPins: { "pot1:vcc": "bb1:h22", "pot1:signal": "bb1:h23", "pot1:gnd": "bb1:h24" },
      hint: "Il trimmer controlla quale dei 3 LED si accende in base alla posizione."
    },
    {
      step: 2,
      text: "Prendi il resistore R1 (470Ω) e posizionalo nei fori B16 e B23 — circuito LED rosso",
      componentId: "r1",
      componentType: "resistor",
      targetPins: { "r1:pin1": "bb1:b16", "r1:pin2": "bb1:b23" },
      hint: "R1 protegge il LED rosso, collegato al pin D3."
    },
    {
      step: 3,
      text: "Prendi il LED rosso e mettilo nei fori D25 e D26. L'anodo (+) in D25!",
      componentId: "led1",
      componentType: "led",
      targetPins: { "led1:anode": "bb1:d25", "led1:cathode": "bb1:d26" },
      hint: "Il LED rosso si accende nella zona bassa del trimmer (0-340)."
    },
    {
      step: 4,
      text: "Prendi il resistore R2 (470Ω) e posizionalo nei fori E22 e E29 — circuito LED giallo",
      componentId: "r2",
      componentType: "resistor",
      targetPins: { "r2:pin1": "bb1:e22", "r2:pin2": "bb1:e29" },
      hint: "R2 protegge il LED giallo, collegato al pin D5."
    },
    {
      step: 5,
      text: "Prendi il LED giallo e mettilo nei fori D29 e D30. L'anodo (+) in D29!",
      componentId: "led2",
      componentType: "led",
      targetPins: { "led2:anode": "bb1:d29", "led2:cathode": "bb1:d30" },
      hint: "Il LED giallo si accende nella zona media del trimmer (341-681)."
    },
    {
      step: 6,
      text: "Prendi il resistore R3 (470Ω) e posizionalo nei fori I16 e I23 — circuito LED verde",
      componentId: "r3",
      componentType: "resistor",
      targetPins: { "r3:pin1": "bb1:i16", "r3:pin2": "bb1:i23" },
      hint: "R3 protegge il LED verde, collegato al pin D6."
    },
    {
      step: 7,
      text: "Prendi il LED verde e mettilo nei fori H30 e H29. L'anodo (+) in H30!",
      componentId: "led3",
      componentType: "led",
      targetPins: { "led3:anode": "bb1:h30", "led3:cathode": "bb1:h29" },
      hint: "Il LED verde si accende nella zona alta del trimmer (682-1023)."
    },
    {
      step: 8,
      text: "Collega un filo ROSSO dal foro F22 al binario + (5V)",
      wireFrom: "bb1:f22",
      wireTo: "bb1:bus-bot-plus-22",
      wireColor: "red",
      hint: "VCC del potenziometro → 5V."
    },
    {
      step: 9,
      text: "Collega un filo GIALLO dal pin A0 dell'Arduino al foro F23",
      wireFrom: "nano1:W_A0",
      wireTo: "bb1:f23",
      wireColor: "yellow",
      hint: "Segnale del trimmer → A0."
    },
    {
      step: 10,
      text: "Collega un filo NERO dal foro F24 al binario GND (−)",
      wireFrom: "bb1:f24",
      wireTo: "bb1:bus-bot-minus-24",
      wireColor: "black",
      hint: "GND del potenziometro → massa."
    },
    {
      step: 11,
      text: "Collega un filo ROSSO dal pin D3 dell'Arduino al foro A16",
      wireFrom: "nano1:W_D3",
      wireTo: "bb1:a16",
      wireColor: "red",
      hint: "D3 controlla il LED rosso (zona bassa 0-340)."
    },
    {
      step: 12,
      text: "Collega un filo VERDE dal foro D23 al foro D25 (ponte R1→LED rosso)",
      wireFrom: "bb1:d23",
      wireTo: "bb1:d25",
      wireColor: "green",
      hint: "Collega il resistore R1 all'anodo del LED rosso."
    },
    {
      step: 13,
      text: "Collega un filo NERO dal foro A26 al binario GND (−) — catodo LED rosso",
      wireFrom: "bb1:a26",
      wireTo: "bb1:bus-bot-minus-26",
      wireColor: "black",
      hint: "Catodo del LED rosso a massa."
    },
    {
      step: 14,
      text: "Collega un filo VERDE dal pin D5 dell'Arduino al foro A22",
      wireFrom: "nano1:W_D5",
      wireTo: "bb1:a22",
      wireColor: "green",
      hint: "D5 controlla il LED giallo (zona media 341-681)."
    },
    {
      step: 15,
      text: "Collega un filo NERO dal foro A30 al binario GND (−) — catodo LED giallo",
      wireFrom: "bb1:a30",
      wireTo: "bb1:bus-bot-minus-30",
      wireColor: "black",
      hint: "Catodo del LED giallo a massa."
    },
    {
      step: 16,
      text: "Collega un filo GIALLO dal pin D6 dell'Arduino al foro F16",
      wireFrom: "nano1:W_D6",
      wireTo: "bb1:f16",
      wireColor: "yellow",
      hint: "D6 controlla il LED verde (zona alta 682-1023)."
    },
    {
      step: 17,
      text: "Collega un filo VERDE dal foro H23 al foro H30 (ponte R3→LED verde)",
      wireFrom: "bb1:h23",
      wireTo: "bb1:h30",
      wireColor: "green",
      hint: "Collega il resistore R3 all'anodo del LED verde."
    },
    {
      step: 18,
      text: "Collega un filo NERO dal foro F29 al binario GND (−) — catodo LED verde",
      wireFrom: "bb1:f29",
      wireTo: "bb1:bus-bot-minus-29",
      wireColor: "black",
      hint: "Catodo del LED verde a massa."
    },
    {
      step: 19,
      text: "Collega un filo NERO dal pin GND dell'Arduino al binario GND (−)",
      wireFrom: "nano1:GND_R",
      wireTo: "bb1:bus-bot-minus-1",
      wireColor: "black",
      hint: "Massa dell'Arduino."
    },
    {
      step: 20,
      text: "Collega un filo ROSSO dal pin 5V al binario +. Gira il trimmer: un LED alla volta!",
      wireFrom: "nano1:5V",
      wireTo: "bb1:bus-bot-plus-1",
      wireColor: "red",
      hint: "Il range 0-1023 è diviso in 3 zone: ogni zona accende un LED diverso!"
    }
  ],

  // ─────────────────────────────────────────────────
  // v3-cap7-esp4 — PWM fade (r1 + led1, 5 wires)
  // ─────────────────────────────────────────────────
  'v3-cap7-esp4': [
    {
      step: 1,
      text: "Prendi il resistore R1 (470Ω) e posizionalo nei fori C18 e C25",
      componentId: "r1",
      componentType: "resistor",
      targetPins: { "r1:pin1": "bb1:c18", "r1:pin2": "bb1:c25" },
      hint: "Il resistore protegge il LED. Serve sempre prima di un LED!"
    },
    {
      step: 2,
      text: "Prendi il LED rosso e mettilo nei fori D27 e D28. L'anodo (+) in D27!",
      componentId: "led1",
      componentType: "led",
      targetPins: { "led1:anode": "bb1:d27", "led1:cathode": "bb1:d28" },
      hint: "Il LED farà un effetto fade-in graduale grazie al PWM!"
    },
    {
      step: 3,
      text: "Collega un filo VERDE dal pin D5 dell'Arduino al foro A18",
      wireFrom: "nano1:W_D5",
      wireTo: "bb1:a18",
      wireColor: "green",
      hint: "Il pin 5 è un pin PWM (ha il simbolo ~). Serve per analogWrite!"
    },
    {
      step: 4,
      text: "Collega un filo VERDE dal foro D25 al foro D27 (ponte resistore→LED)",
      wireFrom: "bb1:d25",
      wireTo: "bb1:d27",
      wireColor: "green",
      hint: "Collega il resistore all'anodo del LED."
    },
    {
      step: 5,
// © Andrea Marro — 06/04/2026 — ELAB Tutor — Tutti i diritti riservati
      text: "Collega un filo NERO dal foro A28 al binario GND (−) — catodo LED",
      wireFrom: "bb1:a28",
      wireTo: "bb1:bus-bot-minus-28",
      wireColor: "black",
      hint: "Catodo del LED a massa."
    },
    {
      step: 6,
      text: "Collega un filo NERO dal pin GND dell'Arduino al binario GND (−)",
      wireFrom: "nano1:GND_R",
      wireTo: "bb1:bus-bot-minus-1",
      wireColor: "black",
      hint: "Massa dell'Arduino collegata alla breadboard."
    },
    {
      step: 7,
      text: "Collega un filo ROSSO dal pin 5V al binario +. Il LED si accenderà piano piano!",
      wireFrom: "nano1:5V",
      wireTo: "bb1:bus-bot-plus-1",
      wireColor: "red",
      hint: "analogWrite va da 0 (spento) a 255 (massimo). L'effetto fade è come un'alba!"
    }
  ],

  // ─────────────────────────────────────────────────
  // v3-cap7-esp5 — PWM con valori manuali (r1 + led1, 5 wires)
  // Stesso circuito di esp4
  // ─────────────────────────────────────────────────
  'v3-cap7-esp5': [
    {
      step: 1,
      text: "Prendi il resistore R1 (470Ω) e posizionalo nei fori C18 e C25",
      componentId: "r1",
      componentType: "resistor",
      targetPins: { "r1:pin1": "bb1:c18", "r1:pin2": "bb1:c25" },
      hint: "Stesso circuito dell'esperimento 7.4. Il resistore protegge il LED."
    },
    {
      step: 2,
      text: "Prendi il LED rosso e mettilo nei fori D27 e D28. L'anodo (+) in D27!",
      componentId: "led1",
      componentType: "led",
      targetPins: { "led1:anode": "bb1:d27", "led1:cathode": "bb1:d28" },
      hint: "Il LED mostrerà 4 livelli di luminosità diversi: 0, 64, 128, 255."
    },
    {
      step: 3,
      text: "Collega un filo VERDE dal pin D5 dell'Arduino al foro A18",
      wireFrom: "nano1:W_D5",
      wireTo: "bb1:a18",
      wireColor: "green",
      hint: "Pin 5 (PWM) controlla la luminosità del LED."
    },
    {
      step: 4,
      text: "Collega un filo VERDE dal foro D25 al foro D27 (ponte resistore→LED)",
      wireFrom: "bb1:d25",
      wireTo: "bb1:d27",
      wireColor: "green",
      hint: "Collega il resistore all'anodo del LED."
    },
    {
      step: 5,
      text: "Collega un filo NERO dal foro A28 al binario GND (−) — catodo LED",
      wireFrom: "bb1:a28",
      wireTo: "bb1:bus-bot-minus-28",
      wireColor: "black",
      hint: "Catodo del LED a massa."
    },
    {
      step: 6,
      text: "Collega un filo NERO dal pin GND dell'Arduino al binario GND (−)",
      wireFrom: "nano1:GND_R",
      wireTo: "bb1:bus-bot-minus-1",
      wireColor: "black",
      hint: "Massa dell'Arduino."
    },
    {
      step: 7,
      text: "Collega un filo ROSSO dal pin 5V al binario +. Osserva i 4 livelli di luminosità!",
      wireFrom: "nano1:5V",
      wireTo: "bb1:bus-bot-plus-1",
      wireColor: "red",
      hint: "0 = spento, 64 = debole, 128 = metà, 255 = massimo. Prova a cambiare i numeri nel codice!"
    }
  ],

  // ─────────────────────────────────────────────────
  // v3-cap7-esp6 — Fade up/down con for (r1 + led1, 5 wires)
  // Stesso circuito di esp4 e esp5
  // ─────────────────────────────────────────────────
  'v3-cap7-esp6': [
    {
      step: 1,
      text: "Prendi il resistore R1 (470Ω) e posizionalo nei fori C18 e C25",
      componentId: "r1",
      componentType: "resistor",
      targetPins: { "r1:pin1": "bb1:c18", "r1:pin2": "bb1:c25" },
      hint: "Stesso circuito degli esperimenti 7.4 e 7.5."
    },
    {
      step: 2,
      text: "Prendi il LED rosso e mettilo nei fori D27 e D28. L'anodo (+) in D27!",
      componentId: "led1",
      componentType: "led",
      targetPins: { "led1:anode": "bb1:d27", "led1:cathode": "bb1:d28" },
      hint: "Il LED farà un bellissimo effetto respiro: si accende e si spegne piano."
    },
    {
      step: 3,
      text: "Collega un filo VERDE dal pin D5 dell'Arduino al foro A18",
      wireFrom: "nano1:W_D5",
      wireTo: "bb1:a18",
      wireColor: "green",
      hint: "Pin 5 (PWM) per l'effetto fade up e down."
    },
    {
      step: 4,
      text: "Collega un filo VERDE dal foro D25 al foro D27 (ponte resistore→LED)",
      wireFrom: "bb1:d25",
      wireTo: "bb1:d27",
      wireColor: "green",
      hint: "Collega il resistore all'anodo del LED."
    },
    {
      step: 5,
      text: "Collega un filo NERO dal foro A28 al binario GND (−) — catodo LED",
      wireFrom: "bb1:a28",
      wireTo: "bb1:bus-bot-minus-28",
      wireColor: "black",
      hint: "Catodo del LED a massa."
    },
    {
      step: 6,
      text: "Collega un filo NERO dal pin GND dell'Arduino al binario GND (−)",
      wireFrom: "nano1:GND_R",
      wireTo: "bb1:bus-bot-minus-1",
      wireColor: "black",
      hint: "Massa dell'Arduino."
    },
    {
      step: 7,
      text: "Collega un filo ROSSO dal pin 5V al binario +. Guarda il LED respirare!",
      wireFrom: "nano1:5V",
      wireTo: "bb1:bus-bot-plus-1",
      wireColor: "red",
      hint: "Due cicli for: uno sale da 0 a 255, l'altro scende da 255 a 0. Effetto respiro!"
    }
  ],

  // ─────────────────────────────────────────────────
  // v3-cap7-esp7 — Trimmer controlla luminosità (pot1 + r1 + led1, 8 wires)
  // ─────────────────────────────────────────────────
  'v3-cap7-esp7': [
    {
      step: 1,
      text: "Prendi il potenziometro da 10kΩ e posizionalo nei fori H22, H23, H24",
      componentId: "pot1",
      componentType: "potentiometer",
      targetPins: { "pot1:vcc": "bb1:h22", "pot1:signal": "bb1:h23", "pot1:gnd": "bb1:h24" },
      hint: "Il trimmer diventa un dimmer: controlla la luminosità del LED!"
    },
    {
      step: 2,
      text: "Prendi il resistore R1 (470Ω) e posizionalo nei fori C18 e C25",
      componentId: "r1",
      componentType: "resistor",
      targetPins: { "r1:pin1": "bb1:c18", "r1:pin2": "bb1:c25" },
      hint: "Il resistore protegge il LED."
    },
    {
      step: 3,
      text: "Prendi il LED rosso e mettilo nei fori D27 e D28. L'anodo (+) in D27!",
      componentId: "led1",
      componentType: "led",
      targetPins: { "led1:anode": "bb1:d27", "led1:cathode": "bb1:d28" },
      hint: "La luminosità del LED seguirà la posizione del trimmer grazie a map()."
    },
    {
      step: 4,
      text: "Collega un filo ROSSO dal foro F22 al binario + (5V)",
      wireFrom: "bb1:f22",
      wireTo: "bb1:bus-bot-plus-22",
      wireColor: "red",
      hint: "VCC del potenziometro → 5V."
    },
    {
      step: 5,
      text: "Collega un filo GIALLO dal pin A0 dell'Arduino al foro F23",
      wireFrom: "nano1:W_A0",
      wireTo: "bb1:f23",
      wireColor: "yellow",
      hint: "Segnale del trimmer → A0. map() convertirà 0-1023 in 0-255."
    },
    {
      step: 6,
      text: "Collega un filo NERO dal foro F24 al binario GND (−)",
      wireFrom: "bb1:f24",
      wireTo: "bb1:bus-bot-minus-24",
      wireColor: "black",
// © Andrea Marro — 06/04/2026 — ELAB Tutor — Tutti i diritti riservati
      hint: "GND del potenziometro → massa."
    },
    {
      step: 7,
      text: "Collega un filo VERDE dal pin D5 dell'Arduino al foro A18",
      wireFrom: "nano1:W_D5",
      wireTo: "bb1:a18",
      wireColor: "green",
      hint: "Pin 5 (PWM) riceve il valore convertito da map() e controlla il LED."
    },
    {
      step: 8,
      text: "Collega un filo VERDE dal foro D25 al foro D27 (ponte resistore→LED)",
      wireFrom: "bb1:d25",
      wireTo: "bb1:d27",
      wireColor: "green",
      hint: "Collega il resistore all'anodo del LED."
    },
    {
      step: 9,
      text: "Collega un filo NERO dal foro A28 al binario GND (−) — catodo LED",
      wireFrom: "bb1:a28",
      wireTo: "bb1:bus-bot-minus-28",
      wireColor: "black",
      hint: "Catodo del LED a massa."
    },
    {
      step: 10,
      text: "Collega un filo NERO dal pin GND dell'Arduino al binario GND (−)",
      wireFrom: "nano1:GND_R",
      wireTo: "bb1:bus-bot-minus-1",
      wireColor: "black",
      hint: "Massa dell'Arduino."
    },
    {
      step: 11,
      text: "Collega un filo ROSSO dal pin 5V al binario +. Gira il trimmer come un dimmer!",
      wireFrom: "nano1:5V",
      wireTo: "bb1:bus-bot-plus-1",
      wireColor: "red",
      hint: "map(valore, 0, 1023, 0, 255) converte il range del trimmer nel range PWM."
    }
  ],

  // ─────────────────────────────────────────────────
  // v3-cap7-esp8 — DAC 10 bit (pot1, 5 wires)
  // ─────────────────────────────────────────────────
  'v3-cap7-esp8': [
    {
      step: 1,
      text: "Prendi il potenziometro da 10kΩ e posizionalo nei fori H22, H23, H24",
      componentId: "pot1",
      componentType: "potentiometer",
      targetPins: { "pot1:vcc": "bb1:h22", "pot1:signal": "bb1:h23", "pot1:gnd": "bb1:h24" },
      hint: "Il trimmer va su A1 (ingresso). Il DAC è su A0 (uscita analogica vera!)."
    },
    {
      step: 2,
      text: "Collega un filo ROSSO dal foro F22 al binario + (5V)",
      wireFrom: "bb1:f22",
      wireTo: "bb1:bus-bot-plus-22",
      wireColor: "red",
      hint: "VCC del potenziometro → 5V."
    },
    {
      step: 3,
      text: "Collega un filo GIALLO dal pin A1 dell'Arduino al foro F23",
      wireFrom: "nano1:W_A1",
      wireTo: "bb1:f23",
      wireColor: "yellow",
      hint: "Segnale del trimmer → A1 (non A0! A0 è usato come uscita DAC)."
    },
    {
      step: 4,
      text: "Collega un filo NERO dal foro F24 al binario GND (−)",
      wireFrom: "bb1:f24",
      wireTo: "bb1:bus-bot-minus-24",
      wireColor: "black",
      hint: "GND del potenziometro → massa."
    },
    {
      step: 5,
      text: "Collega un filo NERO dal pin GND dell'Arduino al binario GND (−)",
      wireFrom: "nano1:GND_R",
      wireTo: "bb1:bus-bot-minus-1",
      wireColor: "black",
      hint: "Massa dell'Arduino."
    },
    {
      step: 6,
      text: "Collega un filo ROSSO dal pin 5V al binario +. Il DAC produce tensione vera, non PWM!",
      wireFrom: "nano1:5V",
      wireTo: "bb1:bus-bot-plus-1",
      wireColor: "red",
      hint: "analogWriteResolution(10) usa 10 bit = 1024 livelli. Il Nano R4 ha un DAC vero sul pin A0!"
    }
  ],

  // ─────────────────────────────────────────────────
  // v3-cap8-esp1 — Serial.println in setup (solo nano, 0 wires)
  // ─────────────────────────────────────────────────
  'v3-cap8-esp1': [
    {
      step: 1,
      text: "Per questo esperimento non servono componenti esterni! Basta l'Arduino sulla breadboard.",
      componentId: null,
      componentType: null,
      targetPins: {},
      hint: "La comunicazione seriale funziona via USB, senza fili aggiuntivi."
    },
    {
      step: 2,
      text: "Carica il codice e apri il Serial Monitor. Vedrai 'Ciao dal Team di ELAB!' una sola volta!",
      componentId: null,
      componentType: null,
      targetPins: {},
      hint: "Il messaggio è nel setup(), che si esegue UNA SOLA VOLTA all'accensione. Il loop() è vuoto."
    }
  ],

  // ─────────────────────────────────────────────────
  // v3-cap8-esp2 — Serial.println in loop (solo nano, 0 wires)
  // ─────────────────────────────────────────────────
  'v3-cap8-esp2': [
    {
      step: 1,
      text: "Nessun componente esterno necessario! L'Arduino è già sulla breadboard.",
      componentId: null,
      componentType: null,
      targetPins: {},
      hint: "Anche qui usiamo solo la comunicazione USB."
    },
    {
      step: 2,
      text: "Carica il codice e apri il Serial Monitor. Il messaggio si ripete all'infinito!",
      componentId: null,
      componentType: null,
      targetPins: {},
      hint: "Stavolta println è nel loop(), non nel setup(). Si ripete velocissimo! Prova ad aggiungere delay(1000)."
    }
  ],

  // ─────────────────────────────────────────────────
  // v3-cap8-esp4 — Serial Plotter con 2 pot (pot1 + pot2, 8 wires)
  // ─────────────────────────────────────────────────
  'v3-cap8-esp4': [
    {
      step: 1,
      text: "Prendi il primo potenziometro (10kΩ) e posizionalo nei fori H22, H23, H24",
      componentId: "pot1",
      componentType: "potentiometer",
      targetPins: { "pot1:vcc": "bb1:h22", "pot1:signal": "bb1:h23", "pot1:gnd": "bb1:h24" },
      hint: "Il primo trimmer va sul pin A3. Sarà la prima linea del grafico."
    },
    {
      step: 2,
      text: "Prendi il secondo potenziometro (10kΩ) e posizionalo nei fori H27, H28, H29",
      componentId: "pot2",
      componentType: "potentiometer",
      targetPins: { "pot2:vcc": "bb1:h27", "pot2:signal": "bb1:h28", "pot2:gnd": "bb1:h29" },
      hint: "Il secondo trimmer va sul pin A4. Sarà la seconda linea del grafico."
    },
    {
      step: 3,
      text: "Collega un filo ROSSO dal foro F22 al binario + (5V)",
      wireFrom: "bb1:f22",
      wireTo: "bb1:bus-bot-plus-22",
      wireColor: "red",
      hint: "VCC del primo potenziometro → 5V."
    },
    {
      step: 4,
      text: "Collega un filo GIALLO dal pin A3 dell'Arduino al foro F23",
      wireFrom: "nano1:W_A3",
      wireTo: "bb1:f23",
      wireColor: "yellow",
      hint: "Segnale del primo trimmer → A3."
    },
    {
      step: 5,
      text: "Collega un filo NERO dal foro F24 al binario GND (−)",
      wireFrom: "bb1:f24",
      wireTo: "bb1:bus-bot-minus-24",
      wireColor: "black",
      hint: "GND del primo potenziometro → massa."
    },
    {
      step: 6,
      text: "Collega un filo ROSSO dal foro F27 al binario + (5V)",
      wireFrom: "bb1:f27",
      wireTo: "bb1:bus-bot-plus-27",
      wireColor: "red",
      hint: "VCC del secondo potenziometro → 5V."
    },
    {
      step: 7,
      text: "Collega un filo ARANCIONE dal pin A4 dell'Arduino al foro F28",
      wireFrom: "nano1:W_A4",
      wireTo: "bb1:f28",
      wireColor: "orange",
// © Andrea Marro — 06/04/2026 — ELAB Tutor — Tutti i diritti riservati
      hint: "Segnale del secondo trimmer → A4."
    },
    {
      step: 8,
      text: "Collega un filo NERO dal foro F29 al binario GND (−)",
      wireFrom: "bb1:f29",
      wireTo: "bb1:bus-bot-minus-29",
      wireColor: "black",
      hint: "GND del secondo potenziometro → massa."
    },
    {
      step: 9,
      text: "Collega un filo NERO dal pin GND dell'Arduino al binario GND (−)",
      wireFrom: "nano1:GND_R",
      wireTo: "bb1:bus-bot-minus-1",
      wireColor: "black",
      hint: "Massa dell'Arduino."
    },
    {
      step: 10,
      text: "Collega un filo ROSSO dal pin 5V al binario +. Apri il Serial Plotter e gira i trimmer!",
      wireFrom: "nano1:5V",
      wireTo: "bb1:bus-bot-plus-1",
      wireColor: "red",
      hint: "Nel Serial Plotter vedrai 2 linee colorate che si muovono in tempo reale!"
    }
  ],

  // ─────────────────────────────────────────────────
  // v3-cap8-esp5 — Pot + 3 LED + Serial (pot1 + r1+r2+r3 + led1+led2+led3, 13 wires)
  // ─────────────────────────────────────────────────
  'v3-cap8-esp5': [
    {
      step: 1,
      text: "Prendi il potenziometro da 10kΩ e posizionalo nei fori H22, H23, H24",
      componentId: "pot1",
      componentType: "potentiometer",
      targetPins: { "pot1:vcc": "bb1:h22", "pot1:signal": "bb1:h23", "pot1:gnd": "bb1:h24" },
      hint: "Il trimmer va su A3. È il progetto finale: combina tutto il Volume 3!"
    },
    {
      step: 2,
      text: "Prendi il resistore R1 (470Ω) e posizionalo nei fori B16 e B23 — circuito LED rosso",
      componentId: "r1",
      componentType: "resistor",
      targetPins: { "r1:pin1": "bb1:b16", "r1:pin2": "bb1:b23" },
      hint: "R1 protegge il LED rosso, collegato al pin D12."
    },
    {
      step: 3,
      text: "Prendi il LED rosso e mettilo nei fori D25 e D26. L'anodo (+) in D25!",
      componentId: "led1",
      componentType: "led",
      targetPins: { "led1:anode": "bb1:d25", "led1:cathode": "bb1:d26" },
      hint: "Il LED rosso si accende quando il valore è sotto 300."
    },
    {
      step: 4,
      text: "Prendi il resistore R2 (470Ω) e posizionalo nei fori E22 e E29 — circuito LED giallo",
      componentId: "r2",
      componentType: "resistor",
      targetPins: { "r2:pin1": "bb1:e22", "r2:pin2": "bb1:e29" },
      hint: "R2 protegge il LED giallo, collegato al pin D11."
    },
    {
      step: 5,
      text: "Prendi il LED giallo e mettilo nei fori D29 e D30. L'anodo (+) in D29!",
      componentId: "led2",
      componentType: "led",
      targetPins: { "led2:anode": "bb1:d29", "led2:cathode": "bb1:d30" },
      hint: "Il LED giallo si accende quando il valore è tra 300 e 700."
    },
    {
      step: 6,
      text: "Prendi il resistore R3 (470Ω) e posizionalo nei fori I16 e I23 — circuito LED verde",
      componentId: "r3",
      componentType: "resistor",
      targetPins: { "r3:pin1": "bb1:i16", "r3:pin2": "bb1:i23" },
      hint: "R3 protegge il LED verde, collegato al pin D10."
    },
    {
      step: 7,
      text: "Prendi il LED verde e mettilo nei fori H30 e H29. L'anodo (+) in H30!",
      componentId: "led3",
      componentType: "led",
      targetPins: { "led3:anode": "bb1:h30", "led3:cathode": "bb1:h29" },
      hint: "Il LED verde si accende quando il valore supera 700."
    },
    {
      step: 8,
      text: "Collega un filo ROSSO dal foro F22 al binario + (5V)",
      wireFrom: "bb1:f22",
      wireTo: "bb1:bus-bot-plus-22",
      wireColor: "red",
      hint: "VCC del potenziometro → 5V."
    },
    {
      step: 9,
      text: "Collega un filo GIALLO dal pin A3 dell'Arduino al foro F23",
      wireFrom: "nano1:W_A3",
      wireTo: "bb1:f23",
      wireColor: "yellow",
      hint: "Segnale del trimmer → A3."
    },
    {
      step: 10,
      text: "Collega un filo NERO dal foro F24 al binario GND (−)",
      wireFrom: "bb1:f24",
      wireTo: "bb1:bus-bot-minus-24",
      wireColor: "black",
      hint: "GND del potenziometro → massa."
    },
    {
      step: 11,
      text: "Collega un filo ROSSO dal pin D12 dell'Arduino al foro A16",
      wireFrom: "nano1:W_D12",
      wireTo: "bb1:a16",
      wireColor: "red",
      hint: "D12 controlla il LED rosso (zona bassa < 300)."
    },
    {
      step: 12,
      text: "Collega un filo VERDE dal foro D23 al foro D25 (ponte R1→LED rosso)",
      wireFrom: "bb1:d23",
      wireTo: "bb1:d25",
      wireColor: "green",
      hint: "Collega il resistore R1 all'anodo del LED rosso."
    },
    {
      step: 13,
      text: "Collega un filo NERO dal foro A26 al binario GND (−) — catodo LED rosso",
      wireFrom: "bb1:a26",
      wireTo: "bb1:bus-bot-minus-26",
      wireColor: "black",
      hint: "Catodo del LED rosso a massa."
    },
    {
      step: 14,
      text: "Collega un filo GIALLO dal pin D11 dell'Arduino al foro A22",
      wireFrom: "nano1:W_D11",
      wireTo: "bb1:a22",
      wireColor: "yellow",
      hint: "D11 controlla il LED giallo (zona media 300-700)."
    },
    {
      step: 15,
      text: "Collega un filo NERO dal foro A30 al binario GND (−) — catodo LED giallo",
      wireFrom: "bb1:a30",
      wireTo: "bb1:bus-bot-minus-30",
      wireColor: "black",
      hint: "Catodo del LED giallo a massa."
    },
    {
      step: 16,
      text: "Collega un filo VERDE dal pin D10 dell'Arduino al foro F16",
      wireFrom: "nano1:W_D10",
      wireTo: "bb1:f16",
      wireColor: "green",
      hint: "D10 controlla il LED verde (zona alta > 700)."
    },
    {
      step: 17,
      text: "Collega un filo VERDE dal foro H23 al foro H30 (ponte R3→LED verde)",
      wireFrom: "bb1:h23",
      wireTo: "bb1:h30",
      wireColor: "green",
      hint: "Collega il resistore R3 all'anodo del LED verde."
    },
    {
      step: 18,
      text: "Collega un filo NERO dal foro F29 al binario GND (−) — catodo LED verde",
      wireFrom: "bb1:f29",
      wireTo: "bb1:bus-bot-minus-29",
      wireColor: "black",
      hint: "Catodo del LED verde a massa."
    },
    {
      step: 19,
      text: "Collega un filo NERO dal pin GND dell'Arduino al binario GND (−)",
      wireFrom: "nano1:GND_R",
      wireTo: "bb1:bus-bot-minus-1",
      wireColor: "black",
      hint: "Massa dell'Arduino."
    },
    {
      step: 20,
      text: "Collega un filo ROSSO dal pin 5V al binario +. Apri il Serial Monitor e gira il trimmer!",
      wireFrom: "nano1:5V",
      wireTo: "bb1:bus-bot-plus-1",
      wireColor: "red",
      hint: "Progetto finale! Vedrai i valori nel Serial Monitor E i LED cambiare. Complimenti!"
    }
  ]

};

export default GENERATED_BUILD_STEPS;
