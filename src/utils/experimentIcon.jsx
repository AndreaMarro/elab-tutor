/**
 * ExperimentIcon — Maps experiment concept/type to SVG icon
 * Replaces emoji experiment.icon with proper SVG (CLAUDE.md rule #11)
 * © Andrea Marro — 05/04/2026
 */
import React from 'react';
import {
  LedIcon, ResistorIcon, ButtonIcon, BuzzerIcon, CapacitorIcon,
  PotentiometerIcon, PhotoresistorIcon, ServoIcon, LcdIcon,
  MosfetIcon, RgbLedIcon, BatteryIcon, CircuitIcon, WireIcon
} from '../components/common/ElabIcons';

const CONCEPT_ICONS = {
  led: LedIcon,
  resistor: ResistorIcon,
  resistenza: ResistorIcon,
  pulsante: ButtonIcon,
  button: ButtonIcon,
  buzzer: BuzzerIcon,
  condensatore: CapacitorIcon,
  capacitor: CapacitorIcon,
  potenziometro: PotentiometerIcon,
  trimmer: PotentiometerIcon,
  fotoresist: PhotoresistorIcon,
  ldr: PhotoresistorIcon,
  servo: ServoIcon,
  lcd: LcdIcon,
  display: LcdIcon,
  mosfet: MosfetIcon,
  transistor: MosfetIcon,
  rgb: RgbLedIcon,
  batteria: BatteryIcon,
  battery: BatteryIcon,
  arduino: CircuitIcon,
  avr: CircuitIcon,
  serial: CircuitIcon,
  pwm: CircuitIcon,
  analog: PotentiometerIcon,
  digital: LedIcon,
  wire: WireIcon,
  filo: WireIcon,
};

/**
 * Returns a React SVG icon element based on experiment concept/title
 * Falls back to CircuitIcon if no match
 */
export function getExperimentIcon(experiment, size = 18, color = 'currentColor') {
  if (!experiment) return <CircuitIcon size={size} color={color} />;

  const searchText = `${experiment.concept || ''} ${experiment.title || ''}`.toLowerCase();

  for (const [keyword, IconComp] of Object.entries(CONCEPT_ICONS)) {
    if (searchText.includes(keyword)) {
      return <IconComp size={size} color={color} />;
    }
  }

  return <CircuitIcon size={size} color={color} />;
}

export default getExperimentIcon;
