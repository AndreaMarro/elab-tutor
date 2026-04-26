---
id: serial-print
type: concept
title: "Serial.print() e Serial.println() — Mandare messaggi al computer"
locale: it
volume_ref: 3
pagina_ref: 75
created_at: 2026-04-26
updated_at: 2026-04-26
updated_by: scribe
tags: [serial-print, serial-println, serial, debug, uart, serial-monitor, serial-begin, baud-rate, string, int, float, hex, bin, arduino]
---

## Definizione

`Serial.print()` e `Serial.println()` sono le funzioni Arduino che inviano testo e numeri dal Nano al computer attraverso il cavo USB, rendendoli visibili nel Serial Monitor. Vol. 3 pag. 75 le introduce come "il modo del Nano per parlarvi mentre il programma gira — come i sottotitoli di un film".

## Analogia per la classe

Ragazzi, immaginate il Nano come un cuoco in cucina (voi non potete entrare). Ogni volta che completa un passaggio, vi manda un bigliettino sotto la porta con scritto cosa ha appena fatto: "ho letto il sensore: 523", "il LED è acceso", "temperatura: 24.5°C". `Serial.println()` è quel bigliettino. Il Serial Monitor è la vostra cassetta della posta dove i bigliettini arrivano uno sopra l'altro.

## Cosa succede fisicamente

Il Nano usa i pin **D0 (RX)** e **D1 (TX)** del chip ATmega328p come canale UART per mandare dati digitali al computer via USB. I dati viaggiano come una sequenza di bit (0 e 1) alla velocità impostata con `Serial.begin()` — di solito **9600 baud** (9600 bit al secondo).

```
Nano ATmega328p
     │ TX (D1) ──▶ chip USB-Serial ──▶ cavo USB ──▶ Serial Monitor sul PC
     │ RX (D0) ◀── chip USB-Serial ◀── cavo USB ◀── tastiera nel monitor
```

**Attenzione:** D0 e D1 sono usati anche da `Serial`. Se collegate qualcosa su quei pin mentre caricate il codice, il caricamento fallisce con errore.

### Sintassi Arduino — le varianti principali

```cpp
Serial.begin(9600);              // setup() — OBBLIGATORIO prima di qualunque print

Serial.print("Ciao");            // stampa senza andare a capo
Serial.println("Ciao");          // stampa E va a capo (new line)

Serial.print(valore);            // stampa un int/float/char
Serial.println(valore);          // stampa E va a capo

Serial.print(3.14);              // float con 2 decimali di default → "3.14"
Serial.print(3.14, 4);           // float con 4 decimali → "3.1400"

Serial.print(255, DEC);          // intero in decimale → "255"
Serial.print(255, HEX);          // intero in esadecimale → "FF"
Serial.print(255, BIN);          // intero in binario → "11111111"
Serial.print(255, OCT);          // intero in ottale → "377"
```

### Differenza tra `print` e `println`

| Funzione             | Newline finale | Uso tipico                                   |
|----------------------|:--------------:|----------------------------------------------|
| `Serial.print()`     | No             | Stampare più valori sulla stessa riga        |
| `Serial.println()`   | Sì (\\r\\n)   | Stampare una riga completa e andare a capo   |

Esempio: più valori sulla stessa riga

```cpp
Serial.print("Sensore A0: ");
Serial.print(analogRead(A0));
Serial.print(" | Temp: ");
Serial.println(temperatura);    // solo l'ultima con println
// → Sensore A0: 512 | Temp: 24.50
```

### Velocità (baud rate) — regola fondamentale

```cpp
Serial.begin(9600);    // codice e Serial Monitor devono usare lo stesso valore
```

| Baud rate | Uso consigliato                                       |
|-----------|-------------------------------------------------------|
| 9600      | Standard per principianti, stabile su tutti i cavi    |
| 115200    | Debug rapido, dati frequenti (es. sensori veloci)     |

