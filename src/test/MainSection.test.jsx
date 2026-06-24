import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const source = readFileSync(resolve(__dirname, '../MainSection.jsx'), 'utf8')

describe('Background music volume', () => {
  it('defaults the music volume to ~0.009 when no saved value exists', () => {
    // The fallback after the localStorage lookup is the hardcoded default volume.
    const match = source.match(/parseFloat\(saved\)\s*:\s*([0-9.]+)/)
    expect(match).not.toBeNull()
    const fallback = parseFloat(match[1])
    expect(fallback).toBeCloseTo(0.009, 4)
  })

  it('passes the same volume to both pages so home and play tracks match', () => {
    // The previous play-page halving (isVolume * 0.5) is removed so both pages match.
    expect(source).not.toMatch(/isVolume\s*\*\s*0\.5/)
  })

  it('wires volumeLevel={isVolume} into all four Handle*Audio helpers', () => {
    const occurrences = source.match(/volumeLevel=\{isVolume\}/g) || []
    expect(occurrences.length).toBe(4)
  })
})
