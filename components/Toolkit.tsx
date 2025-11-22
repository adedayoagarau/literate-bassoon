'use client'

import { useState } from 'react'

type ToolkitTab = 'rhyme' | 'thesaurus' | 'grammar'

export default function Toolkit() {
  const [activeTab, setActiveTab] = useState<ToolkitTab>('thesaurus')
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-300">
        <h2 className="text-lg font-semibold text-gray-800">The Toolkit</h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-300">
        <button
          onClick={() => setActiveTab('thesaurus')}
          className={`flex-1 px-4 py-2 text-sm ${
            activeTab === 'thesaurus'
              ? 'bg-white border-b-2 border-gray-800 font-semibold'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          Thesaurus
        </button>
        <button
          onClick={() => setActiveTab('rhyme')}
          className={`flex-1 px-4 py-2 text-sm ${
            activeTab === 'rhyme'
              ? 'bg-white border-b-2 border-gray-800 font-semibold'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          Rhyme
        </button>
        <button
          onClick={() => setActiveTab('grammar')}
          className={`flex-1 px-4 py-2 text-sm ${
            activeTab === 'grammar'
              ? 'bg-white border-b-2 border-gray-800 font-semibold'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          }`}
        >
          Grammar
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search ${activeTab}...`}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'thesaurus' && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              {searchTerm ? (
                <>
                  <p className="font-semibold mb-2">Synonyms for "{searchTerm}":</p>
                  <p className="text-gray-500 italic">
                    Local thesaurus lookup would appear here
                  </p>
                </>
              ) : (
                <p className="text-gray-500 italic">Enter a word to find synonyms</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'rhyme' && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              {searchTerm ? (
                <>
                  <p className="font-semibold mb-2">Rhymes with "{searchTerm}":</p>
                  <p className="text-gray-500 italic">
                    Local rhyme dictionary results would appear here
                  </p>
                </>
              ) : (
                <p className="text-gray-500 italic">Enter a word to find rhymes</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'grammar' && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              <p className="font-semibold mb-2">Grammar Check</p>
              <p className="text-gray-500 italic">
                LanguageTool integration would appear here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
