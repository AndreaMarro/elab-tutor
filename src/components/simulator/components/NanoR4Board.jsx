/**
 * ELAB NanoBreakout V1.1 GP — SVG Component (High-Fidelity Rewrite)
 * Yellow breakout PCB: semicircle left (Nano module) + wing right (connector)
 * Based on DWG ground truth (SSOT_context.json) + real hardware photos.
 * PIN_PITCH aligned to breadboard grid (7.5). Pin IDs/positions UNCHANGED.
 * © Andrea Marro — 11/03/2026
 */

import React, { useMemo } from 'react';
import { registerComponent } from './registry';

// ─── Pin data (IDs UNCHANGED for solver/experiment compatibility) ─────────

const TOP_PINS = [
  { id: 'D13', label: 'D13', type: 'digital', arduino: 13 },
  { id: '3V3', label: '3V3', type: 'power' },
  { id: 'AREF', label: 'AREF', type: 'analog' },
  { id: 'A0', label: 'A0', type: 'analog', arduino: 14 },
  { id: 'A1', label: 'A1', type: 'analog', arduino: 15 },
  { id: 'A2', label: 'A2', type: 'analog', arduino: 16 },
  { id: 'A3', label: 'A3', type: 'analog', arduino: 17 },
  { id: 'A4', label: 'A4', type: 'analog', arduino: 18 },
  { id: 'A5', label: 'A5', type: 'analog', arduino: 19 },
  { id: 'A6', label: 'A6', type: 'analog', arduino: 20 },
  { id: 'A7', label: 'A7', type: 'analog', arduino: 21 },
  { id: '5V', label: '5V', type: 'power' },
  { id: 'MINUS', label: '-', type: 'power' },
  { id: 'GND', label: 'GND', type: 'power' },
  { id: 'VIN', label: 'VIN', type: 'power' },
];

const BOTTOM_PINS = [
  { id: 'D12', label: 'D12', type: 'digital', arduino: 12 },
  { id: 'D11', label: '~D11', type: 'pwm', arduino: 11 },
  { id: 'D10', label: '~D10', type: 'pwm', arduino: 10 },
  { id: 'D9', label: '~D9', type: 'pwm', arduino: 9 },
  { id: 'D8', label: 'D8', type: 'digital', arduino: 8 },
  { id: 'D7', label: 'D7', type: 'digital', arduino: 7 },
  { id: 'D6', label: '~D6', type: 'pwm', arduino: 6 },
  { id: 'D5', label: '~D5', type: 'pwm', arduino: 5 },
  { id: 'D4', label: 'D4', type: 'digital', arduino: 4 },
  { id: 'D3', label: '~D3', type: 'pwm', arduino: 3 },
  { id: 'D2', label: 'D2', type: 'digital', arduino: 2 },
  { id: 'GND_R', label: 'GND', type: 'power' },
  { id: 'RST_R', label: 'RST', type: 'control' },
  { id: 'RX', label: 'D0/RX', type: 'digital', arduino: 0 },
  { id: 'TX', label: 'D1/TX', type: 'digital', arduino: 1 },
];

const WING_PINS = [
  { id: 'W_A0', label: 'A0', type: 'analog', arduino: 14, mapsTo: 'A0' },
  { id: 'W_A1', label: 'A1', type: 'analog', arduino: 15, mapsTo: 'A1' },
  { id: 'W_A2', label: 'A2', type: 'analog', arduino: 16, mapsTo: 'A2' },
  { id: 'W_A3', label: 'A3', type: 'analog', arduino: 17, mapsTo: 'A3' },
  { id: 'W_D3', label: '~D3', type: 'pwm', arduino: 3, mapsTo: 'D3' },
  { id: 'W_D5', label: '~D5', type: 'pwm', arduino: 5, mapsTo: 'D5' },
  { id: 'W_D6', label: '~D6', type: 'pwm', arduino: 6, mapsTo: 'D6' },
  { id: 'W_D9', label: '~D9', type: 'pwm', arduino: 9, mapsTo: 'D9' },
  { id: 'W_A4', label: 'A4/SDA', type: 'analog', arduino: 18, mapsTo: 'A4' },
  { id: 'W_A5', label: 'A5/SCL', type: 'analog', arduino: 19, mapsTo: 'A5' },
  { id: 'W_D0', label: 'D0/RX', type: 'digital', arduino: 0, mapsTo: 'RX' },
  { id: 'W_D1', label: 'D1/TX', type: 'digital', arduino: 1, mapsTo: 'TX' },
  { id: 'W_D13', label: 'D13/SCK', type: 'digital', arduino: 13, mapsTo: 'D13' },
  { id: 'W_D12', label: 'D12/MISO', type: 'digital', arduino: 12, mapsTo: 'D12' },
  { id: 'W_D11', label: '~D11/MOSI', type: 'pwm', arduino: 11, mapsTo: 'D11' },
  { id: 'W_D10', label: '~D10', type: 'pwm', arduino: 10, mapsTo: 'D10' },
  { id: 'W_D8', label: 'D8', type: 'digital', arduino: 8, mapsTo: 'D8' },
];

