export type SkinTone = 'light' | 'medium-light' | 'medium' | 'medium-dark' | 'dark'
export type HairColor = 'blonde' | 'red' | 'brown' | 'black' | 'auburn'
export type HairStyle = 'straight' | 'wavy' | 'curly' | 'coily' | 'braided'
export type EyeColor = 'blue' | 'green' | 'brown' | 'hazel' | 'gray'

export interface CharacterAppearance {
  skinTone: SkinTone
  hairColor: HairColor
  hairStyle: HairStyle
  eyeColor: EyeColor
}

export interface PersonalizationConfig {
  childName: string
  appearance: CharacterAppearance
}

export const SKIN_TONES: Record<SkinTone, { label: string; hex: string }> = {
  light:         { label: 'Light',        hex: '#FDDBB4' },
  'medium-light':{ label: 'Medium Light', hex: '#F5C090' },
  medium:        { label: 'Medium',       hex: '#D4956A' },
  'medium-dark': { label: 'Medium Dark',  hex: '#A0674A' },
  dark:          { label: 'Dark',         hex: '#5C3D2E' },
}

export const HAIR_COLORS: Record<HairColor, { label: string; hex: string }> = {
  blonde: { label: 'Blonde', hex: '#F5D77E' },
  red:    { label: 'Red',    hex: '#B83232' },
  brown:  { label: 'Brown',  hex: '#6B3A2A' },
  black:  { label: 'Black',  hex: '#2A1A0E' },
  auburn: { label: 'Auburn', hex: '#8B2500' },
}

export const HAIR_STYLES: Record<HairStyle, { label: string }> = {
  straight: { label: 'Straight' },
  wavy:     { label: 'Wavy'     },
  curly:    { label: 'Curly'    },
  coily:    { label: 'Coily'    },
  braided:  { label: 'Braided'  },
}

export const EYE_COLORS: Record<EyeColor, { label: string; hex: string }> = {
  blue:  { label: 'Blue',  hex: '#4A90D9' },
  green: { label: 'Green', hex: '#27AE60' },
  brown: { label: 'Brown', hex: '#795548' },
  hazel: { label: 'Hazel', hex: '#8D6E63' },
  gray:  { label: 'Gray',  hex: '#78909C' },
}
