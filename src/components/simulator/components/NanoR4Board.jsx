/**
 * ELAB NanoBreakout V1.1 GP — SVG Component
 * Yellow breakout PCB: semicircle left (Nano module) + wing right (connector)
 * PIN_PITCH aligned to breadboard grid (7.5). Pin IDs UNCHANGED.
 * © Andrea Marro — 12/02/2026, Breakout redesign 28/02/2026
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

// ─── Layout constants — aligned to breadboard grid ────────────────────────

const PIN_PITCH = 7.5;        // MUST match BB_HOLE_PITCH for grid alignment
const PIN_START_X = 20;       // first header pin X (inside semicircle area)
const BOARD_W = 168;          // matches COMP_SIZES (167.58 rounded)
const BOARD_H = 99;           // matches COMP_SIZES
const TOP_PIN_Y = 35;         // top header row Y
const BOTTOM_PIN_Y = 64;      // bottom header row Y
const CORNER_R = 3.5;

// Breakout shape: semicircle left + body + wing right
const SEMI_R = BOARD_H / 2;   // 49.5
const WING_X = 128;           // wing junction X
const WING_TOP = 18;          // wing top edge Y
const WING_BOT = 81;          // wing bottom edge Y
const WING_R = 3;             // wing corner radius

// Wing connector pins (16 pins along the wing area)
const WING_PIN_PITCH = 5.0;
const WING_PIN_START_X = 62;
const WING_PIN_Y = 78;        // near bottom of wing

// Nano module visual (blue rectangle inside breakout)
const NANO_X = 12;
const NANO_Y = 23;
const NANO_W = 112;
const NANO_H = 53;

// ─── Colors — ELAB NanoBreakout ───────────────────────────────────────────

const PCB_YELLOW = '#E8D86C';
const PCB_BORDER = '#1E4D8C';
const PCB_YELLOW_LIGHT = '#F0E48A';
const PAD_GOLD = '#D4A04A';
const PAD_STROKE = '#8B7430';
const BOARD_BLUE = '#1B9FBF';
const BOARD_BLUE_DARK = '#0C6F88';
const BOARD_BLUE_LIGHT = '#39B9D4';
const HOLE_DARK = '#2A2E33';
const TEXT_DARK = '#083E4E';
const CHIP_BLACK = '#111317';
const SILK_WHITE = '#F5F0E0';

// ─── Important pins to label ──────────────────────────────────────────────

const IMPORTANT_PIN_IDS = new Set([
  '5V', 'GND', 'GND_R', 'VIN', 'D13', 'D12', 'D11', 'D10', 'D9', 'D8',
  'D7', 'D6', 'D5', 'D4', 'D3', 'D2', 'A0', 'A1', 'A2', 'A3', 'A4',
  'A5', 'A6', 'A7', '3V3', 'AREF', 'RST_R', 'MINUS',
]);

// ─── Pin coordinate helpers ───────────────────────────────────────────────

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

// ─── Board outline path ──────────────────────────────────────────────────

const BOARD_PATH = `
  M ${SEMI_R} 0
  L ${WING_X} 0
  L ${WING_X} ${WING_TOP}
  L ${BOARD_W - WING_R} ${WING_TOP}
  Q ${BOARD_W} ${WING_TOP} ${BOARD_W} ${WING_TOP + WING_R}
  L ${BOARD_W} ${WING_BOT - WING_R}
  Q ${BOARD_W} ${WING_BOT} ${BOARD_W - WING_R} ${WING_BOT}
  L ${WING_X} ${WING_BOT}
  L ${WING_X} ${BOARD_H}
  L ${SEMI_R} ${BOARD_H}
  A ${SEMI_R} ${SEMI_R} 0 0 1 ${SEMI_R} 0
  Z
`;

// ─── Pin pad subcomponents ────────────────────────────────────────────────

function HeaderPinPad({ pin, stateValue }) {
  const isHigh = stateValue === 'HIGH' || stateValue === 1 || stateValue === true;
  const isActive = stateValue !== undefined && stateValue !== null;
  const showLabel = IMPORTANT_PIN_IDS.has(pin.id);

  return (
    <g data-pin={pin.id} className="pin-pad">
      <rect
        x={pin.x - 2.2} y={pin.y - 2.2} width="4.4" height="4.4" rx="0.6"
        fill={PAD_GOLD} stroke={PAD_STROKE} strokeWidth="0.35"
      />
      <circle cx={pin.x} cy={pin.y} r="0.9" fill={isHigh ? '#F3A500' : HOLE_DARK} stroke={isActive ? '#F5C244' : '#444'} strokeWidth={isActive ? '0.3' : '0.2'} />
      {isHigh && <circle cx={pin.x} cy={pin.y} r="3.4" fill="#F3C65C" opacity="0.18" />}
      {showLabel && (
        <text
          x={pin.x}
          y={pin.side === 'top' ? pin.y - 3.5 : pin.y + 4.5}
          textAnchor="middle"
          fontSize="1.4"
          fontFamily="Fira Code, monospace"
          fill={SILK_WHITE}
          opacity="0.9"
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
      <rect
        x={pin.x - 1.8} y={pin.y - 1.8} width="3.6" height="3.6" rx="0.5"
        fill={PAD_GOLD} stroke={PAD_STROKE} strokeWidth="0.3"
      />
      <circle cx={pin.x} cy={pin.y} r="0.7" fill={isHigh ? '#F3A500' : HOLE_DARK} stroke={isActive ? '#F5C244' : '#444'} strokeWidth="0.2" />
      {isHigh && <circle cx={pin.x} cy={pin.y} r="2.8" fill="#F3C65C" opacity="0.18" />}
      <text
        x={pin.x}
        y={pin.y + 4.0}
        textAnchor="middle"
        fontSize="1.1"
        fontFamily="Fira Code, monospace"
        fill={SILK_WHITE}
        opacity="0.8"
      >
        {pin.label.replace(/^[~]/, '')}
      </text>
    </g>
  );
}

// ─── Main component ──────────────────────────────────────────────────────

const NanoR4Board = ({ x = 0, y = 0, state = {}, highlighted = false, onInteract, id }) => {
  const { running = false, pinStates = {}, leds = {} } = state;
  const { power = false, d13 = false, tx = false, rx = false } = leds;

  const topPins = useMemo(() => computePinRow(TOP_PINS, 'top'), []);
  const bottomPins = useMemo(() => computePinRow(BOTTOM_PINS, 'bottom'), []);
  const wingPins = useMemo(() => computeWingPinPositions(), []);

  const resetX = NANO_X + NANO_W * 0.32;
  const resetY = NANO_Y + NANO_H * 0.54;

  const pinStateFor = (pin) => {
    if (pinStates[pin.id] !== undefined) return pinStates[pin.id];
    if (pin.mapsTo && pinStates[pin.mapsTo] !== undefined) return pinStates[pin.mapsTo];
    return undefined;
  };

  return (
    <g transform={`translate(${x}, ${y})`} data-component-id={id} data-type="nano-r4" role="img"
       aria-label={`Arduino Nano R4 ${id}`}>
      {/* 1. Yellow breakout PCB */}
      <path d={BOARD_PATH} fill={PCB_YELLOW} stroke={PCB_BORDER} strokeWidth="1.2" />
      {/* Inner border highlight */}
      <path
        d={`
          M ${SEMI_R + 2} 2
          L ${WING_X - 1} 2
          L ${WING_X - 1} ${WING_TOP + 2}
          L ${BOARD_W - WING_R - 1} ${WING_TOP + 2}
          Q ${BOARD_W - 2} ${WING_TOP + 2} ${BOARD_W - 2} ${WING_TOP + WING_R + 1}
          L ${BOARD_W - 2} ${WING_BOT - WING_R - 1}
          Q ${BOARD_W - 2} ${WING_BOT - 2} ${BOARD_W - WING_R - 1} ${WING_BOT - 2}
          L ${WING_X - 1} ${WING_BOT - 2}
          L ${WING_X - 1} ${BOARD_H - 2}
          L ${SEMI_R + 2} ${BOARD_H - 2}
          A ${SEMI_R - 2} ${SEMI_R - 2} 0 0 1 ${SEMI_R + 2} 2
          Z
        `}
        fill="none" stroke={PCB_YELLOW_LIGHT} strokeWidth="0.5" opacity="0.6"
      />

      {/* 2. Blue Nano module (inside semicircle area) */}
      <rect x={NANO_X} y={NANO_Y} width={NANO_W} height={NANO_H} rx="2.5" fill={BOARD_BLUE} stroke={BOARD_BLUE_DARK} strokeWidth="0.8" />
      <rect x={NANO_X + 1.2} y={NANO_Y + 1.2} width={NANO_W - 2.4} height={NANO_H - 2.4} rx="1.8" fill="none" stroke={BOARD_BLUE_LIGHT} strokeWidth="0.4" opacity="0.5" />

      {/* USB-C connector (left edge of semicircle) */}
      <rect x="-3" y={BOARD_H / 2 - 5.5} width="8" height="11" rx="1.5" fill="#AEB5BC" stroke="#6E7780" strokeWidth="0.5" />
      <rect x="-1" y={BOARD_H / 2 - 3.5} width="5" height="7" rx="0.8" fill="#5D636A" />

      {/* Mounting holes on Nano module */}
      <circle cx={NANO_X + 5} cy={NANO_Y + 5} r="1.9" fill="none" stroke="#D0D5DB" strokeWidth="0.5" opacity="0.7" />
      <circle cx={NANO_X + NANO_W - 5} cy={NANO_Y + 5} r="1.9" fill="none" stroke="#D0D5DB" strokeWidth="0.5" opacity="0.7" />
      <circle cx={NANO_X + 5} cy={NANO_Y + NANO_H - 5} r="1.9" fill="none" stroke="#D0D5DB" strokeWidth="0.5" opacity="0.7" />
      <circle cx={NANO_X + NANO_W - 5} cy={NANO_Y + NANO_H - 5} r="1.9" fill="none" stroke="#D0D5DB" strokeWidth="0.5" opacity="0.7" />

      {/* IC chip on Nano module */}
      <rect x={NANO_X + NANO_W * 0.38} y={NANO_Y + NANO_H * 0.18} width={NANO_W * 0.24} height={NANO_H * 0.64} rx="1.8" fill={CHIP_BLACK} stroke="#323841" strokeWidth="0.4" />
      {/* Ceramic resonator */}
      <rect x={NANO_X + NANO_W * 0.14} y={NANO_Y + NANO_H * 0.30} width={NANO_W * 0.08} height={NANO_H * 0.40} rx="1" fill="#C4CCD3" stroke="#7C8893" strokeWidth="0.3" opacity="0.9" />
      {/* Voltage regulator */}
      <rect x={NANO_X + NANO_W * 0.68} y={NANO_Y + NANO_H * 0.30} width={NANO_W * 0.08} height={NANO_H * 0.38} rx="0.9" fill="#C4CCD3" stroke="#7C8893" strokeWidth="0.3" opacity="0.9" />

      {/* Reset button */}
      <g style={{ cursor: 'pointer' }} onClick={() => onInteract && onInteract({ action: 'reset' })}>
        <rect x={resetX - 2.5} y={resetY - 2.5} width="5" height="5" rx="0.8" fill="#C7CCD2" stroke="#7B838D" strokeWidth="0.35" />
        <circle cx={resetX} cy={resetY} r="1.3" fill="#9DA5AD" stroke="#666E77" strokeWidth="0.25" />
      </g>

      {/* 3. Header pin pads (gold, on Nano module) */}
      {topPins.map((pin) => (
        <HeaderPinPad key={pin.id} pin={pin} stateValue={pinStateFor(pin)} />
      ))}
      {bottomPins.map((pin) => (
        <HeaderPinPad key={pin.id} pin={pin} stateValue={pinStateFor(pin)} />
      ))}

      {/* 4. Wing connector pins (gold, on wing area) */}
      <rect
        x={WING_PIN_START_X - 4} y={WING_PIN_Y - 4}
        width={15 * WING_PIN_PITCH + 8} height="8"
        rx="1.5" fill="#C8B050" stroke={PAD_STROKE} strokeWidth="0.4" opacity="0.35"
      />
      {wingPins.map((pin) => (
        <WingPinPad key={pin.id} pin={pin} stateValue={pinStateFor(pin)} />
      ))}

      {/* 5. Power bus indicators (on wing junction) */}
      <g opacity="0.8">
        <circle cx={WING_X + 3} cy={14} r="1.3" fill="#D32F2F" stroke={PAD_STROKE} strokeWidth="0.3" />
        <text x={WING_X + 6} y={14.5} fontSize="1.4" fill={PCB_BORDER} fontFamily="Fira Code, monospace" fontWeight="700">+</text>
        <circle cx={WING_X + 3} cy={BOARD_H - 14} r="1.3" fill="#424242" stroke={PAD_STROKE} strokeWidth="0.3" />
        <text x={WING_X + 6} y={BOARD_H - 13.5} fontSize="1.4" fill={PCB_BORDER} fontFamily="Fira Code, monospace" fontWeight="700">-</text>
      </g>

      {/* 6. Silkscreen text */}
      <text
        x={NANO_X + NANO_W / 2}
        y={NANO_Y + 7}
        textAnchor="middle"
        fontSize="2.8"
        fill="#DDF4FA"
        fontFamily="Oswald, Arial, sans-serif"
        fontWeight="700"
        letterSpacing="0.6"
      >
        ARDUINO NANO R4
      </text>

      {/* ELAB label on breakout PCB */}
      <text
        x={WING_X + (BOARD_W - WING_X) / 2}
        y={WING_TOP + 12}
        textAnchor="middle"
        fontSize="2.2"
        fill={PCB_BORDER}
        fontFamily="Oswald, Arial, sans-serif"
        fontWeight="700"
        letterSpacing="0.5"
      >
        ELAB
      </text>
      <text
        x={WING_X + (BOARD_W - WING_X) / 2}
        y={WING_TOP + 16}
        textAnchor="middle"
        fontSize="1.2"
        fill={PCB_BORDER}
        fontFamily="Fira Code, monospace"
        opacity="0.7"
      >
        V1.1 GP
      </text>

      {/* 7. Status LEDs */}
      <g>
        <circle cx={NANO_X + 8} cy={NANO_Y + NANO_H * 0.15} r="0.9" fill={power ? '#49D35C' : '#2B5A34'} />
        {power && <circle cx={NANO_X + 8} cy={NANO_Y + NANO_H * 0.15} r="2.1" fill="#6DFF85" opacity="0.2" />}
        <text x={NANO_X + 12} y={NANO_Y + NANO_H * 0.16} fontSize="1.2" fill="#0D4730" fontFamily="Fira Code, monospace">PWR</text>

        <circle cx={NANO_X + NANO_W - 8} cy={NANO_Y + NANO_H * 0.15} r="0.9" fill={d13 ? '#F3A500' : '#6A4A1F'} />
        {d13 && <circle cx={NANO_X + NANO_W - 8} cy={NANO_Y + NANO_H * 0.15} r="2.1" fill="#F9C75D" opacity="0.2" />}
        <text x={NANO_X + NANO_W - 12} y={NANO_Y + NANO_H * 0.16} fontSize="1.2" fill="#553C1A" fontFamily="Fira Code, monospace">L</text>

        <circle cx={NANO_X + 8} cy={NANO_Y + NANO_H * 0.82} r="0.75" fill={tx ? '#F28F2D' : '#6A4A1F'} />
        <circle cx={NANO_X + 8} cy={NANO_Y + NANO_H * 0.90} r="0.75" fill={rx ? '#F28F2D' : '#6A4A1F'} />
      </g>

      {/* Running indicator */}
      {running && (
        <circle cx={BOARD_W - 12} cy={WING_BOT - 6} r="1.1" fill="#89E86F">
          <animate attributeName="opacity" values="0.35;1;0.35" dur="1.4s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Highlight border */}
      {highlighted && (
        <path
          d={BOARD_PATH}
          fill="none"
          stroke="var(--color-accent, #7CB342)"
          strokeWidth="1.2"
          strokeDasharray="4 2"
          transform="translate(-1.5, -1.5) scale(1.018)"
        >
          <animate attributeName="stroke-opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
        </path>
      )}
    </g>
  );
};

// ─── Static pin export ───────────────────────────────────────────────────

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
