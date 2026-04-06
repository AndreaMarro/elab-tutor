// ============================================
// ELAB — Generated buildSteps for Vol2 Cap 3-5
// 9 experiments: multimeter, resistance, batteries
// Format matches existing buildSteps in experiments-vol2.js
// © Andrea Marro — 2026
// ============================================

/**
 * buildSteps per v2-cap3-esp1: Controlliamo la carica della batteria
 * Componenti: battery9v (bat1), multimeter (mm1)
 * Nessuna breadboard — misura diretta
 */
export const buildSteps_v2_cap3_esp1 = [
  {
    step: 1,
    text: "Posiziona la batteria 9V nell'area di lavoro. È la nostra fonte di energia!",
    componentId: "bat1",
    componentType: "battery9v",
    hint: "La batteria 9V ha due poli: il + (positivo) e il − (negativo)."
  },
  {
    step: 2,
    text: "Posiziona il multimetro accanto alla batteria. Questo strumento misura tensione, corrente e resistenza!",
    componentId: "mm1",
    componentType: "multimeter",
    hint: "Il multimetro è lo strumento più importante dell'elettronico."
  },
  {
    step: 3,
    text: "Imposta il multimetro su V (Volt) — la modalità per misurare la tensione.",
    hint: "V sta per Volt, l'unità di misura della tensione elettrica. Cerca il simbolo V sul multimetro."
  },
  {
    step: 4,
    text: "Collega la sonda ROSSA (+) del multimetro al polo + della batteria.",
    wireFrom: "mm1:probe-positive",
    wireTo: "bat1:positive",
    wireColor: "red",
    hint: "Rosso con rosso: la sonda positiva va al polo positivo della batteria."
  },
  {
    step: 5,
    text: "Collega la sonda NERA (−) del multimetro al polo − della batteria.",
    wireFrom: "mm1:probe-negative",
    wireTo: "bat1:negative",
    wireColor: "black",
    hint: "Nero con nero: la sonda negativa va al polo negativo."
  },
  {
    step: 6,
    text: "Leggi il valore sul display! Una batteria nuova mostra circa 9.4-9.6V. Sotto 7V è scarica.",
    hint: "Se il valore è negativo, hai invertito le sonde! Scambiale e riprova."
  }
];

/**
 * buildSteps per v2-cap3-esp2: Diario di misurazione della pila
 * Componenti: battery9v (bat1), multimeter (mm1)
 * Stessi componenti di esp1, ma con focus su misurazione ripetuta
 */
export const buildSteps_v2_cap3_esp2 = [
  {
    step: 1,
    text: "Posiziona la batteria 9V nell'area di lavoro. Oggi iniziamo il nostro diario scientifico!",
    componentId: "bat1",
    componentType: "battery9v",
    hint: "Userai questa stessa batteria per tutta la settimana."
  },
  {
    step: 2,
    text: "Posiziona il multimetro accanto alla batteria.",
    componentId: "mm1",
    componentType: "multimeter",
    hint: "Ogni giorno misurerai la tensione alla stessa ora."
  },
  {
    step: 3,
    text: "Imposta il multimetro su V (Volt) — stessa modalità dell'esperimento precedente.",
    hint: "Per misurare la tensione si usa sempre la modalità V."
  },
  {
    step: 4,
    text: "Collega la sonda ROSSA (+) al polo + della batteria.",
    wireFrom: "mm1:probe-positive",
    wireTo: "bat1:positive",
    wireColor: "red",
    hint: "Sonda rossa al polo positivo, come sempre!"
  },
  {
    step: 5,
    text: "Collega la sonda NERA (−) al polo − della batteria.",
    wireFrom: "mm1:probe-negative",
    wireTo: "bat1:negative",
    wireColor: "black",
    hint: "Sonda nera al polo negativo."
  },
  {
    step: 6,
    text: "Leggi il valore e segnalo su un quaderno con la data e l'ora. Ripeti ogni giorno per una settimana!",
    hint: "Questo è il metodo scientifico: raccogliere dati nel tempo e osservare come cambiano."
  }
];

/**
 * buildSteps per v2-cap3-esp3: Misuriamo una resistenza
 * Componenti: resistor (r1, 330Ω), multimeter (mm1)
 * Nessuna breadboard — misura diretta del componente
 */
