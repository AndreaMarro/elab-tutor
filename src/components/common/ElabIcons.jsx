/**
 * ElabIcons — Libreria SVG inline per ELAB
 * Ogni icona: 24x24 viewBox, stroke-based, colori via props.
 * WCAG friendly: role="img" + aria-hidden="true" di default.
 * ZERO emoji — solo SVG vettoriali.
 * © Andrea Marro — 31/03/2026
 */

import React from 'react';

const defaults = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function Icon({ children, size, color, className, title, ...props }) {
  return (
    <svg
      {...defaults}
      width={size || defaults.width}
      height={size || defaults.height}
      stroke={color || defaults.stroke}
      className={className}
      role="img"
      aria-hidden={title ? undefined : 'true'}
      {...props}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}

export function MicrophoneIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </Icon>
  );
}

export function StopIcon(props) {
  return (
    <Icon {...props}>
      <rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function SpeakerOnIcon(props) {
  return (
    <Icon {...props}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </Icon>
  );
}

export function SpeakerOffIcon(props) {
  return (
    <Icon {...props}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </Icon>
  );
}

export function SendIcon(props) {
  return (
    <Icon {...props}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function LoadingIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M4.93 4.93l2.83 2.83" />
      <path d="M16.24 16.24l2.83 2.83" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
      <path d="M4.93 19.07l2.83-2.83" />
      <path d="M16.24 7.76l2.83-2.83" />
    </Icon>
  );
}

export function ReportIcon(props) {
  return (
    <Icon {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </Icon>
  );
}

export function RobotIcon(props) {
  return (
    <Icon {...props}>
      <rect x="5" y="8" width="14" height="12" rx="2" />
      <circle cx="9" cy="14" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="14" r="1.5" fill="currentColor" stroke="none" />
      <path d="M12 2v4" />
      <circle cx="12" cy="2" r="1" fill="currentColor" stroke="none" />
      <path d="M3 14h2" />
      <path d="M19 14h2" />
    </Icon>
  );
}

export function CircuitIcon(props) {
  return (
    <Icon {...props}>
      <path d="M2 12h6" />
      <path d="M16 12h6" />
      <rect x="8" y="8" width="8" height="8" rx="1" />
      <circle cx="12" cy="12" r="2" />
    </Icon>
  );
}

export function LightbulbIcon(props) {
  return (
    <Icon {...props}>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </Icon>
  );
}

export function WrenchIcon(props) {
  return (
    <Icon {...props}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" />
    </Icon>
  );
}

export function BookIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </Icon>
  );
}

export function CameraIcon(props) {
  return (
    <Icon {...props}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" />
      <circle cx="12" cy="13" r="4" />
    </Icon>
  );
}

export function PrintIcon(props) {
  return (
    <Icon {...props}>
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </Icon>
  );
}

export function StarIcon(props) {
  return (
    <Icon {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </Icon>
  );
}

export function ErrorIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </Icon>
  );
}

export function SuccessIcon(props) {
  return (
    <Icon {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </Icon>
  );
}

export function QuestionIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </Icon>
  );
}

export function SearchIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </Icon>
  );
}

export function WarningIcon(props) {
  return (
    <Icon {...props}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </Icon>
  );
}

export function CloseIcon(props) {
  return (
    <Icon {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </Icon>
  );
}

export function TrophyIcon(props) {
  return (
    <Icon {...props}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </Icon>
  );
}

export function AntennaIcon(props) {
  return (
    <Icon {...props}>
      <path d="M2 12L12 2l10 10" />
      <path d="M12 2v20" />
      <path d="M5 9l7-7 7 7" />
    </Icon>
  );
}

export function LetterIcon(props) {
  return (
    <Icon {...props}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </Icon>
  );
}

export function ScreenshotIcon(props) {
  return (
    <Icon {...props}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" />
      <circle cx="12" cy="13" r="4" />
      <path d="M9 13h6" />
    </Icon>
  );
}

export function HandWaveIcon(props) {
  return (
    <Icon {...props}>
      <path d="M7 11V7a2 2 0 0 1 4 0v2" />
      <path d="M11 9V5a2 2 0 0 1 4 0v4" />
      <path d="M15 7V5a2 2 0 0 1 4 0v6" />
      <path d="M7 11a2 2 0 0 0-4 0v4a8 8 0 0 0 16 0V9" />
    </Icon>
  );
}

export function SettingsIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </Icon>
  );
}

export function RefreshIcon(props) {
  return (
    <Icon {...props}>
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </Icon>
  );
}

export function PartyIcon(props) {
  return (
    <Icon {...props}>
      <path d="M5.8 11.3 2 22l10.7-3.8" />
      <path d="M4 3h.01" />
      <path d="M22 8h.01" />
      <path d="M15 2h.01" />
      <path d="M22 20h.01" />
      <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" />
      <path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.18.95-1.2 1.45-2.06 1.02l-.01-.01a1.68 1.68 0 0 0-2.27.77v0c-.42.78-1.53.98-2.2.38l-.01-.01" />
    </Icon>
  );
}