// ─── Layout constants — IMMUTABLE (pin positions used by all experiments) ──

const PIN_PITCH = 7.5;        // MUST match BB_HOLE_PITCH for grid alignment
const PIN_START_X = 20;       // first header pin X (inside semicircle area)
const BOARD_W = 168;          // matches COMP_SIZES (167.58 rounded)
const BOARD_H = 99;           // matches COMP_SIZES
const TOP_PIN_Y = 35;         // top header row Y
const BOTTOM_PIN_Y = 64;      // bottom header row Y

// Breakout shape: semicircle left + body + wing right
const SEMI_R = BOARD_H / 2;   // 49.5 — true semicircle
const SEMI_CX = SEMI_R;       // semicircle center X

// Wing area (connector protrusion on right side)
const WING_X = 125;           // wing junction X (where main body meets wing)
const WING_TOP = 16;          // wing top edge Y
const WING_BOT = 83;          // wing bottom edge Y
const WING_R = 4;             // wing corner radius (closer to real R=2mm)

// Nano slot (internal notch showing where Arduino Nano plugs in)
const SLOT_X = 118;           // slot junction X (left wall of slot)
const SLOT_TOP = 20;          // slot top Y
const SLOT_BOT = 79;          // slot bottom Y
const SLOT_R = 2.5;           // slot corner radius

// Wing connector pins (17 pins along the wing area)
const WING_PIN_PITCH = 5.0;
const WING_PIN_START_X = 62;
const WING_PIN_Y = 78;        // near bottom of wing

// Nano module visual (blue rectangle inside breakout)
const NANO_X = 10;
const NANO_Y = 22;
const NANO_W = 105;
const NANO_H = 55;

// ─── Colors — ELAB NanoBreakout ───────────────────────────────────────────

const PCB_YELLOW = '#E8D86C';
const PCB_YELLOW_DARK = '#D4C45A';
const PCB_YELLOW_LIGHT = '#F0E48A';
const PCB_BORDER = '#1E4D8C';
const PAD_GOLD = '#D4A04A';
const PAD_STROKE = '#8B7430';
const BOARD_BLUE = '#1A8FAB';     // Arduino Nano R4 teal
const BOARD_BLUE_DARK = '#0D6B82';
const BOARD_BLUE_LIGHT = '#2BB8D6';
const HOLE_DARK = '#2A2E33';
const CHIP_BLACK = '#111317';
const SILK_WHITE = '#F5F0E0';
const CONNECTOR_BODY = '#2C2F33';
const CONNECTOR_DARK = '#1A1C1F';

// ─── Important pins to label ──────────────────────────────────────────────

const IMPORTANT_PIN_IDS = new Set([
  '5V', 'GND', 'GND_R', 'VIN', 'D13', 'D12', 'D11', 'D10', 'D9', 'D8',
  'D7', 'D6', 'D5', 'D4', 'D3', 'D2', 'A0', 'A1', 'A2', 'A3', 'A4',
  'A5', 'A6', 'A7', '3V3', 'AREF', 'RST_R', 'MINUS',
]);

// ─── Pin coordinate helpers (UNCHANGED) ─────────────────────────────────

function xAt(index) {
  return PIN_START_X + index * PIN_PITCH;
}

function computePinRow(pins, side) {
  const y = side === 'top' ? TOP_PIN_Y : BOTTOM_PIN_Y;
  return pins.map((pin, index) => ({
    ...pin,
    x: xAt(index),
    y,
    side,
    index,
  }));
}

function computeWingPinPositions() {
  return WING_PINS.map((pin, index) => ({
    ...pin,
    x: WING_PIN_START_X + index * WING_PIN_PITCH,
    y: WING_PIN_Y,
    side: 'wing',
    index,
  }));
}

