---
id: pin-mode
type: concept
title: "pinMode() — Configurare un pin come ingresso o uscita"
locale: it
volume_ref: 3
pagina_ref: 47
created_at: 2026-04-26
updated_at: 2026-04-26
updated_by: scribe
tags: [pinmode, setup, output, input, input-pullup, pin-digitali, arduino, atm328p, digital-write, digital-read]
---

## Definizione

`pinMode(pin, modalità)` è la funzione Arduino che dice al Nano *come usare* un pin digitale: se deve mandare corrente verso l'esterno (**OUTPUT**), se deve ascoltare un segnale dall'esterno (**INPUT**), oppure se deve ascoltare con una resistenza interna di sicurezza (**INPUT_PULLUP**). Vol. 3 pag. 47 la introduce per la prima volta nel programma Blink: "prima di accendere o spegnere un pin, devi dire al Nano cosa vuoi che quel pin faccia".

## Analogia per la classe

Ragazzi, immaginate ogni pin del Nano come un lavoratore in una squadra. Prima di iniziare il turno, il capocantiere (voi, con `pinMode`) deve dire a ciascuno: "oggi fai il muratore — *mandi* mattoni" (OUTPUT) oppure "oggi fai la guardia — *ascolti* cosa arriva" (INPUT). Se non glielo dite, il lavoratore non sa cosa fare e si comporta in modo imprevedibile. `pinMode()` è quella telefonata di inizio turno, e va fatta **sempre** in `setup()`, prima di qualunque altra cosa.

## Cosa succede fisicamente

All'interno dell'ATmega328p ogni pin digitale ha un piccolo circuito configurabile. `pinMode` cambia la configurazione di quel circuito:

| Modalità        | Il pin è …                          | Tensione sul pin quando libero | Usato con               |
|-----------------|-------------------------------------|---------------------------------|-------------------------|
| `OUTPUT`        | Un'uscita: spinge corrente fuori     | Definita dal codice (5V o 0V)   | `digitalWrite()`        |
| `INPUT`         | Un ingresso: misura la tensione      | Fluttua (pericolo floating)     | `digitalRead()` + pull-down esterno |
| `INPUT_PULLUP`  | Un ingresso con resistenza interna   | Tenuta a 5V (sicura)            | `digitalRead()` + pulsante verso GND |

### Sintassi Arduino

```cpp
void setup() {
  pinMode(13, OUTPUT);        // D13 come uscita → può accendere un LED
  pinMode(7, INPUT);          // D7 come ingresso → legge un segnale esterno
  pinMode(2, INPUT_PULLUP);   // D2 come ingresso con pull-up → legge un pulsante (logica invertita)
}
```

**Regola d'oro:** `pinMode()` va chiamata **una volta sola** in `setup()`, **prima** di usare `digitalWrite()` o `digitalRead()` nel `loop()`. Se dimenticate `pinMode`, il pin usa la configurazione precedente (o quella di default dopo il reset, che è INPUT) e i risultati sono imprevedibili.

### Le tre modalità in dettaglio

#### OUTPUT

Il pin può erogare fino a **20 mA** in modo continuo (massimo assoluto 40 mA). Con `digitalWrite(pin, HIGH)` porta il pin a 5V; con `digitalWrite(pin, LOW)` a 0V.

```cpp
pinMode(9, OUTPUT);
digitalWrite(9, HIGH);   // 5V → LED acceso
```

#### INPUT

Il pin misura la tensione senza mettere resistenza interna. Se non c'è nulla collegato, il pin "fluttua" e raccoglie interferenze elettriche. **Usare sempre con una resistenza di pull-down da 10 kΩ verso GND** se non si usa `INPUT_PULLUP`.

```cpp
pinMode(4, INPUT);           // serve resistenza esterna da 10 kΩ verso GND
int v = digitalRead(4);      // HIGH o LOW
```

#### INPUT_PULLUP

Il pin misura la tensione **e** attiva una resistenza interna da ~20–50 kΩ verso 5V. Il pin libero legge HIGH in modo stabile; premendo un pulsante verso GND legge LOW. **Logica invertita:** premuto = LOW, rilasciato = HIGH.

```cpp
pinMode(2, INPUT_PULLUP);    // nessuna resistenza esterna necessaria
int v = digitalRead(2);      // LOW se pulsante premuto, HIGH se rilasciato
```

### Pin disponibili su Arduino Nano

