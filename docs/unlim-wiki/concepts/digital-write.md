---
id: digital-write
type: concept
title: "digitalWrite() — Accendere e spegnere un pin digitale"
locale: it
volume_ref: 3
pagina_ref: 47
created_at: 2026-04-26
updated_at: 2026-04-26
updated_by: scribe
tags: [digitalwrite, pin-digitali, output, high, low, blink, led, pinmode, arduino, atm328p]
---

## Definizione

`digitalWrite(pin, valore)` è la funzione Arduino che imposta un pin digitale a **5V (HIGH)** oppure a **0V (LOW)**. Vol. 3 pag. 47 la introduce per la prima volta nel programma Blink: "il Nano manda corrente al LED tramite il pin scelto". Vol. 3 pag. 56 la usa sul circuito esterno con LED e resistenza 470 Ω.

## Analogia per la classe

Ragazzi, immaginate che ogni pin digitale del Nano sia un interruttore della luce nella vostra cameretta. `digitalWrite(13, HIGH)` è come alzare l'interruttore — la corrente scorre e il LED si accende. `digitalWrite(13, LOW)` è come abbassarlo — la corrente si ferma e il LED si spegne. Il vostro programma controlla quegli interruttori così velocemente che può farli lampeggiare decine di volte al secondo.

## Cosa succede fisicamente

Quando scrivete `digitalWrite(pin, HIGH)`, l'ATmega328p porta quel pin a **5V** rispetto a GND. Quando scrivete `LOW`, lo porta a **0V**. La corrente scorre (o si ferma) nel circuito collegato al pin.

### Sintassi Arduino

```cpp
// Prima di tutto: dichiara il pin come uscita
pinMode(13, OUTPUT);

// Poi usa digitalWrite
digitalWrite(13, HIGH);   // 5V → LED acceso
delay(500);
digitalWrite(13, LOW);    // 0V → LED spento
delay(500);
```

**Regola fondamentale:** `digitalWrite()` funziona SOLO se prima avete chiamato `pinMode(pin, OUTPUT)`. Senza `pinMode`, il pin rimane in modalità INPUT e il LED non si accende.

### Tabella HIGH / LOW

| Comando                    | Tensione sul pin | LED  |
|----------------------------|------------------|------|
| `digitalWrite(pin, HIGH)`  | 5 V              | Acceso |
| `digitalWrite(pin, LOW)`   | 0 V              | Spento |

### Corrente massima per pin

| Limite          | Valore       | Conseguenza se superato          |
|-----------------|-------------|----------------------------------|
| Raccomandato    | 20 mA       | Funzionamento normale            |
| Massimo assoluto | 40 mA      | Possibile danno permanente al pin |
| Totale scheda   | 200 mA      | Danni all'intera Arduino Nano    |

**Per questo nei kit ELAB usiamo sempre una resistenza in serie al LED** (di solito 470 Ω). La resistenza limita la corrente e protegge sia il LED sia il Nano.

### Calcolo corrente con LED e resistenza

Con resistenza 470 Ω e LED rosso (caduta ≈ 2V):

```
I = (5V − 2V) / 470Ω ≈ 6.4 mA   ← sicuro, ben sotto i 20 mA
```

### Pin utilizzabili su Arduino Nano

| Gruppo  | Pin         | Note                                    |
|---------|------------|------------------------------------------|
| PORTD   | D0 – D7    | D0 e D1 condivisi con UART (Serial)     |
| PORTB   | D8 – D13   | D13 = LED integrato sulla scheda Nano   |
| PORTC   | A0 – A5    | Usabili come digitali con `digitalWrite` se configurati OUTPUT |

**Consiglio pratico:** nei primi esperimenti usate D13 (LED integrato), poi D8 o D9 per LED esterni — così evitate conflitti con la comunicazione seriale su D0/D1.

### Esempio sirena (due LED alternati — Vol. 3 pag. 58)

```cpp
void setup() {
  pinMode(8, OUTPUT);
  pinMode(9, OUTPUT);
}

void loop() {
  digitalWrite(8, HIGH);
  digitalWrite(9, LOW);
  delay(200);
  digitalWrite(8, LOW);
  digitalWrite(9, HIGH);
  delay(200);
}
```