// ─── Board outline path (DWG-inspired shape) ────────────────────────────
// Shape: semicircle left → top edge → nano slot notch → wing tab → bottom → semicircle

const BOARD_PATH = (() => {
  const wingRight = BOARD_W;
  return `
    M ${SEMI_CX} 0
    L ${SLOT_X} 0
    L ${SLOT_X} ${SLOT_TOP}
    Q ${SLOT_X} ${SLOT_TOP - SLOT_R} ${SLOT_X + SLOT_R} ${SLOT_TOP - SLOT_R}
    L ${WING_X - SLOT_R} ${SLOT_TOP - SLOT_R}
    Q ${WING_X} ${SLOT_TOP - SLOT_R} ${WING_X} ${WING_TOP}
    L ${wingRight - WING_R} ${WING_TOP}
    Q ${wingRight} ${WING_TOP} ${wingRight} ${WING_TOP + WING_R}
    L ${wingRight} ${WING_BOT - WING_R}
    Q ${wingRight} ${WING_BOT} ${wingRight - WING_R} ${WING_BOT}
    L ${WING_X} ${WING_BOT}
    Q ${WING_X} ${BOARD_H - SLOT_TOP + SLOT_R} ${WING_X - SLOT_R} ${BOARD_H - SLOT_TOP + SLOT_R}
    L ${SLOT_X + SLOT_R} ${BOARD_H - SLOT_TOP + SLOT_R}
    Q ${SLOT_X} ${BOARD_H - SLOT_TOP + SLOT_R} ${SLOT_X} ${BOARD_H - SLOT_TOP}
    L ${SLOT_X} ${BOARD_H}
    L ${SEMI_CX} ${BOARD_H}
    A ${SEMI_R} ${SEMI_R} 0 0 1 ${SEMI_CX} 0
    Z
  `;
})();

// Simpler fallback outline for inner border highlight
const INNER_PATH = (() => {
  const inset = 2;
  const wingRight = BOARD_W - inset;
  return `
    M ${SEMI_CX + inset} ${inset}
    L ${SLOT_X - inset} ${inset}
    L ${SLOT_X - inset} ${SLOT_TOP + inset}
    L ${WING_X - inset} ${WING_TOP + inset}
    L ${wingRight - WING_R} ${WING_TOP + inset}
    Q ${wingRight} ${WING_TOP + inset} ${wingRight} ${WING_TOP + WING_R + inset}
    L ${wingRight} ${WING_BOT - WING_R - inset}
    Q ${wingRight} ${WING_BOT - inset} ${wingRight - WING_R} ${WING_BOT - inset}
    L ${WING_X - inset} ${WING_BOT - inset}
    L ${SLOT_X - inset} ${BOARD_H - SLOT_TOP - inset}
    L ${SLOT_X - inset} ${BOARD_H - inset}
    L ${SEMI_CX + inset} ${BOARD_H - inset}
    A ${SEMI_R - inset} ${SEMI_R - inset} 0 0 1 ${SEMI_CX + inset} ${inset}
    Z
  `;
})();

// ─── Pin pad subcomponents ────────────────────────────────────────────────

function HeaderPinPad({ pin, stateValue }) {
  const isHigh = stateValue === 'HIGH' || stateValue === 1 || stateValue === true;
  const isActive = stateValue !== undefined && stateValue !== null;
  const showLabel = IMPORTANT_PIN_IDS.has(pin.id);

  // Color-code power pins
  const isPower5V = pin.id === '5V' || pin.id === '3V3' || pin.id === 'VIN';
  const isGround = pin.id === 'GND' || pin.id === 'GND_R' || pin.id === 'MINUS';
  const padColor = isPower5V ? '#E85040' : isGround ? '#333' : PAD_GOLD;

  return (
    <g data-pin={pin.id} className="pin-pad">
      {/* Solder pad */}
      <rect
        x={pin.x - 2.4} y={pin.y - 2.4} width="4.8" height="4.8" rx="0.7"
        fill={padColor} stroke={PAD_STROKE} strokeWidth="0.35"
      />
      {/* Through-hole */}
      <circle
        cx={pin.x} cy={pin.y} r="1.0"
        fill={isHigh ? '#F3A500' : HOLE_DARK}
        stroke={isActive ? '#F5C244' : '#555'}
        strokeWidth={isActive ? '0.35' : '0.2'}
      />
      {/* Active glow */}
      {isHigh && <circle cx={pin.x} cy={pin.y} r="3.6" fill="#F3C65C" opacity="0.2" />}
      {/* Pin label */}
      {showLabel && (
        <text
          x={pin.x}
          y={pin.side === 'top' ? pin.y - 4.0 : pin.y + 5.2}
          textAnchor="middle"
          fontSize="1.5"
          fontFamily="Fira Code, monospace"
          fill={SILK_WHITE}
          opacity="0.95"
          fontWeight="600"
        >
          {pin.label}
        </text>
      )}
    </g>
  );
}