| Registro | Pin       | Note                                                   |
|----------|-----------|--------------------------------------------------------|
| PORTD    | D0 – D7   | D0, D1 condivisi con UART — evitare per INPUT/OUTPUT se si usa `Serial` |
| PORTB    | D8 – D13  | D13 ha LED integrato già collegato sulla scheda        |
| PORTC    | A0 – A5   | Usabili come digitali con `pinMode` se non servono per `analogRead()` |

### Esempio completo — LED + pulsante

```cpp
void setup() {
  pinMode(13, OUTPUT);       // LED interno come uscita
  pinMode(2, INPUT_PULLUP);  // pulsante come ingresso con pull-up
}

void loop() {
  int stato = digitalRead(2);
  if (stato == LOW) {          // pulsante premuto → LOW con INPUT_PULLUP
    digitalWrite(13, HIGH);   // accende LED
  } else {
    digitalWrite(13, LOW);    // spegne LED
  }
}
```

## Esperimenti correlati

- Vol. 3 pag. 47 — Blink: primo sketch con `pinMode(13, OUTPUT)` e LED integrato (`v3-cap5-esp1`)
- Vol. 3 pag. 56 — LED esterno su breadboard: `pinMode` + `digitalWrite` + resistenza 470 Ω (`v3-cap6-esp1`)
- Vol. 3 pag. 57 — Cambiare pin: spostare `pinMode` da D13 a D8 nel codice e sulla breadboard (`v3-cap6-esp2`)
- Vol. 3 pag. 63 — Pulsante: `pinMode(pin, INPUT_PULLUP)` + `digitalRead()` (`v3-cap7-esp1`)
- Vedi anche: [concepts/digital-write.md](digital-write.md), [concepts/digital-read.md](digital-read.md), [concepts/pin-digitali.md](pin-digitali.md), [concepts/pulsante.md](pulsante.md)

## Errori comuni

1. **Dimenticare `pinMode` completamente**: il comportamento del pin dipende dalla configurazione precedente (default INPUT dopo reset). `digitalWrite()` sembra non fare nulla o il LED rimane acceso debolmente. Verificare sempre che `pinMode(pin, OUTPUT)` sia in `setup()` prima di usare `digitalWrite()`.

2. **Chiamare `pinMode` nel `loop()` invece di `setup()`**: funziona, ma spreca cicli CPU rieseguendo la configurazione a ogni iterazione (migliaia di volte al secondo). La configurazione del pin non cambia — metterla in `setup()` è la pratica corretta.

3. **Usare `INPUT` senza resistenza esterna — pin floating**: un pin configurato `INPUT` senza nulla collegato fluttua tra HIGH e LOW raccogliendo interferenze. Il LED si accende e spegne da solo senza motivo. Usare `INPUT_PULLUP` oppure aggiungere una resistenza da 10 kΩ verso GND.

4. **Dimenticare la logica invertita di `INPUT_PULLUP`**: con `INPUT_PULLUP`, il pulsante **premuto** legge LOW, non HIGH. Scrivere `if (stato == HIGH)` per rilevare la pressione è l'errore più frequente. Il libro a pag. 63 usa esplicitamente `if (stato == LOW)`.

5. **Usare `pinMode(pin, OUTPUT)` su un pin già collegato a 5V o GND esterno**: se collegato a 5V e poi impostato OUTPUT + LOW, si crea un cortocircuito tra la sorgente e la resistenza interna del Nano. Impostare sempre `OUTPUT` prima di collegare il componente, oppure accertarsi che non ci siano conflitti di tensione.

## Domande tipiche degli studenti

**"Perché devo dire al Nano se un pin è ingresso o uscita? Non può capirlo da solo?"**
Lo stesso pin fisico può fisicamente fare entrambe le cose — è il codice che decide come usarlo. Il Nano non sa se avete collegato un LED (che ha bisogno di OUTPUT) o un pulsante (che ha bisogno di INPUT): glielo dite voi con `pinMode`. È come dire a una presa della corrente: "adesso sei una spina che dà corrente" oppure "adesso sei un sensore che misura". L'hardware da solo non sa quale dei due volete.

**"Posso cambiare `pinMode` durante il programma, ad esempio passare da OUTPUT a INPUT?"**
Sì, è tecnicamente possibile chiamare `pinMode` anche dentro `loop()`. In alcuni progetti avanzati si fa per risparmiare pin (es. comunicazione bidirezionale su un singolo filo). Nei kit ELAB è raro e non necessario: usate pin separati per ingresso e uscita, è più semplice e più leggibile.

**"Se uso `INPUT_PULLUP` su tutti i pin, funziona sempre?"**
No: `INPUT_PULLUP` ha senso solo per i pin che leggono segnali — non per i pin che devono comandare LED, motori o altri componenti. Su un pin che poi userete con `digitalWrite()`, la modalità corretta è `OUTPUT`. Usare `INPUT_PULLUP` su un pin OUTPUT e poi chiamare `digitalWrite()` sovrascrive la configurazione in modo confuso.

