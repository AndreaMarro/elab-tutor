/**
 * RotationHandle — visible UI affordance per ruotare componenti circuito
 * Sprint S iter 13 R2 — surfaces existing rotation infra (SimulatorCanvas line 2196-2342)
 *
 * Render in SVG come gruppo overlay quando un componente è selezionato.
 * 4 bottoni discreti (0° / 90° / 180° / 270°) con touch target ≥44px (CLAUDE.md regola 9).
 * Snap matematica: rotation normalized via Math.round(angle / 90) * 90 % 360.
 *
 * Props:
 *   - componentId: id del componente selezionato (string)
 *   - currentRotation: rotazione corrente (0/90/180/270, default 0)
 *   - anchorX/anchorY: posizione SVG corner (px) per disegnare l'handle
 *   - onRotate: callback (newRotation: 0|90|180|270) => void
 *   - visible: boolean (mostra solo se selezionato)
 *
 * @returns SVG <g> element
 */
import React from 'react';

export const ROTATION_VALUES = [0, 90, 180, 270];
export const ROTATION_SNAP_THRESHOLD = 45; // continuous-mode snap mid-quadrant

/**
 * Snap arbitrary angle a 0/90/180/270.
 * Pure function exported for tests + future drag-arc continuous mode.
 *
 * @param {number} angle — degrees (any real number, may be negative)
 * @returns {0|90|180|270}
 */
export function snapToNearestQuadrant(angle) {
  if (!Number.isFinite(angle)) return 0;
  // normalize 0..359
  let normalized = ((angle % 360) + 360) % 360;
  // round to nearest 90
  const snapped = (Math.round(normalized / 90) * 90) % 360;
  return snapped;
}

/**
 * Cycle rotation +90 (used da context menu legacy).
 *
 * @param {number} current — current rotation
 * @returns {0|90|180|270}
 */
export function cycleRotationCW(current) {
  const cur = snapToNearestQuadrant(current || 0);
  return (cur + 90) % 360;
}

const BUTTON_SIZE = 44; // CLAUDE.md regola 9: touch target ≥ 44x44 px
const BUTTON_RADIUS = 16; // visual button radius (hit area larger via invisible circle)
const HIT_RADIUS = BUTTON_SIZE / 2; // 22 — invisible hit circle

const RotationHandle = ({
  componentId,
  currentRotation = 0,
  anchorX = 0,
  anchorY = 0,
  onRotate,
  visible = true,
}) => {
  if (!visible || !componentId || typeof onRotate !== 'function') return null;

  const current = snapToNearestQuadrant(currentRotation);

  // Layout: 4 buttons stacked vertically next to component (anchored top-right offset)
  // Spacing 50px to keep 44px touch target + 6px padding
  const positions = [
    { rot: 0, label: '0', dy: 0 },
    { rot: 90, label: '90', dy: 50 },
    { rot: 180, label: '180', dy: 100 },
    { rot: 270, label: '270', dy: 150 },
  ];

  return (
    <g
      data-testid="rotation-handle"
      data-component-id={componentId}
      data-current-rotation={current}
      transform={`translate(${anchorX}, ${anchorY})`}
      role="group"
      aria-label={`Rotazione ${componentId}`}
    >
      {/* Background pill for visibility */}
      <rect
        x={-BUTTON_RADIUS - 4}
        y={-BUTTON_RADIUS - 4}
        width={BUTTON_SIZE + 8}
        height={150 + BUTTON_SIZE + 8}
        rx={BUTTON_RADIUS + 4}
        fill="rgba(255,255,255,0.92)"
        stroke="var(--color-primary, var(--elab-navy))"
        strokeWidth="1.5"
        opacity="0.95"
      />

      {positions.map(({ rot, label, dy }) => {
        const isActive = rot === current;
        return (
          <g
            key={rot}
            data-testid={`rotation-handle-btn-${rot}`}
            transform={`translate(0, ${dy})`}
            style={{ cursor: 'pointer' }}
            onPointerDown={(ev) => {
              ev.stopPropagation();
              ev.preventDefault();
              const next = snapToNearestQuadrant(rot);
              if (next !== current) onRotate(next);
            }}
            role="button"
            aria-label={`Ruota a ${rot} gradi`}
            aria-pressed={isActive}
          >
            {/* Invisible 44px hit area for touch */}
            <circle r={HIT_RADIUS} fill="transparent" />
            {/* Visible button */}
            <circle
              r={BUTTON_RADIUS}
              fill={isActive ? 'var(--color-accent, var(--elab-lime))' : 'var(--color-primary, var(--elab-navy))'}
              stroke="#fff"
              strokeWidth="2"
              opacity={isActive ? 1 : 0.85}
            />
            <text
              x="0"
              y="5"
              textAnchor="middle"
              fontSize="13"
              fontWeight="700"
              fontFamily="Oswald, Arial, sans-serif"
              fill="#fff"
              pointerEvents="none"
            >
              {label}
            </text>
          </g>
        );
      })}
    </g>
  );
};

export default RotationHandle;