function WingPinPad({ pin, stateValue }) {
  const isHigh = stateValue === 'HIGH' || stateValue === 1 || stateValue === true;
  const isActive = stateValue !== undefined && stateValue !== null;

  return (
    <g data-pin={pin.id} className="pin-pad">
      {/* Solder pad */}
      <rect
        x={pin.x - 2.0} y={pin.y - 2.0} width="4.0" height="4.0" rx="0.5"
        fill={PAD_GOLD} stroke={PAD_STROKE} strokeWidth="0.3"
      />
      {/* Through-hole */}
      <circle
        cx={pin.x} cy={pin.y} r="0.8"
        fill={isHigh ? '#F3A500' : HOLE_DARK}
        stroke={isActive ? '#F5C244' : '#555'}
        strokeWidth="0.2"
      />
      {/* Active glow */}
      {isHigh && <circle cx={pin.x} cy={pin.y} r="3.0" fill="#F3C65C" opacity="0.2" />}
      {/* Pin label (rotated 90° like real board silkscreen) */}
      <text
        x={pin.x}
        y={pin.y + 4.5}
        textAnchor="middle"
        fontSize="1.1"
        fontFamily="Fira Code, monospace"
        fill={SILK_WHITE}
        opacity="0.85"
        fontWeight="500"
      >
        {pin.label.replace(/^[~]/, '')}
      </text>
    </g>
  );
}

// ─── Sub-component: Arduino Nano R4 module ──────────────────────────────

