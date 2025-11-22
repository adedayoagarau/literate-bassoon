'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { ProjectType } from '@/lib/types'
import { EditorSettings } from '@/lib/settings'
import { useEffect, useRef, useCallback } from 'react'
import { detectScreenplayElement } from '@/lib/screenplay-utils'

interface PolymorphicEditorProps {
  mode: ProjectType
  zenMode: boolean
  content: string
  settings: EditorSettings
  onContentChange: (content: string) => void
}

export default function PolymorphicEditor({
  mode,
  zenMode,
  content,
  settings,
  onContentChange,
}: PolymorphicEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Debounced content change handler
  const debouncedContentChange = useCallback((newContent: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    debounceTimerRef.current = setTimeout(() => {
      onContentChange(newContent)
    }, 300) // 300ms debounce
  }, [onContentChange])

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
    content: content,
    onUpdate: ({ editor }) => {
      debouncedContentChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: `prose prose-lg max-w-none focus:outline-none min-h-full px-16 py-12 ${
          mode === 'poem' ? 'whitespace-pre-wrap' : ''
        }`,
        style: `
          font-family: ${settings.fontFamily};
          font-size: ${settings.fontSize}pt;
          line-height: ${settings.lineHeight};
          text-align: ${settings.textAlign};
          color: ${zenMode ? '#333' : '#1f2937'};
        `,
      },
    },
  })

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

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
        // In a future version, this will apply custom node types
        // For now, the detection is used for potential auto-formatting
        if (elementType === 'character') {
          // After a character name, prepare for dialogue
          // Future: Apply dialogue node type
        } else if (elementType === 'slugline') {
          // After a slugline, prepare for action
          // Future: Apply action node type
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
    <div className="h-full overflow-y-auto bg-white flex justify-center">
      <div className="w-full max-w-[650px] px-8 py-12">
        <EditorContent editor={editor} />
      </div>

      {/* Screenplay tips overlay - subtle */}
      {mode === 'script' && !zenMode && (
        <div className="fixed bottom-20 right-8 text-xs text-gray-400 opacity-50 hover:opacity-100 transition-opacity">
          <div>INT./EXT. = Scene</div>
          <div>ALL CAPS = Character</div>
        </div>
      )}
    </div>
  )
}

