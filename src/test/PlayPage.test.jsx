import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import PlayPage from '../PlayPage.jsx'

const __dirname = dirname(fileURLToPath(import.meta.url))
const css = readFileSync(resolve(__dirname, '../style.css'), 'utf8')

describe('PlayPage background layout', () => {
  it('playSection base rule uses min-height: 100dvh so the background fills the full dynamic viewport without white strips on mobile', () => {
    // Extract the first (base) .playSection rule — the one before any @media block
    const baseRuleMatch = css.match(/\.playSection\s*\{([^}]+)\}/)
    expect(baseRuleMatch).not.toBeNull()
    const baseRule = baseRuleMatch[1]
    expect(baseRule).toContain('min-height: 100dvh')
    // Must not use bare `height: 100vh` (without min-) as that misaligns on mobile Safari
    expect(baseRule).not.toMatch(/^\s*height:\s*100vh\b/m)
  })

  it('playSection base rule includes -webkit-fill-available fallback so older iOS Safari fills the visible area below the browser chrome', () => {
    const baseRuleMatch = css.match(/\.playSection\s*\{([^}]+)\}/)
    expect(baseRuleMatch).not.toBeNull()
    const baseRule = baseRuleMatch[1]
    expect(baseRule).toContain('-webkit-fill-available')
  })
})

describe('PlayPage instructions modal', () => {
  const defaultProps = {
    background: 'fake-bg.jpg',
    setHomePage: vi.fn(),
    setAudioPause: vi.fn(),
    setAudioPlay: vi.fn(),
    activeCurrentAudio: false,
    isActiveData: [],
    isVolume: 0.5,
    onVolumeChange: vi.fn(),
  }

  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    localStorage.clear()
  })

  it('shows instructions modal on every mount even when matchingGame_seenInstructions is already set in localStorage', () => {
    localStorage.setItem('matchingGame_seenInstructions', 'true')
    render(<PlayPage {...defaultProps} />)
    expect(screen.getByText('How to Play')).toBeInTheDocument()
  })

  it('does not close instructions modal on backdrop click within the touch-guard period', () => {
    render(<PlayPage {...defaultProps} />)
    fireEvent.click(document.querySelector('.instructionsBackdrop'))
    expect(screen.getByText('How to Play')).toBeInTheDocument()
  })

  it('closes instructions modal on backdrop click after touch-guard period elapses', () => {
    render(<PlayPage {...defaultProps} />)
    act(() => vi.advanceTimersByTime(400))
    fireEvent.click(document.querySelector('.instructionsBackdrop'))
    expect(screen.queryByText('How to Play')).not.toBeInTheDocument()
  })
})