function NanoModule({ x, y, w, h, leds, running, onReset }) {
  const { power = false, d13 = false, tx = false, rx = false } = leds;

  // Renesas RA4M1 MCU position (centered)
  const mcuX = x + w * 0.36;
  const mcuY = y + h * 0.15;
  const mcuW = w * 0.26;
  const mcuH = h * 0.65;

  // ESP32-S3 WiFi module (right of MCU)
  const wifiX = x + w * 0.68;
  const wifiY = y + h * 0.22;
  const wifiW = w * 0.13;
  const wifiH = h * 0.42;

  // Crystal oscillator
  const crystalX = x + w * 0.13;
  const crystalY = y + h * 0.32;
  const crystalW = w * 0.07;
  const crystalH = h * 0.36;

  // Reset button
  const resetX = x + w * 0.30;
  const resetY = y + h * 0.55;

  return (
    <g>
      {/* PCB board */}
      <rect x={x} y={y} width={w} height={h} rx="2.5"
        fill={BOARD_BLUE} stroke={BOARD_BLUE_DARK} strokeWidth="0.9" />
      {/* PCB inner edge highlight */}
      <rect x={x + 1.2} y={y + 1.2} width={w - 2.4} height={h - 2.4} rx="1.8"
        fill="none" stroke={BOARD_BLUE_LIGHT} strokeWidth="0.4" opacity="0.4" />

      {/* USB-C connector (left edge, protruding beyond board) */}
      <rect x={-3.5} y={BOARD_H / 2 - 5} width="9" height="10" rx="1.8"
        fill="#AEB5BC" stroke="#6E7780" strokeWidth="0.5" />
      <rect x={-1.5} y={BOARD_H / 2 - 3.2} width="5.5" height="6.4" rx="1"
        fill="#5D636A" />
      {/* USB-C inner slot */}
      <rect x={-0.5} y={BOARD_H / 2 - 1.5} width="3.5" height="3" rx="0.6"
        fill="#3A3F44" />

      {/* Mounting holes (4 corners) */}
      {[[x + 4, y + 4], [x + w - 4, y + 4], [x + 4, y + h - 4], [x + w - 4, y + h - 4]].map(([hx, hy], i) => (
        <g key={`mount-${i}`}>
          <circle cx={hx} cy={hy} r="2.2" fill="none" stroke="#90A0AD" strokeWidth="0.6" opacity="0.5" />
          <circle cx={hx} cy={hy} r="1.0" fill={HOLE_DARK} opacity="0.4" />
        </g>
      ))}

      {/* Renesas RA4M1 MCU (main processor) */}
      <rect x={mcuX} y={mcuY} width={mcuW} height={mcuH} rx="1.2"
        fill={CHIP_BLACK} stroke="#2A2F35" strokeWidth="0.45" />
      {/* Pin 1 dot marker */}
      <circle cx={mcuX + 2} cy={mcuY + 2} r="0.7" fill="#444" />
      {/* MCU silkscreen text */}
      <text x={mcuX + mcuW / 2} y={mcuY + mcuH / 2 - 1.5}
        textAnchor="middle" fontSize="1.6" fill="#555" fontFamily="Arial, sans-serif" fontWeight="700">
        RA4M1
      </text>
      <text x={mcuX + mcuW / 2} y={mcuY + mcuH / 2 + 1.5}
        textAnchor="middle" fontSize="1.0" fill="#444" fontFamily="Arial, sans-serif">
        RENESAS
      </text>

      {/* ESP32-S3 WiFi/BLE module (metal shield) */}
      <rect x={wifiX} y={wifiY} width={wifiW} height={wifiH} rx="0.8"
        fill="#B0B8C0" stroke="#7C8893" strokeWidth="0.35" />
      <text x={wifiX + wifiW / 2} y={wifiY + wifiH / 2}
        textAnchor="middle" fontSize="0.9" fill="#555" fontFamily="Arial, sans-serif">
        ESP32
      </text>

      {/* Crystal oscillator */}
      <rect x={crystalX} y={crystalY} width={crystalW} height={crystalH} rx="0.8"
        fill="#C4CCD3" stroke="#7C8893" strokeWidth="0.3" />

      {/* Voltage regulator (small SOT-23 package) */}
      <rect x={x + w * 0.85} y={y + h * 0.35} width={w * 0.06} height={h * 0.30} rx="0.5"
        fill={CHIP_BLACK} stroke="#333" strokeWidth="0.25" />

      {/* Small passive components (capacitors, resistors — cosmetic) */}
      {[0.20, 0.25, 0.30].map((py, i) => (
        <rect key={`cap-${i}`} x={x + w * 0.62} y={y + h * py} width={2.5} height={1.2} rx="0.3"
          fill="#A08860" stroke="#806840" strokeWidth="0.15" opacity="0.7" />
      ))}

      {/* Reset button (interactive) */}
      <g style={{ cursor: 'pointer' }} onClick={() => onReset && onReset({ action: 'reset' })}>
        <rect x={resetX - 2.8} y={resetY - 2.8} width="5.6" height="5.6" rx="0.8"
          fill="#C7CCD2" stroke="#7B838D" strokeWidth="0.4" />
        <circle cx={resetX} cy={resetY} r="1.5"
          fill="#9DA5AD" stroke="#666E77" strokeWidth="0.3" />
        <text x={resetX} y={resetY + 5} textAnchor="middle" fontSize="0.9" fill="#0C6F88"
          fontFamily="Fira Code, monospace">RST</text>
      </g>

      {/* Status LEDs */}
      <g>
        {/* Power LED (green) */}
        <circle cx={x + 8} cy={y + h * 0.14} r="1.0"
          fill={power ? '#49D35C' : '#2B5A34'} />
        {power && <circle cx={x + 8} cy={y + h * 0.14} r="2.5" fill="#6DFF85" opacity="0.25" />}
        <text x={x + 11.5} y={y + h * 0.15 + 0.4} fontSize="1.0" fill="#0D6B40"
          fontFamily="Fira Code, monospace" fontWeight="600">PWR</text>

        {/* D13 LED (amber/orange) */}
        <circle cx={x + w - 8} cy={y + h * 0.14} r="1.0"
          fill={d13 ? '#F3A500' : '#6A4A1F'} />
        {d13 && <circle cx={x + w - 8} cy={y + h * 0.14} r="2.5" fill="#F9C75D" opacity="0.25" />}
        <text x={x + w - 12} y={y + h * 0.15 + 0.4} fontSize="1.0" fill="#553C1A"
          fontFamily="Fira Code, monospace" fontWeight="600">L</text>

        {/* TX LED */}
        <circle cx={x + 8} cy={y + h * 0.84} r="0.8"
          fill={tx ? '#F28F2D' : '#6A4A1F'} />
        {tx && <circle cx={x + 8} cy={y + h * 0.84} r="2" fill="#F9AA4D" opacity="0.2" />}
        <text x={x + 11} y={y + h * 0.85 + 0.3} fontSize="0.8" fill="#6A4A1F"
          fontFamily="Fira Code, monospace">TX</text>

        {/* RX LED */}
        <circle cx={x + 8} cy={y + h * 0.91} r="0.8"
          fill={rx ? '#F28F2D' : '#6A4A1F'} />
        {rx && <circle cx={x + 8} cy={y + h * 0.91} r="2" fill="#F9AA4D" opacity="0.2" />}
        <text x={x + 11} y={y + h * 0.92 + 0.3} fontSize="0.8" fill="#6A4A1F"
          fontFamily="Fira Code, monospace">RX</text>
      </g>

      {/* Board silkscreen: ARDUINO + NANO R4 */}
      <text x={x + w / 2} y={y + 6.5} textAnchor="middle"
        fontSize="3.0" fill="#DDF4FA" fontFamily="Oswald, Arial, sans-serif"
        fontWeight="700" letterSpacing="0.8">
        ARDUINO
      </text>
      <text x={x + w / 2} y={y + 10} textAnchor="middle"
        fontSize="1.8" fill="#B0DCE8" fontFamily="Oswald, Arial, sans-serif"
        fontWeight="500" letterSpacing="0.5">
        NANO R4
      </text>

      {/* Pin header rows (visual only — two gold strips along the Nano edges) */}
      <rect x={x + 2} y={y + h * 0.20} width={w - 4} height="1.8" rx="0.3"
        fill={PAD_GOLD} opacity="0.3" />
      <rect x={x + 2} y={y + h * 0.76} width={w - 4} height="1.8" rx="0.3"
        fill={PAD_GOLD} opacity="0.3" />
    </g>
  );
}