Se il baud rate nel codice e nel Serial Monitor non coincidono, vedrete simboli strani o nulla. Non è un bug nel circuito — è un disallineamento di velocità.

## Esperimenti correlati

- Vol. 3 pag. 75 — Prima stampa sul Serial Monitor: `Serial.println("Ciao mondo!")` nel `loop()` con `Serial.begin(9600)` nel `setup()`
- Vol. 3 pag. 77 — `analogRead()` + `Serial.println(val)` per vedere i numeri del potenziometro scorrere in tempo reale
- Vol. 3 pag. 63 — Stampa variabili `int` e stato del pulsante (`HIGH`/`LOW`) per debuggare `digitalRead()`
- Vedi anche: [concepts/serial-monitor.md](serial-monitor.md), [concepts/comunicazione-seriale-uart.md](comunicazione-seriale-uart.md), [concepts/analog-read.md](analog-read.md), [concepts/variabili-arduino.md](variabili-arduino.md)

## Errori comuni

1. **Dimenticare `Serial.begin()` in `setup()`**: chiamare `Serial.print()` senza aver chiamato `Serial.begin()` non produce nessun output nel monitor — non si vede nulla. Il Nano non segnala errori, tace e basta. Aggiungete sempre `Serial.begin(9600)` come prima riga di `setup()`.

2. **Baud rate diverso tra codice e Serial Monitor**: se il codice usa `Serial.begin(115200)` ma il monitor è aperto a 9600, arrivano caratteri incomprensibili (es. `⸮⸮⸮⸮`). Soluzione: controllare il menu a tendina in basso a destra nel Serial Monitor e impostare la stessa velocità del codice.

3. **Confondere `print` con `println` — output tutto su una riga**: usare solo `Serial.print()` fa sì che tutti i valori si accumulino sulla stessa riga senza separazione, rendendo i dati illeggibili. Usare `Serial.println()` alla fine di ogni "record" completo per andare a capo correttamente.

4. **Collegare componenti su D0 o D1 mentre si usa Serial**: D0 (RX) e D1 (TX) sono i pin UART condivisi con `Serial`. Un componente su quei pin blocca il caricamento del codice e disturba la comunicazione seriale. Usate pin D2–D13 per i componenti nei kit ELAB.

5. **Stampare troppo velocemente — monitor che scorre inarrestabile**: mettere `Serial.println()` nel `loop()` senza `delay()` produce migliaia di righe al secondo. Il monitor scorre così veloce da essere illeggibile. Aggiungete sempre `delay(500)` o usate `millis()` per stampare a intervalli ragionevoli (es. ogni 500 ms).

## Domande tipiche degli studenti

**"Qual è la differenza tra `print` e `println`? Sembrano uguali."**
La differenza è il carattere finale: `println` aggiunge un "a capo" (newline) dopo il testo, `print` no. È come la differenza tra finire una riga con Invio o no. Se usate solo `print`, tutto finisce sulla stessa riga e diventa impossibile da leggere. Nelle prime sessioni, usate sempre `println` a meno che non stiate costruendo una riga con più pezzi.

**"Posso stampare parole e numeri insieme?"**
Sì, ma non in una sola `print`. Dovete usare due istruzioni separate: prima `Serial.print("Valore: ")` per la parte di testo, poi `Serial.println(valore)` per il numero. In futuro impareremo a usare le `String` per unirle, ma per ora due righe separate funzionano perfettamente.

**"Il Serial Monitor rallenta il programma?"**
Un po', sì. Ogni `Serial.print()` impiega del tempo per inviare i dati (dipende dalla velocità baud e dalla lunghezza del testo). A 9600 baud, una riga corta richiede circa 1–2 ms. Per la maggior parte degli esperimenti ELAB questo non è un problema. Se avete un programma che deve reagire in meno di 1 ms (es. lettura rapida di sensori), riducete o eliminate i print nel loop finale.

