'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar, Menu, Eye, EyeOff, Save, Cloud } from 'lucide-react'
import { ProjectType } from '@/lib/types'
import { StateManager } from '@/lib/state-manager'
import { AppState, DEFAULT_SETTINGS } from '@/lib/settings'
import PolymorphicEditor from './PolymorphicEditor'
import Binder from './Binder'
import Toolkit from './Toolkit'
import FormattingToolbar from './FormattingToolbar'
import FocusModeDialog from './FocusModeDialog'

export default function EditorLayout() {
  const [state, setState] = useState<AppState | null>(null)
  const [zenMode, setZenMode] = useState(false)
  const [showBinder, setShowBinder] = useState(true)
  const [showToolkit, setShowToolkit] = useState(false)
  const [showFocusDialog, setShowFocusDialog] = useState(false)
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

  if (!state) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading Typefoundry...</p>
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

  const handleFocusModeStart = (duration: number) => {
    setState({
      ...state,
      focusMode: {
        enabled: true,
        duration,
        startTime: Date.now(),
      },
    })
    setZenMode(true)
    setShowFocusDialog(false)
  }

  const handleFocusModeToggle = () => {
    if (state.focusMode.enabled) {
      setState({
        ...state,
        focusMode: {
          ...state.focusMode,
          enabled: false,
        },
      })
      if (document.fullscreenElement) {
        document.exitFullscreen()
      }
    } else {
      setShowFocusDialog(true)
    }
  }

  const handleCloudSync = async () => {
    setSaveStatus('saving')
    const manager = StateManager.getInstance()
    await manager.syncToCloud(state)
    setSaveStatus('saved')
  }

  return (
    <div className={`h-screen flex flex-col ${zenMode ? 'bg-paper' : 'bg-gray-50'}`}>
      {/* Top Navigation Bar */}
      {!zenMode && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-3">
              {/* Logo/Title */}
              <h1 className="text-xl font-bold text-gray-900">Typefoundry</h1>
              
              {/* Mode Selector */}
              <div className="flex items-center gap-1 ml-4">
                {(['novel', 'script', 'poem'] as ProjectType[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => handleModeChange(mode)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      currentMode === mode
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {mode === 'novel' && '📚 Novel'}
                    {mode === 'script' && '🎬 Screenplay'}
                    {mode === 'poem' && '📝 Poetry'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Save Status */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mr-2">
                {saveStatus === 'saving' && (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                )}
                {saveStatus === 'saved' && (
                  <>
                    <Save size={16} className="text-green-600" />
                    <span>Saved</span>
                  </>
                )}
                {saveStatus === 'unsaved' && (
                  <span className="text-orange-600">Unsaved changes</span>
                )}
              </div>

              {/* Cloud Sync Button */}
              <button
                onClick={handleCloudSync}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Sync to Cloud"
              >
                <Cloud size={20} />
              </button>

              {/* Toggle Binder */}
              <button
                onClick={() => setShowBinder(!showBinder)}
                className={`p-2 rounded-lg transition-colors ${
                  showBinder ? 'bg-gray-100' : 'hover:bg-gray-100'
                }`}
                title="Toggle Sidebar"
              >
                <Sidebar size={20} />
              </button>

              {/* Toggle Toolkit */}
              <button
                onClick={() => setShowToolkit(!showToolkit)}
                className={`p-2 rounded-lg transition-colors ${
                  showToolkit ? 'bg-gray-100' : 'hover:bg-gray-100'
                }`}
                title="Toggle Toolkit"
              >
                <Menu size={20} />
              </button>

              {/* Zen Mode */}
              <button
                onClick={() => setZenMode(!zenMode)}
                className={`px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  zenMode
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                title="Zen Mode"
              >
                {zenMode ? <EyeOff size={18} /> : <Eye size={18} />}
                <span className="text-sm">Zen</span>
              </button>
            </div>
          </div>

          {/* Formatting Toolbar */}
          <FormattingToolbar
            settings={currentModeState.settings}
            onSettingsChange={handleSettingsChange}
            onFocusModeToggle={handleFocusModeToggle}
            focusModeEnabled={state.focusMode.enabled}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Binder */}
        <AnimatePresence>
          {showBinder && !zenMode && (
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-72 border-r border-gray-200 bg-white"
            >
              <Binder />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <PolymorphicEditor
            mode={currentMode}
            zenMode={zenMode}
            content={currentModeState.content}
            settings={currentModeState.settings}
            onContentChange={handleContentChange}
          />
        </div>

        {/* Right Panel - Toolkit */}
        <AnimatePresence>
          {showToolkit && !zenMode && (
            <motion.div
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-80 border-l border-gray-200 bg-white"
            >
              <Toolkit />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Zen Mode Overlay - Shows on hover */}
      {zenMode && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 0, y: -20 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 z-50"
        >
          <button
            onClick={() => setZenMode(false)}
            className="px-4 py-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
          >
            <Eye size={18} />
            <span className="text-sm font-medium">Exit Zen Mode</span>
          </button>
        </motion.div>
      )}

      {/* Focus Mode Dialog */}
      <FocusModeDialog
        isOpen={showFocusDialog}
        onClose={() => setShowFocusDialog(false)}
        onStart={handleFocusModeStart}
        currentDuration={state.focusMode.duration}
        isActive={state.focusMode.enabled}
      />
    </div>
  )
}
