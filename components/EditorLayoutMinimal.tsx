'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ProjectType } from '@/lib/types'
import { StateManager } from '@/lib/state-manager'
import { AppState } from '@/lib/settings'
import PolymorphicEditor from './PolymorphicEditor'
import HistorySidebar from './HistorySidebar'

export default function EditorLayout() {
  const [state, setState] = useState<AppState | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [timerDuration, setTimerDuration] = useState(15) // minutes
  const [timerRemaining, setTimerRemaining] = useState(0) // seconds
  const [timerRunning, setTimerRunning] = useState(false)
  const [bottomBarOpacity, setBottomBarOpacity] = useState(1)
  const [isHoveringBottomBar, setIsHoveringBottomBar] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')

  // Initialize state
  useEffect(() => {
    const manager = StateManager.getInstance()
    const initialState = manager.getInitialState()
    setState(initialState)
  }, [])

  // Auto-save to localStorage
  useEffect(() => {
    if (!state) return

    const manager = StateManager.getInstance()
    const timeoutId = setTimeout(() => {
      setSaveStatus('saving')
      manager.saveToLocal(state)
      setTimeout(() => setSaveStatus('saved'), 500)
    }, 1000)

    setSaveStatus('unsaved')
    return () => clearTimeout(timeoutId)
  }, [state])

  // Timer countdown
  useEffect(() => {
    if (!timerRunning || timerRemaining <= 0) return

    const interval = setInterval(() => {
      setTimerRemaining(prev => {
        if (prev <= 1) {
          setTimerRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timerRunning, timerRemaining])

  // Fade bottom bar when timer is running
  useEffect(() => {
    if (timerRunning && !isHoveringBottomBar) {
      const fadeTimeout = setTimeout(() => {
        setBottomBarOpacity(0)
      }, 3000)
      return () => clearTimeout(fadeTimeout)
    } else {
      setBottomBarOpacity(1)
    }
  }, [timerRunning, isHoveringBottomBar])

  if (!state) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  const currentMode = state.currentMode
  const currentModeState = state[currentMode]

  const handleModeChange = (newMode: ProjectType) => {
    setState({
      ...state,
      currentMode: newMode,
    })
  }

  const handleSettingsChange = (newSettings: Partial<typeof currentModeState.settings>) => {
    setState({
      ...state,
      [currentMode]: {
        ...currentModeState,
        settings: {
          ...currentModeState.settings,
          ...newSettings,
        },
      },
    })
  }

  const handleContentChange = (newContent: string) => {
    setState({
      ...state,
      [currentMode]: {
        ...currentModeState,
        content: newContent,
      },
    })
  }

  const handleTimerToggle = () => {
    if (!timerRunning) {
      setTimerRemaining(timerDuration * 60)
      setTimerRunning(true)
    } else {
      setTimerRunning(false)
    }
  }

  const handleTimerReset = () => {
    setTimerRemaining(timerDuration * 60)
    setTimerRunning(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const cycleFontSize = () => {
    const sizes = [16, 18, 20, 22, 24, 26]
    const currentIndex = sizes.indexOf(currentModeState.settings.fontSize)
    const nextIndex = (currentIndex + 1) % sizes.length
    handleSettingsChange({ fontSize: sizes[nextIndex] })
  }

  return (
    <div className="h-screen flex bg-white">
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <PolymorphicEditor
            mode={currentMode}
            zenMode={false}
            content={currentModeState.content}
            settings={currentModeState.settings}
            onContentChange={handleContentChange}
          />
        </div>

        {/* Bottom Toolbar - Freewrite Style */}
        <div
          className="absolute bottom-0 left-0 right-0 transition-opacity duration-300"
          style={{ opacity: bottomBarOpacity }}
          onMouseEnter={() => setIsHoveringBottomBar(true)}
          onMouseLeave={() => setIsHoveringBottomBar(false)}
        >
          <div className="flex items-center justify-between px-6 py-4 bg-white">
            {/* Left side - Font controls */}
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={cycleFontSize}
                className="text-gray-500 hover:text-black transition-colors"
              >
                {currentModeState.settings.fontSize}px
              </button>

              <span className="text-gray-400">•</span>

              <button
                onClick={() => handleSettingsChange({ fontFamily: 'Lato, -apple-system, sans-serif' })}
                className="text-gray-500 hover:text-black transition-colors"
              >
                Lato
              </button>

              <span className="text-gray-400">•</span>

              <button
                onClick={() => handleSettingsChange({ fontFamily: 'Arial, sans-serif' })}
                className="text-gray-500 hover:text-black transition-colors"
              >
                Arial
              </button>

              <span className="text-gray-400">•</span>

              <button
                onClick={() => handleSettingsChange({ fontFamily: '-apple-system, system-ui, sans-serif' })}
                className="text-gray-500 hover:text-black transition-colors"
              >
                System
              </button>

              <span className="text-gray-400">•</span>

              <button
                onClick={() => handleSettingsChange({ fontFamily: 'Times New Roman, serif' })}
                className="text-gray-500 hover:text-black transition-colors"
              >
                Serif
              </button>

              <span className="text-gray-400">•</span>

              <button
                onClick={() => handleSettingsChange({ fontFamily: 'Courier Prime, monospace' })}
                className="text-gray-500 hover:text-black transition-colors"
              >
                Mono
              </button>
            </div>

            {/* Center - Mode selector */}
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => handleModeChange('novel')}
                className={`px-3 py-1 rounded transition-colors ${
                  currentMode === 'novel'
                    ? 'bg-gray-100 text-black'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                Novel
              </button>
              <button
                onClick={() => handleModeChange('script')}
                className={`px-3 py-1 rounded transition-colors ${
                  currentMode === 'script'
                    ? 'bg-gray-100 text-black'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                Script
              </button>
              <button
                onClick={() => handleModeChange('poem')}
                className={`px-3 py-1 rounded transition-colors ${
                  currentMode === 'poem'
                    ? 'bg-gray-100 text-black'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                Poetry
              </button>
            </div>

            {/* Right side - Utility controls */}
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={handleTimerToggle}
                onDoubleClick={handleTimerReset}
                className={`transition-colors ${
                  timerRunning ? 'text-gray-700' : 'text-gray-500'
                } hover:text-black`}
              >
                {timerRemaining > 0 ? formatTime(timerRemaining) : `${timerDuration}:00`}
              </button>

              <span className="text-gray-400">•</span>

              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-gray-500 hover:text-black transition-colors"
              >
                History
              </button>

              <span className="text-gray-400">•</span>

              <span className="text-xs text-gray-400">
                {saveStatus === 'saved' && 'Saved'}
                {saveStatus === 'saving' && 'Saving...'}
                {saveStatus === 'unsaved' && 'Unsaved'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* History Sidebar - Freewrite Style */}
      <AnimatePresence>
        {showHistory && (
          <HistorySidebar
            entries={[]}
            onClose={() => setShowHistory(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