**"Cosa succede se chiudo il Serial Monitor? Il Nano smette di funzionare?"**
No. Il Nano continua a girare esattamente come prima — le istruzioni `Serial.print()` vengono eseguite ugualmente, solo che i dati vanno nel vuoto perché nessuno li ascolta. Il monitor è uno strumento di osservazione, non un requisito per il funzionamento del programma.

## PRINCIPIO ZERO

**Safety — D0/D1 riservati a Serial:** I pin D0 e D1 del Nano sono fisicamente collegati al chip USB-Serial sulla scheda. Se collegate un LED, un filo o un sensore su D0 o D1 mentre usate `Serial`, il caricamento del codice potrebbe fallire e i dati del monitor saranno corrotti. Nei kit ELAB tutti gli esperimenti usano pin D2–D13 e A0–A5 per i componenti: i ragazzi non rischiano danni, ma l'esperimento non funzionerà se sbagliano pin. Verificate sempre lo schema del Volume prima di collegare.

**Safety — nessun pericolo elettrico:** `Serial.print()` è una funzione software — non modifica tensioni né correnti nel circuito fisico. Usarla o non usarla non crea rischi per il Nano o per i ragazzi.

**Narrativa per la classe:** `Serial.print()` è il primo strumento di debug che i ragazzi imparano — e probabilmente quello che useranno di più in tutta la loro carriera con Arduino. Vol. 3 pag. 75 la introduce subito dopo il primo sketch Blink per un motivo preciso: senza un modo di "vedere dentro" il Nano, ogni problema di codice diventa un mistero impossibile. Mostrare la riga `Serial.println("Ciao")` che produce output reale sul monitor è un momento di sorpresa autentica — il Nano "parla". Da quel momento, i ragazzi usano `print` per capire cosa succede dentro ogni programma che scrivono.

**Cosa dire ai ragazzi:**
- "Il libro a pagina 75 ci mostra come far parlare il Nano — trovate la pagina e leggete insieme la prima riga di codice"
- "Vediamo cosa scrive il Nano mentre il programma gira: apriamo il Serial Monitor e osserviamo"
- "Ogni volta che non capite cosa sta facendo il codice, aggiungete una `Serial.println()` — il Nano vi dirà esattamente cosa ha calcolato in quel momento"
- "Ruotate il potenziometro e guardate i numeri scorrere: quei numeri sono esattamente quello che il Nano sta leggendo in tempo reale"
- "Se il monitor mostra simboli strani, guardate in basso a destra: il numero lì deve essere uguale a quello nel `Serial.begin()` del codice"

**Progressione didattica consigliata:**
1. `Serial.begin(9600)` + `Serial.println("Ciao mondo!")` nel `loop()` — primo messaggio fisso sul monitor (Vol. 3 pag. 75)
2. `Serial.println(valore)` con `int` — stampare un numero che cambia (variabile contatore con `delay(500)`)
3. `Serial.print("Etichetta: ")` + `Serial.println(valore)` — righe con testo e numero combinati
4. `Serial.println(analogRead(A0))` — vedere in tempo reale la lettura del potenziometro (pag. 77)
5. `Serial.print(val, HEX)` e `Serial.print(val, BIN)` — stessa informazione in formati diversi (avanzato)

## Link L1 (raw)

Query RAG che attivano questo concetto in `src/data/rag-chunks.json`:
- `"Serial.print Serial.println"` — funzioni di stampa Arduino
- `"Serial.begin baud rate"` — configurazione UART in setup()
- `"serial monitor walkie-talkie"` — analogia (analogy-21)
- `"Serial.println debuggare Arduino"` — tip-12, Vol.3 cap.5 debug
- `"comunicazione seriale Serial.print"` — tip-15, Vol.3 cap.8 output avanzato
- `"Serial Monitor come usare"` — safety-14, istruzioni uso pratico
- `"analogRead Serial println"` — code-11, lettura A0 + stampa ogni 500ms
