'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Type, AlignLeft, AlignCenter, AlignRight, Clock } from 'lucide-react'
import { FONT_OPTIONS, FONT_SIZE_OPTIONS, LINE_HEIGHT_OPTIONS } from '@/lib/settings'
import type { EditorSettings } from '@/lib/settings'

interface FormattingToolbarProps {
  settings: EditorSettings
  onSettingsChange: (settings: Partial<EditorSettings>) => void
  onFocusModeToggle: () => void
  focusModeEnabled: boolean
}

export default function FormattingToolbar({
  settings,
  onSettingsChange,
  onFocusModeToggle,
  focusModeEnabled,
}: FormattingToolbarProps) {
  const [fontMenuOpen, setFontMenuOpen] = useState(false)
  const [sizeMenuOpen, setSizeMenuOpen] = useState(false)
  const [lineHeightMenuOpen, setLineHeightMenuOpen] = useState(false)
  const fontMenuRef = useRef<HTMLDivElement>(null)
  const sizeMenuRef = useRef<HTMLDivElement>(null)
  const lineHeightMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target
      if (!target) return
      
      if (fontMenuRef.current && !fontMenuRef.current.contains(target as Node)) {
        setFontMenuOpen(false)
      }
      if (sizeMenuRef.current && !sizeMenuRef.current.contains(target as Node)) {
        setSizeMenuOpen(false)
      }
      if (lineHeightMenuRef.current && !lineHeightMenuRef.current.contains(target as Node)) {
        setLineHeightMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentFont = FONT_OPTIONS.find(f => f.value === settings.fontFamily)

  return (
    <div className="flex items-center gap-1 px-3 py-2 bg-white border-b border-gray-200">
      {/* Font Family */}
      <div className="relative" ref={fontMenuRef}>
        <button
          onClick={() => setFontMenuOpen(!fontMenuOpen)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded hover:bg-gray-100 transition-colors"
        >
          <Type size={16} />
          <span className="max-w-[120px] truncate">{currentFont?.label || 'Font'}</span>
          <ChevronDown size={14} />
        </button>
        
        {fontMenuOpen && (
          <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 max-h-64 overflow-y-auto">
            {FONT_OPTIONS.map((font) => (
              <button
                key={font.value}
                onClick={() => {
                  onSettingsChange({ fontFamily: font.value })
                  setFontMenuOpen(false)
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  settings.fontFamily === font.value ? 'bg-gray-100 font-medium' : ''
                }`}
                style={{ fontFamily: font.value }}
              >
                {font.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Font Size */}
      <div className="relative" ref={sizeMenuRef}>
        <button
          onClick={() => setSizeMenuOpen(!sizeMenuOpen)}
          className="flex items-center gap-1 px-3 py-1.5 text-sm rounded hover:bg-gray-100 transition-colors min-w-[60px]"
        >
          <span>{settings.fontSize}pt</span>
          <ChevronDown size={14} />
        </button>
        
        {sizeMenuOpen && (
          <div className="absolute top-full left-0 mt-1 w-24 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 max-h-64 overflow-y-auto">
            {FONT_SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                onClick={() => {
                  onSettingsChange({ fontSize: size })
                  setSizeMenuOpen(false)
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  settings.fontSize === size ? 'bg-gray-100 font-medium' : ''
                }`}
              >
                {size}pt
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Line Height */}
      <div className="relative" ref={lineHeightMenuRef}>
        <button
          onClick={() => setLineHeightMenuOpen(!lineHeightMenuOpen)}
          className="flex items-center gap-1 px-3 py-1.5 text-sm rounded hover:bg-gray-100 transition-colors"
        >
          <span className="text-xs">Line</span>
          <ChevronDown size={14} />
        </button>
        
        {lineHeightMenuOpen && (
          <div className="absolute top-full left-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            {LINE_HEIGHT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onSettingsChange({ lineHeight: option.value })
                  setLineHeightMenuOpen(false)
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  settings.lineHeight === option.value ? 'bg-gray-100 font-medium' : ''
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Text Alignment */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onSettingsChange({ textAlign: 'left' })}
          className={`p-2 rounded hover:bg-gray-100 transition-colors ${
            settings.textAlign === 'left' ? 'bg-gray-100' : ''
          }`}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </button>
        <button
          onClick={() => onSettingsChange({ textAlign: 'center' })}
          className={`p-2 rounded hover:bg-gray-100 transition-colors ${
            settings.textAlign === 'center' ? 'bg-gray-100' : ''
          }`}
          title="Align Center"
        >
          <AlignCenter size={16} />
        </button>
        <button
          onClick={() => onSettingsChange({ textAlign: 'right' })}
          className={`p-2 rounded hover:bg-gray-100 transition-colors ${
            settings.textAlign === 'right' ? 'bg-gray-100' : ''
          }`}
          title="Align Right"
        >
          <AlignRight size={16} />
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Focus Mode Timer */}
      <button
        onClick={onFocusModeToggle}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded transition-colors ${
          focusModeEnabled
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'hover:bg-gray-100'
        }`}
        title="Focus Mode"
      >
        <Clock size={16} />
        <span>Focus</span>
      </button>
    </div>
  )
}
