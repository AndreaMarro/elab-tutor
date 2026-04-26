---
id: digital-read
type: concept
title: "digitalRead() — Leggere un pin digitale"
locale: it
volume_ref: 3
pagina_ref: 63
created_at: 2026-04-26
updated_at: 2026-04-26
updated_by: scribe
tags: [digitalread, pin-digitali, input, high, low, pulsante, pinmode, pullup, pulldown, if-else, arduino, atm328p]
---

## Definizione

`digitalRead(pin)` è la funzione Arduino che legge lo stato di un pin digitale e restituisce **HIGH** se sul pin arriva circa 5V oppure **LOW** se arriva circa 0V. Vol. 3 pag. 63 la introduce per la prima volta con il pulsante: "il Nano *ascolta* il tasto e decide cosa fare in base allo stato letto".

## Analogia per la classe

Ragazzi, immaginate che ogni pin digitale del Nano abbia un piccolo spia — come la lucina di un campanello. Quando qualcuno preme il campanello (il pulsante), arriva corrente e la spia si accende: il Nano legge HIGH. Quando il campanello è libero, la spia è spenta: il Nano legge LOW. `digitalRead()` è il Nano che guarda quella spia e vi dice se qualcuno sta suonando in questo momento.

## Cosa succede fisicamente

Il pin digitale misura la tensione rispetto a GND. L'ATmega328p confronta quella tensione con due soglie fisse:

| Tensione sul pin     | `digitalRead()` restituisce | Significato         |
|----------------------|-----------------------------|---------------------|
| > 3.0 V (≥ 0.6 × 5V) | `HIGH` (= 1)               | Segnale alto        |
| < 1.5 V (≤ 0.3 × 5V) | `LOW` (= 0)                | Segnale basso       |
| 1.5 V – 3.0 V        | Indefinito (evitare)        | Zona d'incertezza   |

**La zona d'incertezza è pericolosa**: il Nano può restituire HIGH o LOW in modo imprevedibile. Resistenze di pull-up o pull-down eliminano questa situazione.

### Sintassi Arduino

```cpp
// Prima di tutto: dichiara il pin come ingresso
pinMode(7, INPUT);          // pin in ascolto, resistenza esterna obbligatoria

// Oppure con pull-up interno (più comodo, logica invertita)
pinMode(7, INPUT_PULLUP);   // pin in ascolto, resistenza interna 20–50 kΩ verso 5V

// Poi leggi il valore
int stato = digitalRead(7); // HIGH o LOW
```

**Regola fondamentale:** `digitalRead()` funziona SOLO se prima avete chiamato `pinMode(pin, INPUT)` o `pinMode(pin, INPUT_PULLUP)`. Senza `pinMode`, il pin resta configurato come OUTPUT e la lettura non ha senso.

### Esempio base — pulsante + LED

```cpp
void setup() {
  pinMode(7, INPUT_PULLUP);  // pulsante su D7 (con pull-up interno)
  pinMode(13, OUTPUT);       // LED su D13
}

void loop() {
  int stato = digitalRead(7);
  if (stato == LOW) {          // LOW = pulsante premuto (logica invertita con INPUT_PULLUP)
    digitalWrite(13, HIGH);    // accende il LED
  } else {
    digitalWrite(13, LOW);     // spegne il LED
  }
}
```

### Pull-down vs INPUT_PULLUP

| Configurazione   | Resistenza | Pin libero → legge | Pin premuto → legge | Cablaggio pulsante          |
|------------------|-----------|--------------------|--------------------|------------------------------|
| `INPUT` + pull-down esterno (10 kΩ verso GND) | Esterna | LOW | HIGH | Pulsante tra pin e 5V |
| `INPUT_PULLUP`   | Interna 20–50 kΩ | HIGH | LOW | Pulsante tra pin e GND |

**Consiglio pratico:** nei kit ELAB usate quasi sempre `INPUT_PULLUP` — meno cavi, nessuna resistenza esterna da aggiungere, e il Nano ha già tutto l'hardware necessario. Ricordate solo che la logica è **invertita**: premuto = LOW, rilasciato = HIGH.

### Tabella logica — pulsante con INPUT_PULLUP

| Azione sul pulsante | `digitalRead()` | LED con `if (stato == LOW)` |
|---------------------|-----------------|-----------------------------|
| Rilasciato          | HIGH            | Spento                      |
| Premuto             | LOW             | Acceso                      |

### Pin utilizzabili su Arduino Nano per INPUT

