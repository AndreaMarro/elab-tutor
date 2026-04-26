---
id: analog-read
type: concept
title: "analogRead() — Lettura analogica ADC"
locale: it
volume_ref: 3
pagina_ref: 77
created_at: 2026-04-26
updated_at: 2026-04-26
updated_by: scribe
tags: [analogread, adc, sensori, pin-analogici, potenziometro, fotoresistore, map, 10-bit]
---

## Definizione

`analogRead(pin)` è la funzione Arduino che legge la tensione su un pin analogico (A0–A5) e la converte in un numero intero da 0 a 1023 tramite il convertitore analogico-digitale (ADC) a 10 bit dell'ATmega328p. Vol. 3 pag. 77 la introduce come "il modo del Nano per ascoltare il mondo reale".

## Analogia per la classe

Ragazzi, immaginate un righello speciale con 1024 tacche. Quando il Nano appoggia il dito su un filo, guarda dove si trova la tensione su questo righello: 0 tacche = 0V (silenzio totale), 1023 tacche = 5V (volume al massimo). La funzione `analogRead()` è il Nano che legge la tacca e vi dice il numero.

## Cosa succede fisicamente

Il pin A0–A5 misura la tensione rispetto a GND. L'ADC divide il range 0–5V in **2¹⁰ = 1024 gradini** uguali.

Valore di ogni gradino:
```
V_step = 5V / 1024 ≈ 4.88 mV
```

**Tabella di conversione rapida:**

| Tensione sul pin | Valore `analogRead()` |
|------------------|-----------------------|
| 0 V              | 0                     |
| 1.25 V           | 256                   |
| 2.5 V            | 512                   |
| 3.75 V           | 768                   |
| 5 V              | 1023                  |

### Sintassi Arduino

```cpp
int valore = analogRead(A0);              // 0–1023
```

Conversione in tensione reale:
```cpp
float volt = valore * (5.0 / 1023.0);    // da 0–1023 a 0.0–5.0V
```

Mappatura su scala personalizzata con `map()`:
```cpp
int percentuale = map(valore, 0, 1023, 0, 100);  // 0–100%
int gradi      = map(valore, 0, 1023, 0, 180);   // 0–180° (utile per servo)
```

### Pin usabili su Arduino Nano

| Pin  | Canale ADC | Note                          |
|------|-----------|-------------------------------|
| A0   | ADC0      | Uso più comune                |
| A1   | ADC1      |                               |
| A2   | ADC2      |                               |
| A3   | ADC3      |                               |
| A4   | ADC4      | Condiviso con I2C SDA         |
| A5   | ADC5      | Condiviso con I2C SCL         |

## Esperimenti correlati

- Vol. 3 pag. 77 — Prima lettura potenziometro → Serial Monitor (valore grezzo)
- Vol. 1 pag. 81 — Fotoresistore in partitore → `analogRead()` per rilevare luce
- Vol. 2 pag. 45 — Divisore di tensione con LDR + `map()` per regolare luminosità LED
- Vedi anche: [concepts/pin-analogici.md](pin-analogici.md), [concepts/potenziometro.md](potenziometro.md), [concepts/fotoresistore.md](fotoresistore.md), [concepts/divisore-tensione.md](divisore-tensione.md)

## Errori comuni

1. **Leggere un pin D con `analogRead()`**: `analogRead(13)` non funziona come ci si aspetta — i pin D0–D13 sono digitali. Per i pin analogici usare sempre A0–A5.
2. **Confondere 0–1023 con 0–255**: `analogRead()` restituisce 0–1023 (ADC 10-bit); `analogWrite()` accetta 0–255 (PWM 8-bit). Mescolare le due scale dà risultati errati.
3. **LDR senza resistenza in serie**: un fotoresistore collegato direttamente tra 5V e A0 non varia la tensione. Serve un partitore con 10 kΩ in serie (vedi [divisore-tensione.md](divisore-tensione.md)).
4. **Pin non collegato (floating)**: un pin A0 senza sensore legge valori casuali 0–1023. Non è un guasto — il pin raccoglie interferenze dall'aria. Aggiungere una resistenza di pull-down (10 kΩ verso GND) per stabilizzarlo.
5. **Tensione > 5V sul pin analogico**: superare i 5V sull'ingresso ADC può danneggiare l'ATmega328p in modo permanente. Se il sensore lavora a tensioni diverse (3.3V, 12V), usare un divisore di tensione o un modulo adattatore.

