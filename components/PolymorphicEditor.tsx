'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEditorConfig } from '@/hooks/useEditorConfig'
import { ProjectType } from '@/lib/types'
import { useEffect, useRef } from 'react'
import { detectScreenplayElement } from '@/lib/screenplay-utils'

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

  // Apply screenplay-specific logic with better detection
  useEffect(() => {
    if (!editor || mode !== 'script') return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        const { state } = editor
        const { from } = state.selection
        
        // Get the current line text
        const $pos = state.doc.resolve(from)
        const textBefore = $pos.parent.textContent
        
        const elementType = detectScreenplayElement(textBefore)
        
        // Apply appropriate styling based on detected element
        if (elementType === 'character') {
          // After a character name, prepare for dialogue
          setTimeout(() => {
            const currentPos = editor.state.selection.from
            const currentPara = editor.state.doc.nodeAt(currentPos - 1)
            if (currentPara) {
              // In a real implementation, we would apply custom node types here
              // For now, we'll use CSS classes
              console.log('CHARACTER detected:', textBefore)
            }
          }, 0)
        } else if (elementType === 'slugline') {
          setTimeout(() => {
            console.log('SLUGLINE detected:', textBefore)
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
      
      {/* Info overlay for screenplay mode */}
      {mode === 'script' && !zenMode && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white text-xs px-4 py-2 rounded shadow-lg opacity-50 hover:opacity-100 transition-opacity">
          <div className="font-semibold mb-1">Fountain Syntax Tips:</div>
          <div>• INT./EXT. = Scene Heading</div>
          <div>• ALL CAPS = Character Name</div>
          <div>• (parenthetical) = Parenthetical</div>
        </div>
      )}
    </div>
  )
}

function getPlaceholderContent(mode: ProjectType): string {
  switch (mode) {
    case 'novel':
      return '<p>Chapter One</p><p>The story begins here...</p>'
    case 'script':
      return '<p>FADE IN:</p><p></p><p>INT. COFFEE SHOP - DAY</p><p></p><p>A cozy neighborhood cafe. Morning light streams through the windows.</p><p></p><p>SARAH</p><p>I never expected to find you here.</p>'
    case 'poem':
      return '<p>A single line of verse</p><p>Another line of verse</p><p></p><p>A new stanza begins</p>'
    default:
      return '<p></p>'
  }
}