export const buildSteps_v2_cap3_esp3 = [
  {
    step: 1,
    text: "Prendi un resistore da 330Ω. Guarda le bande colorate: Arancione-Arancione-Marrone = 330Ω!",
    componentId: "r1",
    componentType: "resistor",
    hint: "Le bande colorate codificano il valore: ogni colore è un numero."
  },
  {
    step: 2,
    text: "Posiziona il multimetro nell'area di lavoro.",
    componentId: "mm1",
    componentType: "multimeter",
    hint: "Oggi impariamo a misurare le resistenze!"
  },
  {
    step: 3,
    text: "Imposta il multimetro su Ω (Ohm) — la modalità per misurare la resistenza.",
    hint: "Ω è la lettera greca omega. È il simbolo degli Ohm, l'unità di misura della resistenza."
  },
  {
    step: 4,
    text: "Collega la sonda ROSSA (+) a un terminale del resistore.",
    wireFrom: "mm1:probe-positive",
    wireTo: "r1:pin1",
    wireColor: "red",
    hint: "Il resistore non ha polarità: puoi collegare le sonde in qualsiasi verso!"
  },
  {
    step: 5,
    text: "Collega la sonda NERA (−) all'altro terminale del resistore.",
    wireFrom: "mm1:probe-negative",
    wireTo: "r1:pin2",
    wireColor: "black",
    hint: "Ora il multimetro manda una piccola corrente e calcola la resistenza."
  },
  {
    step: 6,
    text: "Leggi il valore: dovrebbe essere circa 328-332Ω. Confronta con le bande colorate!",
    hint: "Una piccola differenza è normale: ogni resistore ha una tolleranza del ±5%."
  }
];

/**
 * buildSteps per v2-cap3-esp4: Misuriamo la corrente in un circuito
 * Componenti: battery9v (bat1), breadboard-half (bb1), resistor (r1, 1kΩ), multimeter (mm1)
 * Il multimetro va IN SERIE nel circuito
 */
export const buildSteps_v2_cap3_esp4 = [
  {
    step: 1,
    text: "Posiziona la breadboard (mezza) nell'area di lavoro.",
    componentId: "bb1",
    componentType: "breadboard-half",
    hint: "La breadboard collega i componenti senza saldature."
  },
  {
    step: 2,
    text: "Posiziona la batteria 9V accanto alla breadboard.",
    componentId: "bat1",
    componentType: "battery9v",
    hint: "La batteria 9V alimenta il circuito."
  },
  {
    step: 3,
    text: "Prendi il resistore da 1kΩ e posizionalo nei fori E5 ed E12.",
    componentId: "r1",
    componentType: "resistor",
    targetPins: { "r1:pin1": "bb1:e5", "r1:pin2": "bb1:e12" },
    hint: "1kΩ = 1000 Ohm. Le bande colorate sono: Marrone-Nero-Rosso."
  },
  {
    step: 4,
    text: "Posiziona il multimetro accanto al circuito. Stavolta lo collegheremo IN SERIE!",
    componentId: "mm1",
    componentType: "multimeter",
    hint: "Per misurare la corrente il multimetro va IN SERIE: la corrente deve passarci attraverso."
  },
  {
    step: 5,
    text: "Imposta il multimetro su A (Ampere) o mA — la modalità per misurare la corrente.",
    hint: "A sta per Ampere, l'unità di misura della corrente elettrica."
  },
  {
    step: 6,
    text: "Collega un filo ROSSO dal polo + della batteria al bus + (colonna 1).",
    wireFrom: "bat1:positive",
    wireTo: "bb1:bus-top-plus-1",
    wireColor: "red",
    hint: "Il filo rosso porta la corrente positiva dalla batteria."
  },
  {
// © Andrea Marro — 06/04/2026 — ELAB Tutor — Tutti i diritti riservati
    step: 7,
    text: "Collega un filo ROSSO dal bus + (colonna 5) al foro A5.",
    wireFrom: "bb1:bus-top-plus-5",
    wireTo: "bb1:a5",
    wireColor: "red",
    hint: "Questo filo porta il positivo al resistore."
  },
  {
    step: 8,
    text: "Collega la sonda ROSSA (+) del multimetro al foro A12 (uscita del resistore).",
    wireFrom: "mm1:probe-positive",
    wireTo: "bb1:a12",
    wireColor: "red",
    hint: "Il multimetro si inserisce IN SERIE: interrompiamo il circuito e lo mettiamo nel mezzo."
  },
  {
    step: 9,
    text: "Collega la sonda NERA (−) del multimetro al bus − (colonna 12).",
    wireFrom: "mm1:probe-negative",
    wireTo: "bb1:bus-top-minus-12",
    wireColor: "black",
    hint: "La corrente entra dalla sonda rossa, attraversa il multimetro, ed esce dalla nera."
  },
  {
    step: 10,
    text: "Collega un filo NERO dal bus − (colonna 1) al polo − della batteria.",
    wireFrom: "bb1:bus-top-minus-1",
    wireTo: "bat1:negative",
    wireColor: "black",
    hint: "Il filo nero chiude il circuito."
  },
  {
    step: 11,
    text: "Leggi il valore: circa 9mA! Verifica: I = V/R = 9V / 1000Ω = 0.009A = 9mA.",
    hint: "La Legge di Ohm funziona davvero! I = V/R."
  }
];

