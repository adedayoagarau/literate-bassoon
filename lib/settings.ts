import { ProjectType } from './types'

export interface EditorSettings {
  fontFamily: string
  fontSize: number
  lineHeight: number
  textAlign: 'left' | 'center' | 'right' | 'justify'
  theme: 'light' | 'dark' | 'paper'
}

export interface ModeState {
  content: string
  settings: EditorSettings
  cursorPosition: number
}

export interface AppState {
  novel: ModeState
  script: ModeState
  poem: ModeState
  currentMode: ProjectType
  focusMode: {
    enabled: boolean
    duration: number // in minutes
    startTime: number | null
  }
}

export const DEFAULT_SETTINGS: Record<ProjectType, EditorSettings> = {
  novel: {
    fontFamily: 'Times New Roman, serif',
    fontSize: 12,
    lineHeight: 2,
    textAlign: 'left',
    theme: 'paper',
  },
  script: {
    fontFamily: 'Courier, monospace',
    fontSize: 12,
    lineHeight: 1.5,
    textAlign: 'left',
    theme: 'paper',
  },
  poem: {
    fontFamily: 'Crimson Text, serif',
    fontSize: 14,
    lineHeight: 1.8,
    textAlign: 'left',
    theme: 'paper',
  },
}

export const FONT_OPTIONS = [
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Courier, monospace', label: 'Courier' },
  { value: 'Courier Prime, monospace', label: 'Courier Prime' },
  { value: 'Crimson Text, serif', label: 'Crimson Text' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Helvetica, sans-serif', label: 'Helvetica' },
  { value: 'Roboto, sans-serif', label: 'Roboto' },
]

export const FONT_SIZE_OPTIONS = [8, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48]

export const LINE_HEIGHT_OPTIONS = [
  { value: 1, label: 'Single' },
  { value: 1.5, label: '1.5' },
  { value: 2, label: 'Double' },
  { value: 2.5, label: '2.5' },
  { value: 3, label: 'Triple' },
]