**"C'è una modalità `OUTPUT_PULLDOWN`?"**
No, non esiste sull'ATmega328p. Esiste solo `INPUT_PULLUP` (resistenza interna verso 5V). Se avete bisogno di un pull-down esterno (resistenza verso GND), dovete aggiungerla voi fisicamente sul circuito. I pin configurati come OUTPUT non hanno resistenze interne: il pin è connesso direttamente all'uscita del driver digitale.

## PRINCIPIO ZERO

**Safety — corrente massima per pin:** `pinMode(pin, OUTPUT)` abilita il pin a erogare corrente. Il limite assoluto è 40 mA per pin, 200 mA totali per la scheda. Collegare carichi pesanti (motori, molti LED) direttamente ai pin può bruciare il Nano in modo permanente. Usate sempre resistenze di limitazione con i LED (≥ 220 Ω) e driver appositi (transistor, MOSFET) per carichi > 20 mA. Il libro usa sempre componenti sicuri — seguite sempre gli schemi del volume.

**Safety — nessun pericolo per i ragazzi:** i pin del kit ELAB lavorano a 5V e correnti di pochi milliampere. Non vi è alcun rischio elettrico per i ragazzi nel toccare fili, pin e componenti durante gli esperimenti. L'unico rischio è danni al Nano stesso se si sbaglia il cablaggio — per questo si segue lo schema del libro.

**Narrativa per la classe:** `pinMode()` è il primo passo di ogni programma Arduino che interagisce con il mondo fisico. Il libro lo introduce a pag. 47 come la "dichiarazione di intenti" del codice: prima di fare qualsiasi cosa con un pin, dici al Nano cosa vuoi. Questo concetto — *configurare prima, usare poi* — è fondamentale non solo in Arduino ma in tutta la programmazione embedded. Mostrare agli studenti che la stessa riga `pinMode` appare sia nel programma Blink (OUTPUT per il LED) sia nel programma con il pulsante (INPUT_PULLUP per il tasto) aiuta a capire che è una struttura universale, non un dettaglio da memorizzare a caso.

**Cosa dire ai ragazzi:**
- "Prima di tutto diciamo al Nano cosa vogliamo che faccia ogni pin — trovate pagina 47 del libro"
- "Il libro dice: *prima di accendere o spegnere un pin, devi dire al Nano cosa vuoi che quel pin faccia* — `pinMode` è esattamente questo"
- "OUTPUT significa 'manda corrente fuori', INPUT significa 'ascolta cosa arriva', INPUT_PULLUP significa 'ascolta con una resistenza di sicurezza dentro'"
- "Se dimenticate `pinMode`, il LED non si accende — non è un bug nel codice, è che il Nano non sa ancora cosa deve fare quel pin"
- "Provate: commentate la riga `pinMode` con `//` e ricaricate. Poi ripristinatela. Vedete la differenza?"

**Progressione didattica consigliata:**
1. `pinMode(13, OUTPUT)` → sketch Blink, LED integrato D13 (Vol. 3 pag. 47) — nessun componente fisico
2. LED esterno con `pinMode(pin, OUTPUT)` su D8 — resistenza 470 Ω su breadboard (pag. 56–57)
3. Cambiare il numero di pin nel `pinMode` e sul circuito → generalizzazione (pag. 57)
4. `pinMode(pin, INPUT_PULLUP)` + pulsante verso GND (pag. 63) — introduce logica invertita
5. Combinare OUTPUT + INPUT_PULLUP nello stesso `setup()` → LED comandato da pulsante (pag. 63–65)
6. Spiegare perché `INPUT` puro senza pull-down dà letture strane → pin floating come esperimento visivo

## Link L1 (raw)

Query RAG che attivano questo concetto in `src/data/rag-chunks.json`:
- `"pinMode OUTPUT INPUT"` — spiegazione modalità pin Arduino
- `"pinMode setup arduino"` — Vol. 3 pag. 47 bookText Blink
- `"INPUT_PULLUP pulsante"` — Vol. 3 pag. 63 bookText
- `"pin digitale configurazione arduino nano"` — tabella PORTD PORTB PORTC
- `"pin floating pull-up pull-down"` — errori comuni ingresso digitale
- `"pinMode LED resistenza 470 breadboard"` — Vol. 3 pag. 56 bookText
- `"setup loop arduino struttura programma"` — Vol. 3 pag. 47 contesto generale
