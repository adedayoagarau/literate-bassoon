import { AppState, DEFAULT_SETTINGS } from './settings'
import { ProjectType } from './types'

const STORAGE_KEY = 'typefoundry-state'
const CLOUD_SYNC_ENDPOINT = '/api/sync' // Placeholder for future cloud implementation

export class StateManager {
  private static instance: StateManager

  private constructor() {}

  static getInstance(): StateManager {
    if (!StateManager.instance) {
      StateManager.instance = new StateManager()
    }
    return StateManager.instance
  }

  getInitialState(): AppState {
    const stored = this.loadFromLocal()
    if (stored) return stored

    return {
      novel: {
        content: '<p>Chapter One</p><p>The story begins here...</p>',
        settings: DEFAULT_SETTINGS.novel,
        cursorPosition: 0,
      },
      script: {
        content: '<p>FADE IN:</p><p></p><p>INT. COFFEE SHOP - DAY</p><p></p><p>A cozy neighborhood cafe. Morning light streams through the windows.</p><p></p><p>SARAH</p><p>I never expected to find you here.</p>',
        settings: DEFAULT_SETTINGS.script,
        cursorPosition: 0,
      },
      poem: {
        content: '<p>A single line of verse</p><p>Another line of verse</p><p></p><p>A new stanza begins</p>',
        settings: DEFAULT_SETTINGS.poem,
        cursorPosition: 0,
      },
      currentMode: 'novel',
      focusMode: {
        enabled: false,
        duration: 25,
        startTime: null,
      },
    }
  }

  saveToLocal(state: AppState): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (error) {
      console.error('Failed to save state to localStorage:', error)
    }
  }

  loadFromLocal(): AppState | null {
    if (typeof window === 'undefined') return null
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return null
      const parsed = JSON.parse(stored)
      
      // Basic validation
      if (!parsed || typeof parsed !== 'object') return null
      if (!parsed.novel || !parsed.script || !parsed.poem) return null
      if (!parsed.currentMode || !parsed.focusMode) return null
      
      return parsed as AppState
    } catch (error) {
      console.error('Failed to load state from localStorage:', error)
      return null
    }
  }

  async syncToCloud(state: AppState): Promise<void> {
    // Placeholder for cloud sync functionality
    // This will be implemented when backend is ready
    try {
      // await fetch(CLOUD_SYNC_ENDPOINT, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(state),
      // })
      console.log('Cloud sync not yet implemented')
    } catch (error) {
      console.error('Failed to sync to cloud:', error)
    }
  }

  async loadFromCloud(): Promise<AppState | null> {
    // Placeholder for cloud load functionality
    try {
      // const response = await fetch(CLOUD_SYNC_ENDPOINT)
      // if (response.ok) {
      //   return await response.json()
      // }
      console.log('Cloud load not yet implemented')
      return null
    } catch (error) {
      console.error('Failed to load from cloud:', error)
      return null
    }
  }

  clearLocal(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEY)
  }
}
