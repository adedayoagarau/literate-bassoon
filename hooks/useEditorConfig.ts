import { useMemo } from 'react'
import { EditorConfig, ProjectType } from '@/lib/types'

export function useEditorConfig(mode: ProjectType): EditorConfig {
  return useMemo(() => {
    switch (mode) {
      case 'novel':
        // Standard Manuscript Format
        return {
          mode: 'novel',
          fontFamily: 'Times New Roman, serif',
          fontSize: '12pt',
          lineHeight: '2',
          formatting: {
            autoCapitalize: true,
            autoIndent: true,
            preserveWhitespace: false,
            doubleSpaced: true,
          },
        }
      case 'script':
        // Fountain/Screenplay Format
        return {
          mode: 'script',
          fontFamily: 'Courier, Courier New, monospace',
          fontSize: '12pt',
          lineHeight: '1.5',
          formatting: {
            autoCapitalize: false, // Manual control for CHARACTER names
            autoIndent: false,
            preserveWhitespace: true,
            doubleSpaced: false,
          },
        }
      case 'poem':
        // Poetry Format - Absolute freedom
        return {
          mode: 'poem',
          fontFamily: 'Crimson Text, serif',
          fontSize: '14pt',
          lineHeight: '1.8',
          formatting: {
            autoCapitalize: false,
            autoIndent: false,
            preserveWhitespace: true,
            doubleSpaced: false,
          },
        }
      default:
        return {
          mode: 'novel',
          fontFamily: 'Times New Roman, serif',
          fontSize: '12pt',
          lineHeight: '2',
          formatting: {
            autoCapitalize: true,
            autoIndent: true,
            preserveWhitespace: false,
            doubleSpaced: true,
          },
        }
    }
  }, [mode])
}
