export type ProjectType = 'novel' | 'script' | 'poem'

export interface EditorConfig {
  mode: ProjectType
  fontFamily: string
  fontSize: string
  lineHeight: string
  formatting: {
    autoCapitalize: boolean
    autoIndent: boolean
    preserveWhitespace: boolean
    doubleSpaced: boolean
  }
}

export interface Project {
  id: string
  name: string
  type: ProjectType
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface FileTreeItem {
  id: string
  name: string
  type: 'folder' | 'file'
  children?: FileTreeItem[]
  content?: string
}