### Esempio semaforo (tre LED — Vol. 3 pag. 58)

```cpp
void setup() {
  pinMode(5, OUTPUT);  // verde
  pinMode(6, OUTPUT);  // giallo
  pinMode(7, OUTPUT);  // rosso
}

void loop() {
  digitalWrite(5, HIGH); delay(3000);  // verde 3s
  digitalWrite(5, LOW);
  digitalWrite(6, HIGH); delay(1000);  // giallo 1s
  digitalWrite(6, LOW);
  digitalWrite(7, HIGH); delay(3000);  // rosso 3s
  digitalWrite(7, LOW);
}
```

## Esperimenti correlati

- Vol. 3 pag. 47 — Blink: primo sketch con LED integrato (`v3-cap5-esp1`)
- Vol. 3 pag. 56 — LED esterno su breadboard, resistenza 470 Ω (`v3-cap6-esp1`)
- Vol. 3 pag. 57 — Cambio pin da D13 a D8 (`v3-cap6-esp2`) — "Qualsiasi pin digitale può essere OUTPUT"
- Vol. 3 pag. 57 — SOS in codice Morse (`v3-cap6-morse`)
- Vol. 3 pag. 58 — Sirena con due LED alternati (`v3-cap6-esp4`)
- Vol. 3 pag. 58 — Semaforo a tre colori (`v3-cap6-semaforo`)
- Vedi anche: [concepts/pin-digitali.md](pin-digitali.md), [concepts/blink.md](blink.md), [concepts/delay-millis.md](delay-millis.md), [concepts/led.md](led.md)

## Errori comuni

1. **Dimenticare `pinMode(pin, OUTPUT)`**: senza questa riga il pin resta in modalità INPUT ad alta impedenza. Il LED sembra spento o lampeggia debolmente e in modo imprevedibile. Verificare che `pinMode` sia presente in `setup()`.

2. **Confondere `HIGH`/`LOW` con `1`/`0`**: `HIGH` e `LOW` sono costanti di Arduino che valgono rispettivamente `1` e `0`, ma usare i numeri diretti è meno leggibile e porta a errori quando si lavora con logica invertita. Usate sempre le costanti simboliche `HIGH` e `LOW`.

3. **LED collegato senza resistenza**: il LED assorbe tutta la corrente disponibile dal pin (fino a bruciarlo). La corrente senza resistenza su 5V può superare i 40 mA e danneggiare permanentemente il pin. Usare **sempre** almeno 220 Ω, preferibilmente 470 Ω per LED rossi/verdi/gialli.

4. **LED montato al contrario**: il LED ha una polarità — il catodo (gamba corta, lato piatto) va verso GND, l'anodo (gamba lunga) verso il pin. Montato al contrario non si accende e non si brucia, ma fa preoccupare. Basta girarlo.

5. **Usare `digitalWrite()` su pin PWM per dimmerare**: `digitalWrite` può solo accendere o spegnere (HIGH/LOW). Per regolare l'intensità del LED usate `analogWrite()` sui pin PWM (3, 5, 6, 9, 10, 11). `digitalWrite(pin, 128)` non funziona come ci si aspetta — vale come HIGH.

## Domande tipiche degli studenti

**"Perché devo scrivere `pinMode` prima? Il Nano non capisce da solo che voglio accendere il LED?"**
Il Nano non sa in anticipo se volete usare il pin per leggere (INPUT) o per scrivere (OUTPUT) — la stessa fisica funziona in entrambi i sensi. `pinMode` è il modo in cui gli dite cosa volete fare: senza quella riga, il pin resta in ascolto e non manda corrente.

**"Posso usare qualsiasi pin per il LED?"**
Quasi tutti i pin digitali D2–D13 vanno bene. Evitate D0 e D1 se usate `Serial.print()` (condivisi con la comunicazione USB), e usate D13 solo sapendo che ha già il LED integrato collegato. Per i primi esperimenti D8 e D9 sono i più comodi.