| Gruppo | Pin      | Note                                             |
|--------|----------|--------------------------------------------------|
| PORTD  | D2 – D7  | Ottimi per pulsanti e sensori digitali           |
| PORTB  | D8 – D12 | Liberi se non si usa SPI                         |
| PORTD  | D2, D3   | Supportano anche `attachInterrupt()` (INT0, INT1) |

**Evitate D0 e D1 per INPUT** se usate `Serial.print()` — condivisi con la comunicazione USB e possono dare letture errate.

### Esempio avanzato — pulsante come interruttore a mantenimento (toggle)

```cpp
bool ledAcceso = false;
bool ultimoStato = HIGH;       // INPUT_PULLUP: default HIGH

void setup() {
  pinMode(7, INPUT_PULLUP);
  pinMode(13, OUTPUT);
}

void loop() {
  bool statoCorrente = digitalRead(7);
  if (ultimoStato == HIGH && statoCorrente == LOW) {  // fronte di discesa = pressione
    ledAcceso = !ledAcceso;
    digitalWrite(13, ledAcceso ? HIGH : LOW);
  }
  ultimoStato = statoCorrente;
  delay(20);                   // debounce minimo — vedi concepts/debounce.md per soluzione completa
}
```

## Esperimenti correlati

- Vol. 3 pag. 63 — Prima lettura pulsante: `digitalRead()` + `if/else` + LED (`v3-cap7-esp1`)
- Vol. 3 pag. 65 — Pulsante come interruttore a mantenimento (toggle) (`v3-cap7-esp2`)
- Vol. 3 pag. 67 — Due pulsanti, due LED: lettura parallela (`v3-cap7-esp3`)
- Vol. 2 pag. 55 — Debounce hardware e software con `millis()` (`v2-cap5-debounce`)
- Vedi anche: [concepts/pin-digitali.md](pin-digitali.md), [concepts/pulsante.md](pulsante.md), [concepts/digital-write.md](digital-write.md), [concepts/debounce.md](debounce.md)

## Errori comuni

1. **Dimenticare `pinMode(pin, INPUT)` o `INPUT_PULLUP`**: senza questa riga il pin è configurato come OUTPUT (default). `digitalRead()` può restituire sempre HIGH o valori inconsistenti. Verificare che `pinMode` sia in `setup()` con la modalità corretta.

2. **Confondere la logica invertita di INPUT_PULLUP**: con `INPUT_PULLUP`, premuto = LOW e rilasciato = HIGH. Scrivere `if (stato == HIGH)` pensando di rilevare la pressione è l'errore più comune. Il libro a pag. 63 usa `if (stato == LOW)` per esattamente questo motivo.

3. **Pin floating (senza pull-up né pull-down)**: un pin D configurato come `INPUT` puro, senza nulla collegato, fluttua tra HIGH e LOW raccogliendo interferenze dall'aria. Il LED si accende e spegne da solo. Usare sempre `INPUT_PULLUP` oppure aggiungere una resistenza da 10 kΩ verso GND.

4. **Pulsante cortocircuita direttamente 5V verso GND**: collegare il pulsante tra 5V e GND senza resistenza di limitazione fa scorrere corrente indefinita quando premuto. Usare sempre il cablaggio consigliato dal libro: pulsante tra pin e GND con `INPUT_PULLUP`, oppure pulsante tra pin e 5V con pull-down da 10 kΩ.

5. **Rimbalzo del pulsante non gestito (debounce)**: ogni pulsante meccanico genera decine di transizioni HIGH/LOW rapide nel momento della pressione — il "rimbalzo". Senza debounce, un singolo click può essere letto come 10-20 pressioni. Per esperimenti di conteggio o toggle, aggiungere `delay(20)` dopo la rilevazione oppure usare la tecnica `millis()` (vedi [concepts/debounce.md](debounce.md)).

## Domande tipiche degli studenti

**"Perché con INPUT_PULLUP il pulsante dà LOW quando lo premo? Sembra al contrario."**
Con `INPUT_PULLUP` il pin è tenuto a 5V da una resistenza interna — quindi legge HIGH quando non c'è niente collegato. Quando premete il pulsante, collegate il pin direttamente a GND e la tensione scende a 0V: LOW. È il Nano che "sente il calo" invece che "sente la salita". Può sembrare strano, ma è il modo più sicuro e conveniente: nessuna resistenza esterna da aggiungere.

