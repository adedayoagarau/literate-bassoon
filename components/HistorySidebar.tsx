'use client'

import { motion } from 'framer-motion'

interface Entry {
  id: string
  date: string
  preview: string
}

interface HistorySidebarProps {
  entries: Entry[]
  onClose: () => void
}

export default function HistorySidebar({ entries, onClose }: HistorySidebarProps) {
  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: 'tween', duration: 0.2 }}
      className="w-64 border-l border-gray-200 bg-white flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">History</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </div>
      </div>

      {/* Entries */}
      <div className="flex-1 overflow-y-auto">
        {entries.length === 0 ? (
          <div className="p-4 text-sm text-gray-400 text-center">
            No entries yet
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {entries.map((entry) => (
              <button
                key={entry.id}
                className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="text-sm text-gray-900 truncate mb-1">
                  {entry.preview || 'Untitled'}
                </div>
                <div className="text-xs text-gray-500">{entry.date}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