// ─── Sub-component: Wing connector area ─────────────────────────────────

function WingConnector({ wingPins, pinStateFor }) {
  const firstPin = WING_PIN_START_X;
  const lastPin = WING_PIN_START_X + (WING_PINS.length - 1) * WING_PIN_PITCH;
  const connW = lastPin - firstPin + 8;
  const connX = firstPin - 4;
  const connY = WING_PIN_Y - 5;
  const connH = 10;

  return (
    <g>
      {/* Connector housing (dark plastic body) */}
      <rect x={connX} y={connY} width={connW} height={connH} rx="1.2"
        fill={CONNECTOR_BODY} stroke={CONNECTOR_DARK} strokeWidth="0.5" />
      {/* Top edge highlight (3D effect) */}
      <line x1={connX + 1} y1={connY + 0.5} x2={connX + connW - 1} y2={connY + 0.5}
        stroke="#484B50" strokeWidth="0.4" opacity="0.6" />
      {/* Bottom shadow */}
      <line x1={connX + 1} y1={connY + connH - 0.3} x2={connX + connW - 1} y2={connY + connH - 0.3}
        stroke="#0E0F10" strokeWidth="0.4" opacity="0.4" />

      {/* Individual pin pads */}
      {wingPins.map((pin) => (
        <WingPinPad key={pin.id} pin={pin} stateValue={pinStateFor(pin)} />
      ))}
    </g>
  );
}

// ─── Sub-component: Power bus pads ──────────────────────────────────────

function PowerBusPads() {
  // 4 pads: +top, -top, +bottom, -bottom near the wing junction
  const padX = WING_X - 6;
  const pads = [
    { y: 10, label: '+', color: '#D32F2F' },
    { y: 17, label: '-', color: '#212121' },
    { y: BOARD_H - 17, label: '+', color: '#D32F2F' },
    { y: BOARD_H - 10, label: '-', color: '#212121' },
  ];

  return (
    <g>
      {pads.map((pad, i) => (
        <g key={`pbus-${i}`}>
          {/* Solder pad ring */}
          <circle cx={padX} cy={pad.y} r="2.2"
            fill={PAD_GOLD} stroke={PAD_STROKE} strokeWidth="0.3" />
          {/* Through-hole */}
          <circle cx={padX} cy={pad.y} r="1.0" fill={HOLE_DARK} />
          {/* Color indicator ring */}
          <circle cx={padX} cy={pad.y} r="2.7"
            fill="none" stroke={pad.color} strokeWidth="0.5" opacity="0.7" />
          {/* Label */}
          <text x={padX + 4.5} y={pad.y + 0.5} fontSize="2.0" fill={PCB_BORDER}
            fontFamily="Fira Code, monospace" fontWeight="700">
            {pad.label}
          </text>
        </g>
      ))}
    </g>
  );
}