export function FlaskIcon(props) {
  return (
    <Icon {...props}>
      <path d="M9 2h6" />
      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
    </Icon>
  );
}

export function FootprintsIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16" />
      <path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20" />
      <path d="M2 17h6" /><path d="M16 21h6" />
    </Icon>
  );
}

export function RouteIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="6" cy="19" r="3" /><circle cx="18" cy="5" r="3" />
      <path d="M12 19h4.5a3.5 3.5 0 0 0 0-7h-9a3.5 3.5 0 0 1 0-7H12" />
    </Icon>
  );
}

// ─── Component-type icons for simulator step guides ───

export function ResistorIcon(props) {
  return (
    <Icon {...props}>
      <path d="M2 12h4l1.5-4 3 8 3-8 3 8 1.5-4h4" />
    </Icon>
  );
}

export function LedIcon(props) {
  return (
    <Icon {...props}>
      <path d="M9 18h6" /><path d="M10 22h4" />
      <path d="M12 2a6 6 0 0 0-6 6c0 3.5 2.5 6 6 10 3.5-4 6-6.5 6-10a6 6 0 0 0-6-6z" />
    </Icon>
  );
}

export function ButtonIcon(props) {
  return (
    <Icon {...props}>
      <rect x="4" y="8" width="16" height="8" rx="2" />
      <path d="M8 8V6a4 4 0 0 1 8 0v2" />
    </Icon>
  );
}

export function BuzzerIcon(props) {
  return (
    <Icon {...props}>
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </Icon>
  );
}

export function CapacitorIcon(props) {
  return (
    <Icon {...props}>
      <path d="M2 12h7M15 12h7" />
      <path d="M9 6v12M15 6v12" />
    </Icon>
  );
}

export function MotorIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8M8 12h8" />
      <text x="12" y="14" textAnchor="middle" fontSize="6" fill="currentColor" stroke="none" fontWeight="700">M</text>
    </Icon>
  );
}

export function PotentiometerIcon(props) {
  return (
    <Icon {...props}>
      <path d="M2 12h4l1.5-4 3 8 3-8 3 8 1.5-4h4" />
      <path d="M12 2l-2 6h4l-2-6z" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function PhotoresistorIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="6" />
      <path d="M4 4l3 3M4 20l3-3M20 4l-3 3M20 20l-3-3" />
    </Icon>
  );
}

export function DiodeIcon(props) {
  return (
    <Icon {...props}>
      <path d="M2 12h6M16 12h6" />
      <polygon points="8,6 16,12 8,18" fill="none" stroke="currentColor" />
      <path d="M16 6v12" />
    </Icon>
  );
}

export function ServoIcon(props) {
  return (
    <Icon {...props}>
      <rect x="4" y="8" width="12" height="10" rx="1" />
      <circle cx="10" cy="6" r="2" />
      <path d="M10 4h8" />
    </Icon>
  );
}

export function LcdIcon(props) {
  return (
    <Icon {...props}>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 10h12M6 14h8" />
    </Icon>
  );
}

export function WireIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 12c2-4 6 4 8 0s6 4 8 0" />
    </Icon>
  );
}

export function BatteryIcon(props) {
  return (
    <Icon {...props}>
      <rect x="4" y="6" width="14" height="12" rx="2" />
      <path d="M18 10h2v4h-2" />
      <path d="M8 10v4M11 10v4" />
    </Icon>
  );
}

export function MosfetIcon(props) {
  return (
    <Icon {...props}>
      <path d="M10 4v16" />
      <path d="M14 8v2h6M14 14v2h6M14 11h4" />
      <path d="M6 12h4" />
    </Icon>
  );
}

export function RgbLedIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="10" cy="10" r="4" opacity="0.6" />
      <circle cx="14" cy="10" r="4" opacity="0.6" />
      <circle cx="12" cy="14" r="4" opacity="0.6" />
    </Icon>
  );
}

export function MagnetIcon(props) {
  return (
    <Icon {...props}>
      <path d="M6 4h4v10a2 2 0 1 0 4 0V4h4v10a6 6 0 1 1-12 0V4z" />
    </Icon>
  );
}

export function PuzzleIcon(props) {
  return (
    <Icon {...props}>
      <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.611a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877L2.704 13.55A2.403 2.403 0 0 1 2 11.845c0-.617.236-1.234.706-1.704L4.317 8.53a.979.979 0 0 1 .837-.276c.47.07.802.48.968.925a2.501 2.501 0 1 0 3.214-3.214c-.446-.166-.855-.497-.925-.968a.98.98 0 0 1 .276-.837l1.611-1.611a2.404 2.404 0 0 1 3.408 0l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02z" />
    </Icon>
  );
}