**"Se metto `HIGH` e non metto `LOW`, il LED rimane sempre acceso?"**
Sì, esattamente. Senza un `LOW` successivo il pin rimane a 5V finché non staccate l'alimentazione o caricate un nuovo sketch. Il Nano "ricorda" l'ultimo stato impostato.

**"Perché nel codice Morse usiamo `delay(150)` per il punto e `delay(400)` per la linea?"**
Il codice Morse ha una regola: la linea dura tre volte il punto. 150 ms × 3 = 450 ms, vicino a 400 ms. Il Libro a pag. 57 usa quei valori per rendere il segnale riconoscibile a occhio nudo — più lenti e lo vedete meglio, più veloci e si confondono.

## PRINCIPIO ZERO

**Safety — corrente massima 40 mA:** Un pin di Arduino Nano regge al massimo 40 mA in modo assoluto, 20 mA in uso normale. Collegare un LED senza resistenza può superare questo limite e bruciare il pin in modo permanente. Il kit ELAB include resistenze da 470 Ω proprio per questo: **non collegare mai un LED direttamente tra pin e GND senza resistenza in serie**.

**Safety — tensioni esterne:** `digitalWrite()` gestisce solo la tensione interna del Nano (5V). Non collegare mai al pin carichi che lavorano a tensioni più alte (motori a 12V, rele a 220V) senza un driver intermedio (transistor, MOSFET o modulo relè). Il libro usa sempre componenti sicuri a 5V — seguire sempre gli schemi del volume.

**Narrativa per la classe:** `digitalWrite()` è il momento in cui i ragazzi smettono di essere spettatori e diventano costruttori: scrivono una riga di codice e qualcosa nel mondo fisico si accende. Vol. 3 pag. 56 descrive il primo LED esterno come "esattamente quello che faceva il LED integrato, ma adesso sei TU a posizionarlo e collegarlo!". Quel salto — dal codice alla realtà — è il cuore didattico dell'intero Volume 3. Fare lampeggiare il LED integrato (D13) e subito dopo spostare il filo su D8 dimostra che qualsiasi pin funziona: nessuna magia, solo fisica e codice.

**Cosa dire ai ragazzi:**
- "Vediamo cosa succede quando il Nano manda corrente al pin — trovate la pagina 56 del libro"
- "Il libro dice: *il LED esterno fa esattamente quello che faceva il LED integrato, ma adesso sei TU a posizionarlo* — è vero: provate a spostare il filo da D13 a D8 e cambiate anche il numero nel codice"
- "HIGH significa 5 volt, LOW significa 0 volt — è come un interruttore che il programma comanda"
- "Senza resistenza il LED potrebbe bruciarsi — per questo il kit include sempre la resistenza da 470 Ω"

**Progressione didattica consigliata:**
1. LED integrato D13 → sketch Blink da Vol. 3 pag. 47 (nessun componente aggiunto)
2. LED esterno su D13 con resistenza 470 Ω → breadboard per la prima volta (pag. 56)
3. Cambiare il pin da D13 a D8 nel codice e sulla breadboard → generalizzazione (pag. 57)
4. Codice Morse SOS → creatività con i delay (pag. 57)
5. Due LED alternati → controllo di più pin contemporaneamente (pag. 58)
6. Semaforo a tre colori → sequenza temporizzata, lettura del libro come copione (pag. 58)

## Link L1 (raw)

Query RAG che attivano questo concetto in `src/data/rag-chunks.json`:
- `"digitalWrite"` — codice e spiegazione funzione
- `"pinMode OUTPUT"` — pre-requisito obbligatorio
- `"HIGH LOW arduino pin"` — tabella stati e tensioni
- `"LED esterno resistenza 470 breadboard"` — Vol. 3 pag. 56 bookText
- `"Blink primo programma arduino"` — Vol. 3 pag. 47 bookText
- `"semaforo led digitale"` — Vol. 3 pag. 58 bookText
- `"sirena due LED alternati"` — Vol. 3 pag. 58 bookText