// ─── Sub-component: Board silkscreen & decorations ─────────────────────

function BoardSilkscreen() {
  const wingCenterX = (WING_X + BOARD_W) / 2;
  const wingCenterY = (WING_TOP + WING_BOT) / 2;

  return (
    <g>
      {/* ELAB label on wing area */}
      <text x={wingCenterX} y={wingCenterY - 8} textAnchor="middle"
        fontSize="4.0" fill={PCB_BORDER} fontFamily="Oswald, Arial, sans-serif"
        fontWeight="800" letterSpacing="1.5" opacity="0.9">
        ELAB
      </text>

      {/* Version label */}
      <text x={wingCenterX} y={wingCenterY - 2} textAnchor="middle"
        fontSize="1.6" fill={PCB_BORDER} fontFamily="Fira Code, monospace"
        fontWeight="600" opacity="0.7">
        Nano Breakout
      </text>
      <text x={wingCenterX} y={wingCenterY + 2} textAnchor="middle"
        fontSize="1.4" fill={PCB_BORDER} fontFamily="Fira Code, monospace"
        opacity="0.6">
        V1.1 GP
      </text>

      {/* Copper trace hints on yellow PCB (cosmetic lines) */}
      <g opacity="0.12" stroke={PCB_YELLOW_DARK} strokeWidth="0.6">
        {/* Horizontal trace lines connecting header to wing */}
        {[35, 42, 49.5, 57, 64].map((ty, i) => (
          <line key={`trace-h-${i}`}
            x1={NANO_X + NANO_W + 2} y1={ty}
            x2={WING_X - 3} y2={ty} />
        ))}
        {/* Vertical traces on wing */}
        {[WING_X + 5, WING_X + 15, WING_X + 25].map((tx, i) => (
          <line key={`trace-v-${i}`}
            x1={tx} y1={WING_TOP + 5}
            x2={tx} y2={WING_BOT - 5} />
        ))}
      </g>

      {/* Mounting holes on breakout board (plated through-holes) */}
      {[[WING_X + 4, WING_TOP + 5], [BOARD_W - 6, WING_TOP + 5],
        [WING_X + 4, WING_BOT - 5], [BOARD_W - 6, WING_BOT - 5]].map(([hx, hy], i) => (
        <g key={`brd-mount-${i}`}>
          <circle cx={hx} cy={hy} r="1.8" fill={PAD_GOLD} stroke={PAD_STROKE}
            strokeWidth="0.3" opacity="0.5" />
          <circle cx={hx} cy={hy} r="0.9" fill={HOLE_DARK} opacity="0.6" />
        </g>
      ))}
    </g>
  );
}

// ─── Main component ──────────────────────────────────────────────────────