/**
 * buildSteps per v2-cap4-esp1: Due resistori in parallelo
 * Componenti: breadboard-half (bb1), resistor x2 (r1, r2, 1kΩ), multimeter (mm1)
 * I due resistori condividono gli stessi nodi
 */
export const buildSteps_v2_cap4_esp1 = [
  {
    step: 1,
    text: "Posiziona la breadboard (mezza) nell'area di lavoro.",
    componentId: "bb1",
    componentType: "breadboard-half",
    hint: "La breadboard collega i componenti senza saldature."
  },
  {
    step: 2,
    text: "Prendi il primo resistore da 1kΩ e posizionalo nei fori E5 ed E12.",
    componentId: "r1",
    componentType: "resistor",
    targetPins: { "r1:pin1": "bb1:e5", "r1:pin2": "bb1:e12" },
    hint: "Questo è il primo dei due resistori in parallelo."
  },
  {
    step: 3,
    text: "Prendi il secondo resistore da 1kΩ e posizionalo nei fori D5 e D12.",
    componentId: "r2",
    componentType: "resistor",
    targetPins: { "r2:pin1": "bb1:d5", "r2:pin2": "bb1:d12" },
    hint: "In parallelo i resistori condividono gli stessi punti di collegamento (stessa colonna)."
  },
  {
    step: 4,
    text: "Posiziona il multimetro accanto alla breadboard.",
    componentId: "mm1",
    componentType: "multimeter",
    hint: "Lo useremo per misurare la resistenza totale del parallelo."
  },
  {
    step: 5,
    text: "Imposta il multimetro su Ω (Ohm).",
    hint: "Misuriamo la resistenza totale dei due resistori in parallelo."
  },
  {
    step: 6,
    text: "Collega la sonda ROSSA (+) del multimetro al foro A5 (un capo del parallelo).",
    wireFrom: "mm1:probe-positive",
    wireTo: "bb1:a5",
    wireColor: "red",
    hint: "La sonda tocca la colonna 5 dove iniziano entrambi i resistori."
  },
  {
    step: 7,
    text: "Collega la sonda NERA (−) del multimetro al foro A12 (l'altro capo del parallelo).",
    wireFrom: "mm1:probe-negative",
    wireTo: "bb1:a12",
    wireColor: "black",
    hint: "La sonda tocca la colonna 12 dove finiscono entrambi i resistori."
  },
  {
    step: 8,
    text: "Leggi il valore: circa 500Ω! Due da 1kΩ in parallelo danno la metà. Come un'autostrada con 2 corsie!",
    hint: "Formula: 1/Rtot = 1/R1 + 1/R2 = 1/1000 + 1/1000 = 2/1000 → Rtot = 500Ω."
  }
];

/**
 * buildSteps per v2-cap4-esp2: Tre resistori in serie
 * Componenti: breadboard-half (bb1), resistor x3 (r1, r2, r3, 1kΩ), multimeter (mm1)
 * I tre resistori sono uno dopo l'altro
 */
