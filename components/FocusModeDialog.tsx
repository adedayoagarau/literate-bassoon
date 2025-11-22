'use client'

import { useState, useEffect } from 'react'
import { X, Clock, Play, Pause, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FocusModeDialogProps {
  isOpen: boolean
  onClose: () => void
  onStart: (duration: number) => void
  currentDuration: number
  isActive: boolean
}

const PRESET_DURATIONS = [
  { label: '15 min', value: 15 },
  { label: '25 min', value: 25 },
  { label: '45 min', value: 45 },
  { label: '1 hour', value: 60 },
  { label: '2 hours', value: 120 },
]

export default function FocusModeDialog({
  isOpen,
  onClose,
  onStart,
  currentDuration,
  isActive,
}: FocusModeDialogProps) {
  const [duration, setDuration] = useState(currentDuration || 25)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (!isActive || isPaused) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, isPaused])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStart = () => {
    setTimeRemaining(duration * 60)
    onStart(duration)
    
    // Request fullscreen for true focus mode (optional - user can decline)
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log('Fullscreen declined or not available:', err)
        // Continue with focus mode even without fullscreen
      })
    }
  }

  const handleReset = () => {
    setTimeRemaining(duration * 60)
    setIsPaused(false)
  }

  const progressPercentage = isActive && timeRemaining > 0
    ? ((duration * 60 - timeRemaining) / (duration * 60)) * 100
    : 0

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="text-blue-600" size={20} />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Focus Mode</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {!isActive ? (
                <>
                  <p className="text-gray-600 mb-6">
                    Set a timer and enter fullscreen mode for distraction-free writing.
                  </p>

                  {/* Preset Buttons */}
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {PRESET_DURATIONS.map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() => setDuration(preset.value)}
                        className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                          duration === preset.value
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Custom Duration */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="480"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value) || 25)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Start Button */}
                  <button
                    onClick={handleStart}
                    className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Play size={20} />
                    Start Focus Session
                  </button>
                </>
              ) : (
                <>
                  {/* Active Timer Display */}
                  <div className="text-center mb-6">
                    <div className="text-6xl font-bold text-gray-900 mb-2">
                      {formatTime(timeRemaining)}
                    </div>
                    <p className="text-gray-600">
                      {Math.floor(timeRemaining / 60)} minutes remaining
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-1000"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsPaused(!isPaused)}
                      className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {isPaused ? <Play size={20} /> : <Pause size={20} />}
                      {isPaused ? 'Resume' : 'Pause'}
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <RotateCcw size={20} />
                      Reset
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 text-sm text-gray-600">
              <p>💡 Tip: Focus mode will request fullscreen access for an immersive experience.</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
