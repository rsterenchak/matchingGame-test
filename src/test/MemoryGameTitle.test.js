import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('MemoryGameTitle.svg', () => {
  const svgPath = join(__dirname, '../assets/MemoryGameTitle.svg')
  const svgContent = readFileSync(svgPath, 'utf8')

  // The text should be centered at x=225 to align with the cloud body's
  // visual center, matching the balance of the original MatchingGameTitle.svg
  // (which had its text paths centered at ~225).
  it('text elements are centered at x=225 to match cloud body visual center', () => {
    const textMatches = [...svgContent.matchAll(/<text\s[^>]*x="([^"]+)"/g)]
    expect(textMatches.length).toBe(2)
    for (const match of textMatches) {
      expect(Number(match[1])).toBe(225)
    }
  })
})