export const buildSteps_v2_cap4_esp2 = [
  {
    step: 1,
    text: "Posiziona la breadboard (mezza) nell'area di lavoro.",
    componentId: "bb1",
    componentType: "breadboard-half",
    hint: "La breadboard collega i componenti senza saldature."
  },
  {
    step: 2,
    text: "Prendi il primo resistore da 1kΩ e posizionalo nei fori E2 ed E9.",
    componentId: "r1",
    componentType: "resistor",
    targetPins: { "r1:pin1": "bb1:e2", "r1:pin2": "bb1:e9" },
    hint: "Questo è il primo resistore della catena in serie."
  },
  {
    step: 3,
    text: "Prendi il secondo resistore da 1kΩ e posizionalo nei fori E11 ed E18.",
    componentId: "r2",
    componentType: "resistor",
    targetPins: { "r2:pin1": "bb1:e11", "r2:pin2": "bb1:e18" },
    hint: "Il secondo resistore inizia dalla colonna 11."
  },
  {
    step: 4,
    text: "Collega un filo ARANCIONE dal foro A9 al foro A11 per collegare R1 a R2.",
    wireFrom: "bb1:a9",
    wireTo: "bb1:a11",
    wireColor: "orange",
    hint: "Questo filo collega il primo resistore al secondo, in serie."
  },
  {
    step: 5,
    text: "Prendi il terzo resistore da 1kΩ e posizionalo nei fori E20 ed E27.",
    componentId: "r3",
    componentType: "resistor",
    targetPins: { "r3:pin1": "bb1:e20", "r3:pin2": "bb1:e27" },
    hint: "Il terzo resistore completa la catena."
  },
  {
    step: 6,
    text: "Collega un filo ARANCIONE dal foro A18 al foro A20 per collegare R2 a R3.",
    wireFrom: "bb1:a18",
    wireTo: "bb1:a20",
    wireColor: "orange",
    hint: "Questo filo collega il secondo al terzo resistore."
  },
  {
    step: 7,
    text: "Posiziona il multimetro accanto alla breadboard.",
    componentId: "mm1",
    componentType: "multimeter",
    hint: "Lo useremo per misurare la resistenza totale della serie."
  },
  {
    step: 8,
    text: "Imposta il multimetro su Ω (Ohm).",
    hint: "Misuriamo la resistenza totale dei tre resistori in serie."
  },
  {
    step: 9,
    text: "Collega la sonda ROSSA (+) del multimetro al foro A2 (inizio della catena).",
    wireFrom: "mm1:probe-positive",
    wireTo: "bb1:a2",
    wireColor: "red",
    hint: "Misuriamo dall'inizio del primo resistore."
  },
  {
    step: 10,
    text: "Collega la sonda NERA (−) del multimetro al foro A27 (fine della catena).",
    wireFrom: "mm1:probe-negative",
    wireTo: "bb1:a27",
    wireColor: "black",
    hint: "Misuriamo fino alla fine del terzo resistore."
  },
  {
    step: 11,
    text: "Leggi il valore: circa 3000Ω (3kΩ)! In serie le resistenze si sommano: 1000 + 1000 + 1000.",
    hint: "In serie: Rtot = R1 + R2 + R3. Semplice come mettere in fila tre porte strette!"
  }
];

/**
 * buildSteps per v2-cap4-esp3: Partitore di tensione
 * Componenti: battery9v (bat1), breadboard-half (bb1), resistor x3 (r1-r3, 1kΩ), multimeter (mm1)
 * I tre resistori in serie con la batteria, il multimetro misura tensioni intermedie
 */
