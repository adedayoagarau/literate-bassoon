'use client'

import { useState } from 'react'

export default function Binder() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['manuscript', 'research', 'junkyard'])
  )

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-300">
        <h2 className="text-lg font-semibold text-gray-800">The Binder</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {/* Manuscript Folder */}
        <div className="mb-4">
          <button
            onClick={() => toggleFolder('manuscript')}
            className="flex items-center gap-2 w-full text-left hover:bg-gray-100 p-2 rounded"
          >
            <span>{expandedFolders.has('manuscript') ? '📂' : '📁'}</span>
            <span className="font-semibold">Manuscript</span>
          </button>
          {expandedFolders.has('manuscript') && (
            <div className="ml-6 mt-2 space-y-1">
              <div className="p-2 hover:bg-gray-50 rounded cursor-pointer text-sm">
                📄 Chapter 1
              </div>
              <div className="p-2 hover:bg-gray-50 rounded cursor-pointer text-sm">
                📄 Chapter 2
              </div>
            </div>
          )}
        </div>

        {/* Research Folder */}
        <div className="mb-4">
          <button
            onClick={() => toggleFolder('research')}
            className="flex items-center gap-2 w-full text-left hover:bg-gray-100 p-2 rounded"
          >
            <span>{expandedFolders.has('research') ? '📂' : '📁'}</span>
            <span className="font-semibold">Research</span>
          </button>
          {expandedFolders.has('research') && (
            <div className="ml-6 mt-2 space-y-1">
              <div className="p-2 hover:bg-gray-50 rounded cursor-pointer text-sm text-gray-500">
                Empty
              </div>
            </div>
          )}
        </div>

        {/* Junkyard Folder */}
        <div className="mb-4">
          <button
            onClick={() => toggleFolder('junkyard')}
            className="flex items-center gap-2 w-full text-left hover:bg-gray-100 p-2 rounded"
          >
            <span>{expandedFolders.has('junkyard') ? '📂' : '📁'}</span>
            <span className="font-semibold">The Junkyard</span>
          </button>
          {expandedFolders.has('junkyard') && (
            <div className="ml-6 mt-2 space-y-1">
              <div className="p-2 hover:bg-gray-50 rounded cursor-pointer text-sm text-gray-500">
                Deleted scenes appear here
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add New Button */}
      <div className="p-4 border-t border-gray-300">
        <button className="w-full px-4 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-700">
          + New File
        </button>
      </div>
    </div>
  )
}