const NanoR4Board = ({ x = 0, y = 0, state = {}, highlighted = false, onInteract, id }) => {
  const { running = false, pinStates = {}, leds = {} } = state;

  const topPins = useMemo(() => computePinRow(TOP_PINS, 'top'), []);
  const bottomPins = useMemo(() => computePinRow(BOTTOM_PINS, 'bottom'), []);
  const wingPins = useMemo(() => computeWingPinPositions(), []);

  const pinStateFor = (pin) => {
    if (pinStates[pin.id] !== undefined) return pinStates[pin.id];
    if (pin.mapsTo && pinStates[pin.mapsTo] !== undefined) return pinStates[pin.mapsTo];
    return undefined;
  };

  return (
    <g transform={`translate(${x}, ${y})`} data-component-id={id} data-type="nano-r4" role="img"
       aria-label={`Arduino Nano R4 ${id}`}>

      {/* 1. Yellow breakout PCB (board outline) */}
      <path d={BOARD_PATH} fill={PCB_YELLOW} stroke={PCB_BORDER} strokeWidth="1.3" />
      {/* Inner border highlight for 3D depth */}
      <path d={INNER_PATH} fill="none" stroke={PCB_YELLOW_LIGHT} strokeWidth="0.5" opacity="0.5" />

      {/* 2. Nano slot detail groove (darker line showing insertion channel) */}
      <g opacity="0.25">
        <line x1={SLOT_X + 1} y1={SLOT_TOP + 2} x2={SLOT_X + 1} y2={SLOT_BOT - 2}
          stroke={PCB_BORDER} strokeWidth="0.6" />
        <line x1={WING_X - 1} y1={WING_TOP + 6} x2={WING_X - 1} y2={WING_BOT - 6}
          stroke={PCB_BORDER} strokeWidth="0.6" />
      </g>

      {/* 3. Arduino Nano R4 module (blue board inside breakout) */}
      <NanoModule
        x={NANO_X} y={NANO_Y} w={NANO_W} h={NANO_H}
        leds={leds} running={running}
        onReset={onInteract}
      />

      {/* 4. Header pin pads (gold, on breakout board surface) */}
      {topPins.map((pin) => (
        <HeaderPinPad key={pin.id} pin={pin} stateValue={pinStateFor(pin)} />
      ))}
      {bottomPins.map((pin) => (
        <HeaderPinPad key={pin.id} pin={pin} stateValue={pinStateFor(pin)} />
      ))}

      {/* 5. Wing connector (with housing + pin pads) */}
      <WingConnector wingPins={wingPins} pinStateFor={pinStateFor} />

      {/* 6. Power bus pads */}
      <PowerBusPads />

      {/* 7. Board silkscreen and decorations */}
      <BoardSilkscreen />

      {/* 8. Running indicator (green pulse on wing) */}
      {running && (
        <circle cx={BOARD_W - 10} cy={WING_BOT - 8} r="1.3" fill="#89E86F">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.4s" repeatCount="indefinite" />
        </circle>
      )}

      {/* 9. Selection highlight border */}
      {highlighted && (
        <path
          d={BOARD_PATH}
          fill="none"
          stroke="var(--color-accent, #7CB342)"
          strokeWidth="1.5"
          strokeDasharray="4 2"
          transform="translate(-1.5, -1.5) scale(1.018)"
        >
          <animate attributeName="stroke-opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
        </path>
      )}
    </g>
  );
};

// ─── Static pin export (UNCHANGED coordinates) ──────────────────────────

const allTopPins = computePinRow(TOP_PINS, 'top');
const allBottomPins = computePinRow(BOTTOM_PINS, 'bottom');
const allWingPins = computeWingPinPositions();

NanoR4Board.pins = [
  ...allTopPins.map((p) => ({
    id: p.id, label: p.label, x: p.x, y: p.y,
    type: p.type, side: p.side, arduino: p.arduino,
  })),
  ...allBottomPins.map((p) => ({
    id: p.id, label: p.label, x: p.x, y: p.y,
    type: p.type, side: p.side, arduino: p.arduino,
  })),
  ...allWingPins.map((p) => ({
    id: p.id, label: p.label, x: p.x, y: p.y,
    type: p.type, side: p.side, arduino: p.arduino, mapsTo: p.mapsTo,
  })),
];

NanoR4Board.defaultState = {
  running: false,
  pinStates: {},
  leds: {
    power: false,
    d13: false,
    rgb: [0, 0, 0],
    tx: false,
    rx: false,
  },
};

NanoR4Board.boardDimensions = {
  width: BOARD_W,
  height: BOARD_H,
  breakoutWidth: BOARD_W,
  breakoutHeight: BOARD_H,
  breakoutOffsetX: 0,
  breakoutOffsetY: 0,
  wingWidth: BOARD_W - WING_X,
  wingHeight: WING_BOT - WING_TOP,
  wingStartX: WING_X,
  wingY: WING_TOP,
  semiCircleRadius: SEMI_R,
  boardWidth: BOARD_W,
  boardHeight: BOARD_H,
  version: 'NanoBreakout V1.1 GP',
  scale: 1,
  pinPitch: PIN_PITCH,
  aspectRatio: BOARD_W / BOARD_H,
};

registerComponent('nano-r4', {
  component: NanoR4Board,
  pins: NanoR4Board.pins,
  defaultState: NanoR4Board.defaultState,
  category: 'board',
  label: 'ELAB NanoBreakout V1.1 GP',
  icon: '\uD83D\uDCDF',
  boardDimensions: NanoR4Board.boardDimensions,
  volumeAvailableFrom: 3,
});

export default NanoR4Board;