export const buildSteps_v2_cap4_esp3 = [
  {
    step: 1,
    text: "Posiziona la breadboard (mezza) nell'area di lavoro.",
    componentId: "bb1",
// © Andrea Marro — 06/04/2026 — ELAB Tutor — Tutti i diritti riservati
    componentType: "breadboard-half",
    hint: "La breadboard collega i componenti senza saldature."
  },
  {
    step: 2,
    text: "Posiziona la batteria 9V accanto alla breadboard.",
    componentId: "bat1",
    componentType: "battery9v",
    hint: "La batteria fornisce 9V al circuito."
  },
  {
    step: 3,
    text: "Prendi il primo resistore da 1kΩ e posizionalo nei fori E2 ed E9.",
    componentId: "r1",
    componentType: "resistor",
    targetPins: { "r1:pin1": "bb1:e2", "r1:pin2": "bb1:e9" },
    hint: "Primo resistore della catena del partitore."
  },
  {
    step: 4,
    text: "Prendi il secondo resistore da 1kΩ e posizionalo nei fori E11 ed E18.",
    componentId: "r2",
    componentType: "resistor",
    targetPins: { "r2:pin1": "bb1:e11", "r2:pin2": "bb1:e18" },
    hint: "Secondo resistore della catena."
  },
  {
    step: 5,
    text: "Collega un filo ARANCIONE dal foro A9 al foro A11 per collegare R1 a R2.",
    wireFrom: "bb1:a9",
    wireTo: "bb1:a11",
    wireColor: "orange",
    hint: "Questo nodo è il primo punto di misura: qui la tensione è 6V."
  },
  {
    step: 6,
    text: "Prendi il terzo resistore da 1kΩ e posizionalo nei fori E20 ed E27.",
    componentId: "r3",
    componentType: "resistor",
    targetPins: { "r3:pin1": "bb1:e20", "r3:pin2": "bb1:e27" },
    hint: "Terzo resistore. Completa il partitore."
  },
  {
    step: 7,
    text: "Collega un filo ARANCIONE dal foro A18 al foro A20 per collegare R2 a R3.",
    wireFrom: "bb1:a18",
    wireTo: "bb1:a20",
    wireColor: "orange",
    hint: "Questo nodo è il secondo punto di misura: qui la tensione è 3V."
  },
  {
    step: 8,
    text: "Collega un filo ROSSO dal polo + della batteria al bus + (colonna 1).",
    wireFrom: "bat1:positive",
    wireTo: "bb1:bus-top-plus-1",
    wireColor: "red",
    hint: "Il filo rosso porta i 9V dalla batteria."
  },
  {
    step: 9,
    text: "Collega un filo ROSSO dal bus + (colonna 2) al foro A2.",
    wireFrom: "bb1:bus-top-plus-2",
    wireTo: "bb1:a2",
    wireColor: "red",
    hint: "Questo filo porta il positivo al primo resistore."
  },
  {
    step: 10,
    text: "Collega un filo NERO dal foro A27 al bus − (colonna 27).",
    wireFrom: "bb1:a27",
    wireTo: "bb1:bus-top-minus-27",
    wireColor: "black",
    hint: "Questo filo collega la fine del terzo resistore al bus negativo."
  },
  {
    step: 11,
    text: "Collega un filo NERO dal bus − (colonna 1) al polo − della batteria.",
    wireFrom: "bb1:bus-top-minus-1",
    wireTo: "bat1:negative",
    wireColor: "black",
    hint: "Il filo nero chiude il circuito."
  },
  {
    step: 12,
    text: "Posiziona il multimetro e impostalo su V (Volt).",
    componentId: "mm1",
    componentType: "multimeter",
    hint: "Ora misuriamo le tensioni nei diversi punti del partitore."
  },
  {
    step: 13,
    text: "Misura 1: collega le sonde ai capi di R1 — sonda rossa in A2, sonda nera in A9. Leggi: circa 3V!",
    wireFrom: "mm1:probe-positive",
    wireTo: "bb1:a2",
    wireColor: "red",
    hint: "Ogni resistore uguale ha 1/3 della tensione totale: 9V / 3 = 3V."
  },
  {
    step: 14,
    text: "Collega la sonda NERA al foro A9.",
    wireFrom: "mm1:probe-negative",
    wireTo: "bb1:a9",
    wireColor: "black",
    hint: "Stai misurando la caduta di tensione ai capi del primo resistore."
  },
  {
    step: 15,
    text: "Ora sposta la sonda nera al foro A18 per misurare attraverso R1+R2: circa 6V!",
    hint: "Spostando le sonde puoi misurare tensioni diverse: 3V, 6V o 9V. È il partitore di tensione!"
  }
];

/**
 * buildSteps per v2-cap5-esp1: Batterie in serie
 * Componenti: battery9v x2 (bat1, bat2), multimeter (mm1)
 * Due batterie collegate + a − in serie
 */