**"Posso leggere un pin e scriverci nello stesso momento?"**
No: ogni pin è o in ingresso o in uscita in un dato momento. `pinMode(pin, INPUT)` e `pinMode(pin, OUTPUT)` sono stati esclusivi. Se volete sia leggere sia controllare qualcosa, usate due pin diversi — uno per il pulsante, uno per il LED.

**"Il `digitalRead()` nel `loop()` è troppo veloce? Perde le pressioni veloci?"**
Il `loop()` gira migliaia di volte al secondo, quindi in teoria legge la pressione molte volte. Il problema opposto è il rimbalzo: legge *troppe* transizioni per ogni singola pressione. Per le prime attività non è un problema, ma per i contatori il debounce è fondamentale.

**"Perché il LED a volte si accende da solo senza che io prema niente?"**
Quasi sempre è il pin floating: D configurato `INPUT` senza pull-up né pull-down. L'antenna del filo raccoglie i campi elettrici intorno (il vostro corpo, i cavi USB, le luci al neon). Aggiungete `INPUT_PULLUP` nel `setup()` e il problema sparisce.

## PRINCIPIO ZERO

**Safety — mai cortocircuitare 5V e GND con il pulsante:** il cablaggio corretto con `INPUT_PULLUP` non mette mai in contatto diretto 5V e GND — il pulsante collega il pin a GND, non la sorgente d'alimentazione. Se usate la configurazione con pull-down esterno, la resistenza da 10 kΩ limita la corrente a 0.5 mA quando il pulsante è premuto: del tutto sicura. Non modificare mai lo schema del libro eliminando le resistenze.

**Safety — nessun pericolo elettrico con componenti del kit:** i pulsanti del kit ELAB lavorano a 5V e correnti di pochi mA. Non vi è alcun rischio per i ragazzi nel maneggiare i componenti e i cavi durante l'esperimento.

**Narrativa per la classe:** `digitalRead()` è il momento in cui i ragazzi scoprono che il Nano non è solo una macchina che comanda — può anche *ascoltare*. Il libro a pag. 63 descrive questo passaggio come "dare al Nano un senso del tatto": il tasto è il primo modo in cui i ragazzi comunicano fisicamente con il programma. Fare accendere il LED tenendo premuto il pulsante, e spegnerlo rilasciandolo, crea la connessione immediata tra gesto fisico e logica digitale. È il cuore dell'interattività e il punto di partenza per tutti i progetti "reattivi" — dal semaforo all'allarme al robot.

**Cosa dire ai ragazzi:**
- "Vediamo come fa il Nano a sapere se state premendo il tasto — cercate pagina 63 del libro"
- "Il libro dice: *il Nano ascolta il tasto e decide cosa fare* — adesso voi decidete cosa succede quando lo premete"
- "Con INPUT_PULLUP la logica è al contrario: premuto = LOW, rilasciato = HIGH — sembra strano ma è il modo più comodo, nessun filo in più"
- "Provate: cambiate `if (stato == LOW)` in `if (stato == HIGH)` e vedete cosa succede — il LED si comporta al contrario"
- "Questo è il primo programma dove voi comandate il Nano *in tempo reale* — non solo con il codice, ma con le mani"

**Progressione didattica consigliata:**
1. Pulsante + `INPUT_PULLUP` + `digitalRead()` → LED acceso mentre premi (pag. 63)
2. Cambiare il comportamento: LED spento mentre premi (invertire la logica nel codice)
3. Pulsante come interruttore a mantenimento (toggle) → fronte di discesa + variabile booleana (pag. 65)
4. Due pulsanti, due LED → lettura parallela di più pin (pag. 67)
5. Pulsante + `Serial.print()` → vedere i valori HIGH/LOW sul Serial Monitor per capire il rimbalzo
6. Introduzione debounce con `delay(20)` → contatore di pressioni affidabile

## Link L1 (raw)

Query RAG che attivano questo concetto in `src/data/rag-chunks.json`:
- `"digitalRead"` — codice e spiegazione funzione
- `"pinMode INPUT INPUT_PULLUP"` — configurazione pin ingresso
- `"pulsante arduino input"` — Vol. 3 pag. 63 bookText
- `"HIGH LOW lettura pin digitale"` — tabella soglie tensione ATmega328p
- `"pull-up resistenza interna arduino"` — logica invertita INPUT_PULLUP
- `"if else stato pulsante"` — struttura condizionale + digitalRead
- `"pin floating debounce"` — errori comuni ingresso digitale
- `"fronte discesa pressione pulsante toggle"` — Vol. 3 pag. 65 bookText
