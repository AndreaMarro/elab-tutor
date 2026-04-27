---
id: arduino-port
type: concept
title: "PORT register Arduino — manipolazione diretta dei pin"
locale: it
volume_ref: 3
pagina_ref: 130
created_at: 2026-04-26
updated_at: 2026-04-26
updated_by: scribe
tags: [port, register, atmega328, low-level, prestazioni, avanzato, vol3, capstone]
---

## Definizione

I **PORT register** sono celle di memoria del microcontrollore ATmega328P che controllano direttamente lo stato HIGH/LOW dei pin digitali. Vol. 3 pag. 130 li introduce nel capitolo avanzato come "il modo veloce di accendere e spegnere i pin, saltando il livello di Arduino".

ATmega328P ha **3 PORT**:
- **PORTB**: pin digitali 8-13
- **PORTC**: pin analogici A0-A5 (usabili anche come digitali)
- **PORTD**: pin digitali 0-7

Ogni PORT ha 3 register associati:
| Register | Funzione |
|----------|----------|
| `DDRx`  | Data Direction — 0=INPUT, 1=OUTPUT |
| `PORTx` | Output value — 0=LOW, 1=HIGH (o 1=enable pull-up se INPUT) |
| `PINx`  | Input read — bit corrispondente al pin |

`x` = B, C, o D.

## Esempio: blink con PORT

```cpp
// Equivalente di pinMode(13, OUTPUT) + digitalWrite(13, HIGH/LOW)
void setup() {
  DDRB |= (1 << 5);   // PB5 = pin 13 → OUTPUT
}

void loop() {
  PORTB |= (1 << 5);  // PB5 HIGH
  delay(500);
  PORTB &= ~(1 << 5); // PB5 LOW
  delay(500);
}
```

Codice equivalente con API Arduino:
```cpp
void setup() {
  pinMode(13, OUTPUT);
}
void loop() {
  digitalWrite(13, HIGH);
  delay(500);
  digitalWrite(13, LOW);
  delay(500);
}
```

## Perché usare PORT direttamente

| Operazione | Tempo `digitalWrite` | Tempo PORT diretto |
|------------|---------------------|---------------------|
| 1 toggle | ~5 µs | ~125 ns |
| 1000 toggle | ~5 ms | ~125 µs |
| Speedup | — | **~40× più veloce** |

`digitalWrite` fa molto lavoro:
1. Cerca il pin nella tabella di mapping
2. Verifica se PWM è attivo, lo disabilita se sì
3. Calcola il bit corretto
4. Scrive sul PORT register

PORT diretto salta tutto: scrive UN bit in UN register.

**Vol. 3 pag. 130** menziona il caso d'uso: progetti capstone che richiedono switching ad alta frequenza (es. multiplex matrice LED, generatori d'onda, comunicazione bit-bang).

## Mappa pin → bit (ATmega328P / Arduino Nano)

| Arduino Pin | PORT.bit |
|-------------|----------|
| 0 | PD.0 |
| 1 | PD.1 |
| 2 | PD.2 |
| ... | ... |
| 7 | PD.7 |
| 8 | PB.0 |
| 9 | PB.1 |
| 10 | PB.2 |
| 11 | PB.3 |
| 12 | PB.4 |
| 13 | PB.5 |
| A0 | PC.0 |
| ... | ... |
| A5 | PC.5 |

Vol. 3 pag. 130 fornisce poster stampabile della mappa per consultazione veloce in classe.

## Operazioni bit-wise essenziali

```cpp
// Set bit n di reg → reg.n = 1
reg |= (1 << n);

// Clear bit n di reg → reg.n = 0
reg &= ~(1 << n);

// Toggle bit n di reg
reg ^= (1 << n);

// Read bit n di reg → 0 o 1
int val = (reg >> n) & 1;
```

## Errori comuni

1. **Manipolare bit del PORT senza configurare DDR** — Senza `DDRB |= (1<<5)`, il pin resta INPUT. Scrivere su PORTB non accende niente, attiva solo la pull-up interna.

2. **Confondere PORT con PIN** — Per **leggere** uno stato di input, usare `PINB & (1<<n)`, NON `PORTB`. Su INPUT, PORTB controlla pull-up; PINB legge.

3. **Bit-shift errato** — `1 << 13` per "pin 13" è SBAGLIATO. Pin 13 è PB.5, quindi `1 << 5`. Sempre consultare la mappa pin→PORT.bit prima di scrivere.

4. **Disabilitare interrupts mid-write** — Se un'interrupt scrive lo stesso PORT mentre il loop manipola un bit, può sovrascriversi. Per critiche atomiche:
```cpp
noInterrupts();
PORTB |= (1 << 5);
interrupts();
```

5. **Rompere funzioni Arduino dipendenti da PORT** — Se manipolate PORTD direttamente, occhio: pin 0-1 sono usati da Serial (USART). Scrivere lì rompe la comunicazione USB → debug impossibile.

## Esperimenti correlati

- **Vol. 3 pag. 130** — Introduzione PORT con confronto digitalWrite vs PORT
- **Vol. 3 pag. 135** — Multiplex 4-cifre 7-segmenti a 60 Hz (richiede speedup PORT)
- **Vol. 3 pag. 140** — Onda quadra 100 kHz su pin 8 (impossibile con digitalWrite)
- **Vol. 3 pag. 145** — Capstone: matrice LED 8×8 con scrolling testo (PORT + timer)

## PRINCIPIO ZERO

**Cosa dire ai ragazzi** (citazione Vol. 3 pag. 130):
> "I PORT register sono il modo veloce di accendere e spegnere i pin, saltando il livello di Arduino. Sono per chi vuole capire COME funziona dentro."

**Cosa fare:**
- Argomento **avanzato Vol. 3** — adatto a ragazzi che hanno già padroneggiato `digitalWrite` e curiosi di prestazioni
- Mostrate sull'oscilloscopio (se disponibile) la differenza: digitalWrite + delayMicroseconds(1) vs PORTB |= ... + delayMicroseconds(1). La forma d'onda è chiaramente più "pulita" con PORT
- Vol. 3 pag. 130 raccomanda di NON insegnare PORT prima della terza media. Per le scuole elementari/prima media, restare su `digitalWrite` come API didattica
- Spiegate il trade-off: PORT è veloce ma confonde i principianti, riduce la portabilità tra board diverse, e bypassa le protezioni Arduino (es. PWM auto-disable)

**Sicurezza:**
- Manipolazione PORT può rompere comunicazione Serial (PD.0/PD.1) — debug Serial non funziona più
- Disabilitare interrupts a tempo lungo (>1 ms) può perdere eventi: timer overflow, Serial RX, etc.

**Cosa NON fare:**
- Non usate PORT register per progetti normali — `digitalWrite` è chiaro e leggibile
- Non mescolate digitalWrite + PORTB sullo stesso pin nello stesso programma — confusione manutentiva

## Link L1 (raw RAG queries)

- `"PORT register Arduino ATmega328"`
- `"digitalWrite vs PORT prestazioni"`
- `"DDRB PORTB PINB Arduino"`
- `"manipolazione bit pin Arduino"`
- `"speedup pin toggle PORT"`