export const buildSteps_v2_cap5_esp1 = [
  {
    step: 1,
    text: "Posiziona la prima batteria 9V nell'area di lavoro.",
    componentId: "bat1",
    componentType: "battery9v",
    hint: "Questa è la prima batteria. Ne useremo due!"
  },
  {
    step: 2,
    text: "Posiziona la seconda batteria 9V accanto alla prima.",
    componentId: "bat2",
    componentType: "battery9v",
    hint: "Le due batterie verranno collegate in serie."
  },
  {
    step: 3,
    text: "Collega un filo ROSSO dal polo + della prima batteria al polo − della seconda batteria.",
    wireFrom: "bat1:positive",
    wireTo: "bat2:negative",
    wireColor: "red",
    hint: "In serie: il + di una si collega al − dell'altra, come le pile nella torcia!"
  },
  {
    step: 4,
    text: "Posiziona il multimetro e impostalo su V (Volt).",
    componentId: "mm1",
    componentType: "multimeter",
    hint: "Misureremo la tensione totale delle due batterie in serie."
  },
  {
    step: 5,
    text: "Collega la sonda ROSSA (+) del multimetro al polo + della seconda batteria (il polo libero).",
    wireFrom: "mm1:probe-positive",
    wireTo: "bat2:positive",
    wireColor: "red",
    hint: "Misuriamo la tensione totale: dal polo + rimasto libero..."
  },
  {
    step: 6,
    text: "Collega la sonda NERA (−) del multimetro al polo − della prima batteria (il polo libero).",
    wireFrom: "mm1:probe-negative",
    wireTo: "bat1:negative",
    wireColor: "black",
    hint: "...al polo − rimasto libero. Le tensioni si sommano!"
  },
  {
    step: 7,
    text: "Leggi il valore: circa 18V! Le tensioni in serie si sommano: 9V + 9V = 18V.",
    hint: "È lo stesso principio delle pile nella torcia: 1.5V + 1.5V = 3V."
  }
];

/**
 * buildSteps per v2-cap5-esp2: Batterie in antiserie
 * Componenti: battery9v x2 (bat1, bat2), multimeter (mm1)
 * Due batterie collegate + a + (opposte)
 */
export const buildSteps_v2_cap5_esp2 = [
  {
    step: 1,
    text: "Posiziona la prima batteria 9V nell'area di lavoro.",
    componentId: "bat1",
    componentType: "battery9v",
    hint: "Questa è la prima batteria."
  },
  {
    step: 2,
    text: "Posiziona la seconda batteria 9V accanto alla prima.",
    componentId: "bat2",
    componentType: "battery9v",
    hint: "Stavolta le collegheremo al contrario!"
  },
  {
    step: 3,
    text: "Collega un filo ROSSO dal polo + della prima batteria al polo + della seconda batteria.",
    wireFrom: "bat1:positive",
    wireTo: "bat2:positive",
    wireColor: "red",
    hint: "Antiserie: + con +! Le batterie 'spingono' in direzioni opposte."
  },
  {
    step: 4,
// © Andrea Marro — 06/04/2026 — ELAB Tutor — Tutti i diritti riservati
    text: "Posiziona il multimetro e impostalo su V (Volt).",
    componentId: "mm1",
    componentType: "multimeter",
    hint: "Misureremo la tensione delle due batterie che si oppongono."
  },
  {
    step: 5,
    text: "Collega la sonda ROSSA (+) del multimetro al polo − della seconda batteria.",
    wireFrom: "mm1:probe-positive",
    wireTo: "bat2:negative",
    wireColor: "red",
    hint: "Misuriamo tra i due poli liberi (entrambi negativi)."
  },
  {
    step: 6,
    text: "Collega la sonda NERA (−) del multimetro al polo − della prima batteria.",
    wireFrom: "mm1:probe-negative",
    wireTo: "bat1:negative",
    wireColor: "black",
    hint: "Le due batterie si oppongono: la tensione dovrebbe annullarsi!"
  },
  {
    step: 7,
    text: "Leggi il valore: circa 0V! Le tensioni si sottraggono: 9V − 9V = 0V. Come un tiro alla fune alla pari!",
    hint: "In antiserie le forze si annullano. Non è pericoloso con batterie uguali."
  }
];

// ============================================
// Export map per integrazione facile
// ============================================
export const GENERATED_BUILDSTEPS_VOL2 = {
  'v2-cap3-esp1': buildSteps_v2_cap3_esp1,
  'v2-cap3-esp2': buildSteps_v2_cap3_esp2,
  'v2-cap3-esp3': buildSteps_v2_cap3_esp3,
  'v2-cap3-esp4': buildSteps_v2_cap3_esp4,
  'v2-cap4-esp1': buildSteps_v2_cap4_esp1,
  'v2-cap4-esp2': buildSteps_v2_cap4_esp2,
  'v2-cap4-esp3': buildSteps_v2_cap4_esp3,
  'v2-cap5-esp1': buildSteps_v2_cap5_esp1,
  'v2-cap5-esp2': buildSteps_v2_cap5_esp2,
};

export default GENERATED_BUILDSTEPS_VOL2;
