'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEditorConfig } from '@/hooks/useEditorConfig'
import { ProjectType } from '@/lib/types'
import { useEffect, useRef } from 'react'

interface PolymorphicEditorProps {
  mode: ProjectType
  zenMode: boolean
}

export default function PolymorphicEditor({ mode, zenMode }: PolymorphicEditorProps) {
  const config = useEditorConfig(mode)
  const editorRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        hardBreak: (mode === 'poem' || mode === 'script') ? {} : false,
        paragraph: {
          HTMLAttributes: {
            class: mode === 'novel' ? 'indent-8' : '',
          },
        },
      }),
    ],
    content: getPlaceholderContent(mode),
    editorProps: {
      attributes: {
        class: `prose prose-lg max-w-none focus:outline-none min-h-full px-16 py-12 ${
          mode === 'poem' ? 'whitespace-pre-wrap' : ''
        }`,
        style: `
          font-family: ${config.fontFamily};
          font-size: ${config.fontSize};
          line-height: ${config.lineHeight};
          color: ${zenMode ? '#333' : '#1f2937'};
        `,
      },
    },
  })

  // Implement typewriter scrolling - keep caret centered
  useEffect(() => {
    if (!editor || !editorRef.current) return

    const handleUpdate = () => {
      const { selection } = editor.state
      const coords = editor.view.coordsAtPos(selection.from)
      const container = editorRef.current
      if (!container) return

      const containerRect = container.getBoundingClientRect()
      const targetY = containerRect.height / 2
      const scrollOffset = coords.top - containerRect.top - targetY

      if (Math.abs(scrollOffset) > 10) {
        container.scrollTop += scrollOffset
      }
    }

    editor.on('update', handleUpdate)
    editor.on('selectionUpdate', handleUpdate)

    return () => {
      editor.off('update', handleUpdate)
      editor.off('selectionUpdate', handleUpdate)
    }
  }, [editor])

  // Apply screenplay-specific logic
  useEffect(() => {
    if (!editor || mode !== 'script') return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        const { state } = editor
        const { from } = state.selection
        const currentLine = state.doc.textBetween(
          Math.max(0, from - 100),
          from,
          '\n'
        ).split('\n').pop() || ''

        // Detect screenplay elements
        if (/^[A-Z\s]+$/.test(currentLine.trim()) && currentLine.trim().length > 0) {
          // Previous line was CHARACTER name
          setTimeout(() => {
            const node = editor.state.doc.nodeAt(editor.state.selection.from - 1)
            if (node) {
              // Mark as dialogue (would need custom extension for styling)
            }
          }, 0)
        } else if (/^(INT\.|EXT\.|INT\/EXT\.)/.test(currentLine.trim())) {
          // Previous line was SLUGLINE
          setTimeout(() => {
            const node = editor.state.doc.nodeAt(editor.state.selection.from - 1)
            if (node) {
              // Mark as slugline (would need custom extension for styling)
            }
          }, 0)
        }
      }
    }

    const editorElement = editor.view.dom
    editorElement.addEventListener('keydown', handleKeyDown)

    return () => {
      editorElement.removeEventListener('keydown', handleKeyDown)
    }
  }, [editor, mode])

  return (
    <div
      ref={editorRef}
      className={`h-full overflow-y-auto typewriter-scroll ${
        zenMode ? 'hide-scrollbar bg-paper' : 'bg-white'
      }`}
    >
      <EditorContent editor={editor} />
    </div>
  )
}

function getPlaceholderContent(mode: ProjectType): string {
  switch (mode) {
    case 'novel':
      return '<p>Chapter One</p><p>The story begins here...</p>'
    case 'script':
      return '<p>FADE IN:</p><p></p><p>INT. LOCATION - DAY</p><p></p><p>Description of the scene...</p>'
    case 'poem':
      return '<p>A single line of verse</p><p>Another line of verse</p><p></p><p>A new stanza begins</p>'
    default:
      return '<p></p>'
  }
}