## Domande tipiche degli studenti

**"Perché il massimo è 1023 e non 1024?"**
Perché 10 bit danno 1024 valori distinti (da 0 a 1023, con lo zero incluso). È come contare da 0 a 99: sono 100 numeri in totale, non 101.

**"Cosa succede se non collego niente al pin?"**
Il pin *fluttua*: capta le interferenze elettriche nell'aria e restituisce numeri a caso. Il Nano non sa distinguere "nulla collegato" da "segnale debolissimo" — servono i fili per dargli un riferimento fisso.

**"Posso leggere tensioni negative o sopra 5V?"**
No. L'ADC dell'ATmega328p legge solo 0–5V. Sotto 0V legge sempre 0. Sopra 5V si rischia di bruciare il chip in modo permanente.

**"Quando uso `map()` e quando moltiplico a mano?"**
`map()` è più leggibile e gestisce i bordi correttamente. Moltiplicare a mano funziona ma è più facile sbagliare il calcolo o perdere precisione. Nelle prime sessioni, usate sempre `map()` — capiremo perché funziona dopo.

## PRINCIPIO ZERO

**Safety — tensione massima 5V:** I pin A0–A5 reggono al massimo 5V. Sensori che producono tensioni più alte (es. 12V, 220V rete) **non si collegano mai direttamente** al Nano — serve un divisore di tensione o un modulo apposito. Il kit ELAB usa sempre sorgenti sicure (batteria 9V regolata a 5V tramite il Nano).

**Narrativa per la classe:** Dopo il "Hello World" con il LED lampeggiante, `analogRead()` è il passo in cui il Nano smette di essere binario (acceso/spento) e inizia a *sentire* le gradazioni del mondo reale — come passare da un interruttore a una manopola del volume. Mostrare i numeri scorrere sul Serial Monitor mentre i ragazzi ruotano il potenziometro crea la connessione immediata tra gesto fisico e numero digitale: il Nano *sta leggendo* le loro mani.

**Cosa dire ai ragazzi:**
- "Vediamo insieme come il Nano legge il mondo reale — non più solo 0 e 1, ma tutti i valori in mezzo"
- "Ruotate il potenziometro e guardate i numeri scorrere: da 0 a 1023 in entrambe le direzioni"
- "Il libro a pag. 77 ci spiega che questo numero corrisponde a quanta tensione arriva al pin"
- "Con `map()` portiamo quel numero a qualcosa che conosciamo già: percentuale, gradi, velocità"

**Progressione didattica consigliata:**
1. `analogRead()` su potenziometro → Serial Monitor (valore grezzo 0–1023)
2. Conversione con `map()` → percentuale 0–100% stampata su monitor
3. Fotoresistore con partitore → lettura luce ambientale
4. Controllo intensità LED con `analogWrite()` in base al valore di `analogRead()`
5. Due sensori analogici → decisioni con `if` in base ai valori letti

## Link L1 (raw)

Query RAG che attivano questo concetto in `src/data/rag-chunks.json`:
- `"analogRead"` — codice e spiegazione funzione
- `"ADC convertitore analogico digitale"` — teoria 10-bit
- `"potenziometro analogRead"` — Vol. 3 pag. 77 bookText
- `"fotoresistore pin analogico"` — Vol. 1 pag. 81 bookText
- `"map() arduino range"` — funzione helper per mappatura scale
