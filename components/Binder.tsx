'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown, FileText, Folder, FolderOpen, Plus, Trash2 } from 'lucide-react'

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
    <div className="h-full flex flex-col bg-white">
      <div className="px-4 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">The Binder</h2>
        <p className="text-xs text-gray-500 mt-1">Organize your work</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {/* Manuscript Folder */}
        <div className="mb-2">
          <button
            onClick={() => toggleFolder('manuscript')}
            className="flex items-center gap-2 w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors group"
          >
            {expandedFolders.has('manuscript') ? (
              <>
                <ChevronDown size={16} className="text-gray-500" />
                <FolderOpen size={18} className="text-blue-500" />
              </>
            ) : (
              <>
                <ChevronRight size={16} className="text-gray-500" />
                <Folder size={18} className="text-blue-500" />
              </>
            )}
            <span className="font-medium text-gray-900 flex-1">Manuscript</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                // Add file logic
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded"
            >
              <Plus size={14} />
            </button>
          </button>
          {expandedFolders.has('manuscript') && (
            <div className="ml-8 mt-1 space-y-1">
              <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer text-sm group">
                <FileText size={16} className="text-gray-400" />
                <span className="flex-1">Chapter 1</span>
                <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded">
                  <Trash2 size={12} className="text-gray-500" />
                </button>
              </div>
              <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer text-sm group">
                <FileText size={16} className="text-gray-400" />
                <span className="flex-1">Chapter 2</span>
                <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded">
                  <Trash2 size={12} className="text-gray-500" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Research Folder */}
        <div className="mb-2">
          <button
            onClick={() => toggleFolder('research')}
            className="flex items-center gap-2 w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors group"
          >
            {expandedFolders.has('research') ? (
              <>
                <ChevronDown size={16} className="text-gray-500" />
                <FolderOpen size={18} className="text-green-500" />
              </>
            ) : (
              <>
                <ChevronRight size={16} className="text-gray-500" />
                <Folder size={18} className="text-green-500" />
              </>
            )}
            <span className="font-medium text-gray-900 flex-1">Research</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                // Add file logic
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded"
            >
              <Plus size={14} />
            </button>
          </button>
          {expandedFolders.has('research') && (
            <div className="ml-8 mt-1">
              <div className="p-2 text-sm text-gray-400 italic">
                No research files yet
              </div>
            </div>
          )}
        </div>

        {/* Junkyard Folder */}
        <div className="mb-2">
          <button
            onClick={() => toggleFolder('junkyard')}
            className="flex items-center gap-2 w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors group"
          >
            {expandedFolders.has('junkyard') ? (
              <>
                <ChevronDown size={16} className="text-gray-500" />
                <FolderOpen size={18} className="text-orange-500" />
              </>
            ) : (
              <>
                <ChevronRight size={16} className="text-gray-500" />
                <Folder size={18} className="text-orange-500" />
              </>
            )}
            <span className="font-medium text-gray-900 flex-1">The Junkyard</span>
          </button>
          {expandedFolders.has('junkyard') && (
            <div className="ml-8 mt-1">
              <div className="p-2 text-sm text-gray-400 italic">
                Deleted scenes appear here
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add New Button */}
      <div className="p-3 border-t border-gray-200">
        <button className="w-full px-4 py-2.5 text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
          <Plus size={18} />
          New File
        </button>
      </div>
    </div>
  )
}
