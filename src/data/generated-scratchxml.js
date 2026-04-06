/**
 * Generated Scratch/Blockly XML for Vol3 experiments
 * Maps experiment IDs to their Blockly XML workspace strings.
 * These are simplified Blockly representations of the Arduino C++ code.
 * Some C++ features (custom functions, float arithmetic, while-debounce)
 * are approximated with available Blockly blocks.
 *
 * Generated 2026-04-05
 */

export const GENERATED_SCRATCH_XML = {

  // ═══ Cap 5 Esp 1 — Blink LED_BUILTIN (pin 13, 1000ms) ═══
  'v3-cap5-esp1': `<xml xmlns="https://developers.google.com/blockly/xml">
<block type="arduino_base" x="40" y="30" deletable="false">
<statement name="SETUP">
<block type="arduino_pin_mode"><field name="PIN">13</field><field name="MODE">OUTPUT</field>
</block>
</statement>
<statement name="LOOP">
<block type="arduino_digital_write"><field name="PIN">13</field><field name="STATE">HIGH</field>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">1000</field></shadow></value>
<next><block type="arduino_digital_write"><field name="PIN">13</field><field name="STATE">LOW</field>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">1000</field></shadow></value>
</block></next></block></next></block></next></block>
</statement>
</block></xml>`,

  // ═══ Cap 5 Esp 2 — Blink veloce (pin 13, 200ms) ═══
  'v3-cap5-esp2': `<xml xmlns="https://developers.google.com/blockly/xml">
<block type="arduino_base" x="40" y="30" deletable="false">
<statement name="SETUP">
<block type="arduino_pin_mode"><field name="PIN">13</field><field name="MODE">OUTPUT</field>
</block>
</statement>
<statement name="LOOP">
<block type="arduino_digital_write"><field name="PIN">13</field><field name="STATE">HIGH</field>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">200</field></shadow></value>
<next><block type="arduino_digital_write"><field name="PIN">13</field><field name="STATE">LOW</field>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">200</field></shadow></value>
</block></next></block></next></block></next></block>
</statement>
</block></xml>`,

  // ═══ Cap 6 Esp 2 — LED esterno su pin 13 (same as Blink) ═══
  'v3-cap6-esp2': `<xml xmlns="https://developers.google.com/blockly/xml">
<block type="arduino_base" x="40" y="30" deletable="false">
<statement name="SETUP">
<block type="arduino_pin_mode"><field name="PIN">13</field><field name="MODE">OUTPUT</field>
</block>
</statement>
<statement name="LOOP">
<block type="arduino_digital_write"><field name="PIN">13</field><field name="STATE">HIGH</field>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">1000</field></shadow></value>
<next><block type="arduino_digital_write"><field name="PIN">13</field><field name="STATE">LOW</field>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">1000</field></shadow></value>
</block></next></block></next></block></next></block>
</statement>
</block></xml>`,

  // ═══ Cap 6 Morse — SOS (pin 13, simplified: 3 short + 3 long + 3 short) ═══
  // C++ uses custom functions punto()/linea() — Blockly version inlines the pattern
  'v3-cap6-morse': `<xml xmlns="https://developers.google.com/blockly/xml">
<block type="arduino_base" x="40" y="30" deletable="false">
<statement name="SETUP">
<block type="arduino_pin_mode"><field name="PIN">13</field><field name="MODE">OUTPUT</field>
</block>
</statement>
<statement name="LOOP">
<block type="arduino_digital_write"><field name="PIN">13</field><field name="STATE">HIGH</field>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">200</field></shadow></value>
<next><block type="arduino_digital_write"><field name="PIN">13</field><field name="STATE">LOW</field>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">200</field></shadow></value>
<next><block type="arduino_digital_write"><field name="PIN">13</field><field name="STATE">HIGH</field>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">200</field></shadow></value>
<next><block type="arduino_digital_write"><field name="PIN">13</field><field name="STATE">LOW</field>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">200</field></shadow></value>
<next><block type="arduino_digital_write"><field name="PIN">13</field><field name="STATE">HIGH</field>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">200</field></shadow></value>
<next><block type="arduino_digital_write"><field name="PIN">13</field><field name="STATE">LOW</field>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">400</field></shadow></value>
<next><block type="arduino_digital_write"><field name="PIN">13</field><field name="STATE">HIGH</field>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">600</field></shadow></value>
<next><block type="arduino_digital_write"><field name="PIN">13</field><field name="STATE">LOW</field>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">200</field></shadow></value>
<next><block type="arduino_digital_write"><field name="PIN">13</field><field name="STATE">HIGH</field>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">600</field></shadow></value>
<next><block type="arduino_digital_write"><field name="PIN">13</field><field name="STATE">LOW</field>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">200</field></shadow></value>
<next><block type="arduino_digital_write"><field name="PIN">13</field><field name="STATE">HIGH</field>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">600</field></shadow></value>
<next><block type="arduino_digital_write"><field name="PIN">13</field><field name="STATE">LOW</field>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">400</field></shadow></value>
<next><block type="arduino_digital_write"><field name="PIN">13</field><field name="STATE">HIGH</field>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">200</field></shadow></value>
<next><block type="arduino_digital_write"><field name="PIN">13</field><field name="STATE">LOW</field>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">200</field></shadow></value>
<next><block type="arduino_digital_write"><field name="PIN">13</field><field name="STATE">HIGH</field>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">200</field></shadow></value>
<next><block type="arduino_digital_write"><field name="PIN">13</field><field name="STATE">LOW</field>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">200</field></shadow></value>
<next><block type="arduino_digital_write"><field name="PIN">13</field><field name="STATE">HIGH</field>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">200</field></shadow></value>
<next><block type="arduino_digital_write"><field name="PIN">13</field><field name="STATE">LOW</field>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">1000</field></shadow></value>
</block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block>
</statement>
</block></xml>`,

  // ═══ Cap 6 Esp 3 — Cambia pin (pin 5 instead of 13) ═══
  'v3-cap6-esp3': `<xml xmlns="https://developers.google.com/blockly/xml">
<block type="arduino_base" x="40" y="30" deletable="false">
<statement name="SETUP">
<block type="arduino_pin_mode"><field name="PIN">5</field><field name="MODE">OUTPUT</field>
</block>
</statement>
<statement name="LOOP">
<block type="arduino_digital_write"><field name="PIN">5</field><field name="STATE">HIGH</field>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">1000</field></shadow></value>
<next><block type="arduino_digital_write"><field name="PIN">5</field><field name="STATE">LOW</field>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">1000</field></shadow></value>
</block></next></block></next></block></next></block>
</statement>
</block></xml>`,

  // ═══ Cap 6 Esp 4 — Semaforo 3 LED (pin 5 verde, 6 giallo, 9 rosso) ═══
  'v3-cap6-esp4': `<xml xmlns="https://developers.google.com/blockly/xml">
<block type="arduino_base" x="40" y="30" deletable="false">
<statement name="SETUP">
<block type="arduino_pin_mode"><field name="PIN">5</field><field name="MODE">OUTPUT</field>
<next><block type="arduino_pin_mode"><field name="PIN">6</field><field name="MODE">OUTPUT</field>
<next><block type="arduino_pin_mode"><field name="PIN">9</field><field name="MODE">OUTPUT</field>
</block></next></block></next></block>
</statement>
<statement name="LOOP">
<block type="arduino_digital_write"><field name="PIN">5</field><field name="STATE">HIGH</field>
<next><block type="arduino_digital_write"><field name="PIN">6</field><field name="STATE">LOW</field>
<next><block type="arduino_digital_write"><field name="PIN">9</field><field name="STATE">LOW</field>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">3000</field></shadow></value>
<next><block type="arduino_digital_write"><field name="PIN">5</field><field name="STATE">LOW</field>
<next><block type="arduino_digital_write"><field name="PIN">6</field><field name="STATE">HIGH</field>
<next><block type="arduino_digital_write"><field name="PIN">9</field><field name="STATE">LOW</field>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">1000</field></shadow></value>
<next><block type="arduino_digital_write"><field name="PIN">5</field><field name="STATE">LOW</field>
<next><block type="arduino_digital_write"><field name="PIN">6</field><field name="STATE">LOW</field>
<next><block type="arduino_digital_write"><field name="PIN">9</field><field name="STATE">HIGH</field>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">3000</field></shadow></value>
</block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block>
</statement>
</block></xml>`,

  // ═══ Cap 6 Esp 5 — INPUT_PULLUP toggle (pin 10 btn, pin 5 LED) ═══
  // C++ uses bool statoLED + toggle logic — Blockly simplified to if/else direct read
  'v3-cap6-esp5': `<xml xmlns="https://developers.google.com/blockly/xml">
<block type="arduino_base" x="40" y="30" deletable="false">
<statement name="SETUP">
<block type="arduino_pin_mode"><field name="PIN">10</field><field name="MODE">INPUT_PULLUP</field>
<next><block type="arduino_pin_mode"><field name="PIN">5</field><field name="MODE">OUTPUT</field>
</block></next></block>
</statement>
<statement name="LOOP">
<block type="controls_if">
<mutation else="1"/>
<value name="IF0">
<block type="logic_compare"><field name="OP">EQ</field>
<value name="A"><block type="arduino_digital_read"><field name="PIN">10</field></block></value>
<value name="B"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
</block>
</value>
<statement name="DO0">
<block type="arduino_digital_write"><field name="PIN">5</field><field name="STATE">HIGH</field>
</block>
</statement>
<statement name="ELSE">
<block type="arduino_digital_write"><field name="PIN">5</field><field name="STATE">LOW</field>
</block>
</statement>
</block>
</statement>
</block></xml>`,

  // ═══ Cap 6 Esp 7 — Debounce con while (pin 10 btn, pin 5 LED) ═══
  // C++ uses while(digitalRead==LOW){} — Blockly simplified to if + delay debounce
  'v3-cap6-esp7': `<xml xmlns="https://developers.google.com/blockly/xml">
<block type="arduino_base" x="40" y="30" deletable="false">
<statement name="SETUP">
<block type="arduino_pin_mode"><field name="PIN">10</field><field name="MODE">INPUT_PULLUP</field>
<next><block type="arduino_pin_mode"><field name="PIN">5</field><field name="MODE">OUTPUT</field>
</block></next></block>
</statement>
<statement name="LOOP">
<block type="controls_if">
<mutation else="1"/>
<value name="IF0">
<block type="logic_compare"><field name="OP">EQ</field>
<value name="A"><block type="arduino_digital_read"><field name="PIN">10</field></block></value>
<value name="B"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
</block>
</value>
<statement name="DO0">
// © Andrea Marro — 06/04/2026 — ELAB Tutor — Tutti i diritti riservati
<block type="arduino_digital_write"><field name="PIN">5</field><field name="STATE">HIGH</field>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">300</field></shadow></value>
</block></next></block>
</statement>
<statement name="ELSE">
<block type="arduino_digital_write"><field name="PIN">5</field><field name="STATE">LOW</field>
</block>
</statement>
</block>
</statement>
</block></xml>`,

  // ═══ Cap 7 Esp 1 — analogRead base (A0 trimmer, pin 13 LED, soglia 511) ═══
  'v3-cap7-esp1': `<xml xmlns="https://developers.google.com/blockly/xml">
<block type="arduino_base" x="40" y="30" deletable="false">
<statement name="SETUP">
<block type="arduino_pin_mode"><field name="PIN">13</field><field name="MODE">OUTPUT</field>
</block>
</statement>
<statement name="LOOP">
<block type="arduino_variable_set"><field name="TYPE">int</field><field name="VAR">valoreLetto</field>
<value name="VALUE"><block type="arduino_analog_read"><field name="PIN">A0</field></block></value>
<next><block type="controls_if">
<mutation else="1"/>
<value name="IF0">
<block type="logic_compare"><field name="OP">GT</field>
<value name="A"><block type="arduino_variable_get"><field name="VAR">valoreLetto</field></block></value>
<value name="B"><shadow type="math_number"><field name="NUM">511</field></shadow></value>
</block>
</value>
<statement name="DO0">
<block type="arduino_digital_write"><field name="PIN">13</field><field name="STATE">HIGH</field>
</block>
</statement>
<statement name="ELSE">
<block type="arduino_digital_write"><field name="PIN">13</field><field name="STATE">LOW</field>
</block>
</statement>
</block></next></block>
</statement>
</block></xml>`,

  // ═══ Cap 7 Esp 2 — analogRead con tensione (soglia 2.5V ~ 511) ═══
  // C++ uses float tensione = (val * 5.0)/1023 — Blockly simplified to same threshold logic
  'v3-cap7-esp2': `<xml xmlns="https://developers.google.com/blockly/xml">
<block type="arduino_base" x="40" y="30" deletable="false">
<statement name="SETUP">
<block type="arduino_pin_mode"><field name="PIN">13</field><field name="MODE">OUTPUT</field>
</block>
</statement>
<statement name="LOOP">
<block type="arduino_variable_set"><field name="TYPE">int</field><field name="VAR">valoreLetto</field>
<value name="VALUE"><block type="arduino_analog_read"><field name="PIN">A0</field></block></value>
<next><block type="controls_if">
<mutation else="1"/>
<value name="IF0">
<block type="logic_compare"><field name="OP">GT</field>
<value name="A"><block type="arduino_variable_get"><field name="VAR">valoreLetto</field></block></value>
<value name="B"><shadow type="math_number"><field name="NUM">511</field></shadow></value>
</block>
</value>
<statement name="DO0">
<block type="arduino_digital_write"><field name="PIN">13</field><field name="STATE">HIGH</field>
</block>
</statement>
<statement name="ELSE">
<block type="arduino_digital_write"><field name="PIN">13</field><field name="STATE">LOW</field>
</block>
</statement>
</block></next></block>
</statement>
</block></xml>`,

  // ═══ Cap 7 Esp 3 — Trimmer controlla 3 LED (A0, pin 3/5/6, intervalli) ═══
  'v3-cap7-esp3': `<xml xmlns="https://developers.google.com/blockly/xml">
<block type="arduino_base" x="40" y="30" deletable="false">
<statement name="SETUP">
<block type="arduino_pin_mode"><field name="PIN">3</field><field name="MODE">OUTPUT</field>
<next><block type="arduino_pin_mode"><field name="PIN">5</field><field name="MODE">OUTPUT</field>
<next><block type="arduino_pin_mode"><field name="PIN">6</field><field name="MODE">OUTPUT</field>
</block></next></block></next></block>
</statement>
<statement name="LOOP">
<block type="arduino_variable_set"><field name="TYPE">int</field><field name="VAR">valoreLetto</field>
<value name="VALUE"><block type="arduino_analog_read"><field name="PIN">A0</field></block></value>
<next><block type="controls_if">
<mutation elseif="1" else="1"/>
<value name="IF0">
<block type="logic_compare"><field name="OP">LT</field>
<value name="A"><block type="arduino_variable_get"><field name="VAR">valoreLetto</field></block></value>
<value name="B"><shadow type="math_number"><field name="NUM">341</field></shadow></value>
</block>
</value>
<statement name="DO0">
<block type="arduino_digital_write"><field name="PIN">3</field><field name="STATE">HIGH</field>
<next><block type="arduino_digital_write"><field name="PIN">5</field><field name="STATE">LOW</field>
<next><block type="arduino_digital_write"><field name="PIN">6</field><field name="STATE">LOW</field>
</block></next></block></next></block>
</statement>
<value name="IF1">
<block type="logic_compare"><field name="OP">LT</field>
<value name="A"><block type="arduino_variable_get"><field name="VAR">valoreLetto</field></block></value>
<value name="B"><shadow type="math_number"><field name="NUM">682</field></shadow></value>
</block>
</value>
<statement name="DO1">
<block type="arduino_digital_write"><field name="PIN">3</field><field name="STATE">LOW</field>
<next><block type="arduino_digital_write"><field name="PIN">5</field><field name="STATE">HIGH</field>
<next><block type="arduino_digital_write"><field name="PIN">6</field><field name="STATE">LOW</field>
</block></next></block></next></block>
</statement>
<statement name="ELSE">
<block type="arduino_digital_write"><field name="PIN">3</field><field name="STATE">LOW</field>
<next><block type="arduino_digital_write"><field name="PIN">5</field><field name="STATE">LOW</field>
<next><block type="arduino_digital_write"><field name="PIN">6</field><field name="STATE">HIGH</field>
</block></next></block></next></block>
</statement>
</block></next></block>
</statement>
</block></xml>`,

  // ═══ Cap 7 Esp 4 — PWM fade up (pin 5, for 0→255 step 5) ═══
  'v3-cap7-esp4': `<xml xmlns="https://developers.google.com/blockly/xml">
<block type="arduino_base" x="40" y="30" deletable="false">
<statement name="SETUP">
<block type="arduino_pin_mode"><field name="PIN">5</field><field name="MODE">OUTPUT</field>
</block>
</statement>
<statement name="LOOP">
<block type="controls_for">
<field name="VAR">i</field>
<value name="FROM"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
<value name="TO"><shadow type="math_number"><field name="NUM">255</field></shadow></value>
<value name="BY"><shadow type="math_number"><field name="NUM">5</field></shadow></value>
<statement name="DO">
<block type="arduino_analog_write"><field name="PIN">5</field>
<value name="VALUE"><block type="arduino_variable_get"><field name="VAR">i</field></block></value>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
</block></next></block>
</statement>
</block>
</statement>
</block></xml>`,

  // ═══ Cap 7 Esp 5 — PWM valori manuali (pin 5: 0, 64, 128, 255) ═══
  'v3-cap7-esp5': `<xml xmlns="https://developers.google.com/blockly/xml">
<block type="arduino_base" x="40" y="30" deletable="false">
<statement name="SETUP">
<block type="arduino_pin_mode"><field name="PIN">5</field><field name="MODE">OUTPUT</field>
</block>
</statement>
<statement name="LOOP">
<block type="arduino_analog_write"><field name="PIN">5</field>
<value name="VALUE"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">1000</field></shadow></value>
<next><block type="arduino_analog_write"><field name="PIN">5</field>
<value name="VALUE"><shadow type="math_number"><field name="NUM">64</field></shadow></value>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">1000</field></shadow></value>
<next><block type="arduino_analog_write"><field name="PIN">5</field>
<value name="VALUE"><shadow type="math_number"><field name="NUM">128</field></shadow></value>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">1000</field></shadow></value>
<next><block type="arduino_analog_write"><field name="PIN">5</field>
<value name="VALUE"><shadow type="math_number"><field name="NUM">255</field></shadow></value>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">1000</field></shadow></value>
</block></next></block></next></block></next></block></next></block></next></block></next></block></next></block>
</statement>
</block></xml>`,

  // ═══ Cap 7 Esp 6 — Fade up/down (pin 5, two for loops) ═══
  'v3-cap7-esp6': `<xml xmlns="https://developers.google.com/blockly/xml">
<block type="arduino_base" x="40" y="30" deletable="false">
<statement name="SETUP">
<block type="arduino_pin_mode"><field name="PIN">5</field><field name="MODE">OUTPUT</field>
</block>
</statement>
<statement name="LOOP">
<block type="controls_for">
<field name="VAR">i</field>
<value name="FROM"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
<value name="TO"><shadow type="math_number"><field name="NUM">255</field></shadow></value>
<value name="BY"><shadow type="math_number"><field name="NUM">5</field></shadow></value>
<statement name="DO">
<block type="arduino_analog_write"><field name="PIN">5</field>
<value name="VALUE"><block type="arduino_variable_get"><field name="VAR">i</field></block></value>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
</block></next></block>
</statement>
<next><block type="controls_for">
<field name="VAR">i</field>
<value name="FROM"><shadow type="math_number"><field name="NUM">255</field></shadow></value>
<value name="TO"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
<value name="BY"><shadow type="math_number"><field name="NUM">-5</field></shadow></value>
<statement name="DO">
<block type="arduino_analog_write"><field name="PIN">5</field>
<value name="VALUE"><block type="arduino_variable_get"><field name="VAR">i</field></block></value>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">10</field></shadow></value>
</block></next></block>
</statement>
</block></next></block>
</statement>
// © Andrea Marro — 06/04/2026 — ELAB Tutor — Tutti i diritti riservati
</block></xml>`,

  // ═══ Cap 7 Esp 7 — Trimmer controlla luminosita con map() (A0→pin 5) ═══
  'v3-cap7-esp7': `<xml xmlns="https://developers.google.com/blockly/xml">
<block type="arduino_base" x="40" y="30" deletable="false">
<statement name="SETUP">
<block type="arduino_pin_mode"><field name="PIN">5</field><field name="MODE">OUTPUT</field>
</block>
</statement>
<statement name="LOOP">
<block type="arduino_variable_set"><field name="TYPE">int</field><field name="VAR">valoreLetto</field>
<value name="VALUE"><block type="arduino_analog_read"><field name="PIN">A0</field></block></value>
<next><block type="arduino_variable_set"><field name="TYPE">int</field><field name="VAR">valorePWM</field>
<value name="VALUE"><block type="arduino_map">
<value name="VALUE"><block type="arduino_variable_get"><field name="VAR">valoreLetto</field></block></value>
<value name="FROM_LOW"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
<value name="FROM_HIGH"><shadow type="math_number"><field name="NUM">1023</field></shadow></value>
<value name="TO_LOW"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
<value name="TO_HIGH"><shadow type="math_number"><field name="NUM">255</field></shadow></value>
</block></value>
<next><block type="arduino_analog_write"><field name="PIN">5</field>
<value name="VALUE"><block type="arduino_variable_get"><field name="VAR">valorePWM</field></block></value>
</block></next></block></next></block>
</statement>
</block></xml>`,

  // ═══ Cap 7 Esp 8 — DAC 10 bit (A1 input, A0 output) ═══
  // analogWriteResolution(10) not available as block — simplified to analogRead→analogWrite
  'v3-cap7-esp8': `<xml xmlns="https://developers.google.com/blockly/xml">
<block type="arduino_base" x="40" y="30" deletable="false">
<statement name="LOOP">
<block type="arduino_variable_set"><field name="TYPE">int</field><field name="VAR">valoreLetto</field>
<value name="VALUE"><block type="arduino_analog_read"><field name="PIN">A1</field></block></value>
<next><block type="arduino_analog_write"><field name="PIN">3</field>
<value name="VALUE"><block type="arduino_map">
<value name="VALUE"><block type="arduino_variable_get"><field name="VAR">valoreLetto</field></block></value>
<value name="FROM_LOW"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
<value name="FROM_HIGH"><shadow type="math_number"><field name="NUM">1023</field></shadow></value>
<value name="TO_LOW"><shadow type="math_number"><field name="NUM">0</field></shadow></value>
<value name="TO_HIGH"><shadow type="math_number"><field name="NUM">255</field></shadow></value>
</block></value>
</block></next></block>
</statement>
</block></xml>`,

  // ═══ Cap 8 Esp 1 — Serial.println in setup ═══
  'v3-cap8-esp1': `<xml xmlns="https://developers.google.com/blockly/xml">
<block type="arduino_base" x="40" y="30" deletable="false">
<statement name="SETUP">
<block type="arduino_serial_begin"><field name="BAUD">9600</field>
<next><block type="arduino_serial_print"><field name="NEWLINE">TRUE</field>
<value name="CONTENT"><shadow type="text"><field name="TEXT">Ciao dal Team di ELAB!</field></shadow></value>
</block></next></block>
</statement>
</block></xml>`,

  // ═══ Cap 8 Esp 2 — Serial.println in loop ═══
  'v3-cap8-esp2': `<xml xmlns="https://developers.google.com/blockly/xml">
<block type="arduino_base" x="40" y="30" deletable="false">
<statement name="SETUP">
<block type="arduino_serial_begin"><field name="BAUD">9600</field>
</block>
</statement>
<statement name="LOOP">
<block type="arduino_serial_print"><field name="NEWLINE">TRUE</field>
<value name="CONTENT"><shadow type="text"><field name="TEXT">Ciao dal Team di ELAB!</field></shadow></value>
</block>
</statement>
</block></xml>`,

  // ═══ Cap 8 Esp 4 — Serial Plotter con 2 pot (A3, A4) ═══
  'v3-cap8-esp4': `<xml xmlns="https://developers.google.com/blockly/xml">
<block type="arduino_base" x="40" y="30" deletable="false">
<statement name="SETUP">
<block type="arduino_serial_begin"><field name="BAUD">9600</field>
</block>
</statement>
<statement name="LOOP">
<block type="arduino_variable_set"><field name="TYPE">int</field><field name="VAR">valoreA3</field>
<value name="VALUE"><block type="arduino_analog_read"><field name="PIN">A3</field></block></value>
<next><block type="arduino_variable_set"><field name="TYPE">int</field><field name="VAR">valoreA4</field>
<value name="VALUE"><block type="arduino_analog_read"><field name="PIN">A4</field></block></value>
<next><block type="arduino_serial_print"><field name="NEWLINE">FALSE</field>
<value name="CONTENT"><shadow type="text"><field name="TEXT">A3:</field></shadow></value>
<next><block type="arduino_serial_print"><field name="NEWLINE">FALSE</field>
<value name="CONTENT"><block type="arduino_variable_get"><field name="VAR">valoreA3</field></block></value>
<next><block type="arduino_serial_print"><field name="NEWLINE">FALSE</field>
<value name="CONTENT"><shadow type="text"><field name="TEXT"> A4:</field></shadow></value>
<next><block type="arduino_serial_print"><field name="NEWLINE">TRUE</field>
<value name="CONTENT"><block type="arduino_variable_get"><field name="VAR">valoreA4</field></block></value>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
</block></next></block></next></block></next></block></next></block></next></block></next></block>
</statement>
</block></xml>`,

  // ═══ Cap 8 Esp 5 — Pot + 3 LED + Serial (A3, pin 12/11/10) ═══
  'v3-cap8-esp5': `<xml xmlns="https://developers.google.com/blockly/xml">
<block type="arduino_base" x="40" y="30" deletable="false">
<statement name="SETUP">
<block type="arduino_pin_mode"><field name="PIN">12</field><field name="MODE">OUTPUT</field>
<next><block type="arduino_pin_mode"><field name="PIN">11</field><field name="MODE">OUTPUT</field>
<next><block type="arduino_pin_mode"><field name="PIN">10</field><field name="MODE">OUTPUT</field>
<next><block type="arduino_serial_begin"><field name="BAUD">9600</field>
</block></next></block></next></block></next></block>
</statement>
<statement name="LOOP">
<block type="arduino_variable_set"><field name="TYPE">int</field><field name="VAR">valore</field>
<value name="VALUE"><block type="arduino_analog_read"><field name="PIN">A3</field></block></value>
<next><block type="arduino_serial_print"><field name="NEWLINE">TRUE</field>
<value name="CONTENT"><block type="arduino_variable_get"><field name="VAR">valore</field></block></value>
<next><block type="controls_if">
<mutation elseif="1" else="1"/>
<value name="IF0">
<block type="logic_compare"><field name="OP">LT</field>
<value name="A"><block type="arduino_variable_get"><field name="VAR">valore</field></block></value>
<value name="B"><shadow type="math_number"><field name="NUM">300</field></shadow></value>
</block>
</value>
<statement name="DO0">
<block type="arduino_digital_write"><field name="PIN">12</field><field name="STATE">HIGH</field>
<next><block type="arduino_digital_write"><field name="PIN">11</field><field name="STATE">LOW</field>
<next><block type="arduino_digital_write"><field name="PIN">10</field><field name="STATE">LOW</field>
</block></next></block></next></block>
</statement>
<value name="IF1">
<block type="logic_compare"><field name="OP">LT</field>
<value name="A"><block type="arduino_variable_get"><field name="VAR">valore</field></block></value>
<value name="B"><shadow type="math_number"><field name="NUM">700</field></shadow></value>
</block>
</value>
<statement name="DO1">
<block type="arduino_digital_write"><field name="PIN">12</field><field name="STATE">LOW</field>
<next><block type="arduino_digital_write"><field name="PIN">11</field><field name="STATE">HIGH</field>
<next><block type="arduino_digital_write"><field name="PIN">10</field><field name="STATE">LOW</field>
</block></next></block></next></block>
</statement>
<statement name="ELSE">
<block type="arduino_digital_write"><field name="PIN">12</field><field name="STATE">LOW</field>
<next><block type="arduino_digital_write"><field name="PIN">11</field><field name="STATE">LOW</field>
<next><block type="arduino_digital_write"><field name="PIN">10</field><field name="STATE">HIGH</field>
</block></next></block></next></block>
</statement>
<next><block type="arduino_delay"><value name="DELAY_TIME"><shadow type="math_number"><field name="NUM">100</field></shadow></value>
</block></next></block></next></block></next></block>
</statement>
</block></xml>`,

};

export default GENERATED_SCRATCH_XML;
