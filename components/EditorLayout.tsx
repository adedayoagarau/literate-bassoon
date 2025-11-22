'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProjectType } from '@/lib/types'
import PolymorphicEditor from './PolymorphicEditor'
import Binder from './Binder'
import Toolkit from './Toolkit'

export default function EditorLayout() {
  const [zenMode, setZenMode] = useState(false)
  const [projectType, setProjectType] = useState<ProjectType>('novel')
  const [showBinder, setShowBinder] = useState(true)
  const [showToolkit, setShowToolkit] = useState(false)

  return (
    <div className={`h-screen flex ${zenMode ? 'bg-paper' : 'bg-gray-100'}`}>
      {/* Left Panel - Binder */}
      <AnimatePresence>
        {showBinder && !zenMode && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-64 border-r border-gray-300 bg-white"
          >
            <Binder />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Top Bar - Hidden unless hovered in zen mode */}
        <div
          className={`${
            zenMode ? 'absolute top-0 left-0 right-0 z-10 opacity-0 hover:opacity-100' : ''
          } transition-opacity duration-300`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-white">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowBinder(!showBinder)}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                title="Toggle Binder"
              >
                📁
              </button>
              
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value as ProjectType)}
                className="px-3 py-1 text-sm border border-gray-300 rounded bg-white"
              >
                <option value="novel">Novel</option>
                <option value="script">Screenplay</option>
                <option value="poem">Poetry</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowToolkit(!showToolkit)}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                title="Toggle Toolkit"
              >
                🔧
              </button>
              
              <button
                onClick={() => setZenMode(!zenMode)}
                className={`px-4 py-1 text-sm rounded ${
                  zenMode
                    ? 'bg-ink text-paper border border-ink'
                    : 'border border-gray-300 hover:bg-gray-100'
                }`}
                title="Zen Mode"
              >
                {zenMode ? '✏️ Zen' : '✏️'}
              </button>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <PolymorphicEditor mode={projectType} zenMode={zenMode} />
        </div>
      </div>

      {/* Right Panel - Toolkit */}
      <AnimatePresence>
        {showToolkit && !zenMode && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-80 border-l border-gray-300 bg-white"
          >
            <Toolkit />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
