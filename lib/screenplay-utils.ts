/**
 * Detects the type of screenplay element based on text content
 */
export function detectScreenplayElement(text: string): 
  | 'slugline' 
  | 'character' 
  | 'dialogue' 
  | 'parenthetical' 
  | 'action' 
  | null {
  const trimmed = text.trim()

  // Empty line
  if (!trimmed) {
    return null
  }

  // Slugline detection: INT., EXT., INT/EXT., or INT./EXT.
  if (/^(INT\.|EXT\.|INT\/EXT\.|INT\.\/EXT\.)/.test(trimmed)) {
    return 'slugline'
  }

  // Character name detection: All caps (with optional extension like (V.O.) or (O.S.))
  if (/^[A-Z\s\-']+(\s*\([A-Z.]+\))?$/.test(trimmed) && trimmed.length > 1) {
    return 'character'
  }

  // Parenthetical detection: Wrapped in parentheses
  if (/^\(.+\)$/.test(trimmed)) {
    return 'parenthetical'
  }

  // Default to action
  return 'action'
}

/**
 * Checks if text is a valid character name
 */
export function isCharacterName(text: string): boolean {
  const trimmed = text.trim()
  // Must be all caps, can include spaces, hyphens, apostrophes
  // Can have extensions like (V.O.), (O.S.), (CONT'D)
  return /^[A-Z\s\-']+(\s*\([A-Z.'\s]+\))?$/.test(trimmed) && trimmed.length > 1
}

/**
 * Checks if text is a valid slugline
 */
export function isSlugline(text: string): boolean {
  const trimmed = text.trim()
  return /^(INT\.|EXT\.|INT\/EXT\.|INT\.\/EXT\.)/.test(trimmed)
}

/**
 * Checks if text is a parenthetical
 */
export function isParenthetical(text: string): boolean {
  const trimmed = text.trim()
  return /^\(.+\)$/.test(trimmed)
}
