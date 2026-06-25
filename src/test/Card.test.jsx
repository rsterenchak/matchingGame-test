import { render, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import Card from '../Card.jsx'

const __dirname = dirname(fileURLToPath(import.meta.url))
const css = readFileSync(resolve(__dirname, '../style.css'), 'utf8')

// Minimal props for a face-up Card. The click handlers aren't exercised by the
// hover tests, so the game-state setters can be no-ops.
function makeProps(overrides = {}) {
  return {
    item: { id: 1, name: 'Goku', image: 'goku.png' },
    shuffleNow: vi.fn(),
    isPickedArray: [],
    setPickedArray: vi.fn(),
    isShown: [],
    isScore: 0,
    setScore: vi.fn(),
    isPopUp: false,
    setPopUp: vi.fn(),
    style: { cursor: 'pointer' },
    isHighScore: 0,
    setHighScore: vi.fn(),
    startInitialTurn: vi.fn(),
    isPositions: [],
    setPositions: vi.fn(),
    isResult: false,
    setResult: vi.fn(),
    ...overrides,
  }
}

function renderCard(overrides) {
  const { container } = render(<Card {...makeProps(overrides)} />)
  return container.querySelector('.card')
}

// jsdom returns a zero-size rect by default; stub a concrete card box so the
// normalized cursor offset math produces real rotation values.
function stubRect(el, rect = { left: 0, top: 0, width: 100, height: 150 }) {
  el.getBoundingClientRect = () => ({
    ...rect,
    right: rect.left + rect.width,
    bottom: rect.top + rect.height,
    x: rect.left,
    y: rect.top,
    toJSON: () => {},
  })
}

afterEach(() => {
  delete window.matchMedia
})

describe('Card 3D tilt on hover', () => {
  it('tilts toward the cursor with a perspective transform on mouse move', () => {
    const card = renderCard()
    stubRect(card)

    fireEvent.mouseMove(card, { clientX: 100, clientY: 150 })

    // Bottom-right corner: offset (1, 1) → rotateX(-15) rotateY(15) at ±15 max.
    expect(card.style.transform).toBe('perspective(600px) rotateX(-15deg) rotateY(15deg)')
  })

  it('produces a flat (zero-rotation) transform when the cursor is at the card center', () => {
    const card = renderCard()
    stubRect(card)

    fireEvent.mouseMove(card, { clientX: 50, clientY: 75 })

    expect(card.style.transform).toBe('perspective(600px) rotateX(0deg) rotateY(0deg)')
  })

  it('resets the transform on mouse leave so the card snaps back flat', () => {
    const card = renderCard()
    stubRect(card)

    fireEvent.mouseMove(card, { clientX: 100, clientY: 150 })
    expect(card.style.transform).not.toBe('')

    fireEvent.mouseLeave(card)
    expect(card.style.transform).toBe('')
  })

  it('does not tilt while the end-game popup is active', () => {
    const card = renderCard({ isPopUp: true })
    stubRect(card)

    fireEvent.mouseMove(card, { clientX: 100, clientY: 150 })

    expect(card.style.transform).toBe('')
  })

  it('preserves the passed-in cursor style alongside the tilt transform', () => {
    const card = renderCard()
    stubRect(card)

    fireEvent.mouseMove(card, { clientX: 100, clientY: 150 })

    expect(card.style.cursor).toBe('pointer')
    expect(card.style.transform).toContain('perspective(600px)')
  })

  it('uses a reduced max rotation (±8deg) at the smallest breakpoint', () => {
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(max-width: 480px)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))

    const card = renderCard()
    stubRect(card)

    fireEvent.mouseMove(card, { clientX: 100, clientY: 150 })

    expect(card.style.transform).toBe('perspective(600px) rotateX(-8deg) rotateY(8deg)')
  })

  it('skips the tilt when the user prefers reduced motion', () => {
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))

    const card = renderCard()
    stubRect(card)

    fireEvent.mouseMove(card, { clientX: 100, clientY: 150 })

    expect(card.style.transform).toBe('')
  })
})

describe('Card tilt CSS', () => {
  it('the base .card rule uses a fast transform transition so the tilt follows the cursor fluidly', () => {
    const baseRuleMatch = css.match(/\.card\s*\{([^}]+)\}/)
    expect(baseRuleMatch).not.toBeNull()
    const baseRule = baseRuleMatch[1]
    expect(baseRule).toMatch(/transition:[^;]*transform\s+0\.1s\s+ease-out/)
  })
})
