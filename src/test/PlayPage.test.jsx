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

describe('PlayPage score panel', () => {
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

  it('renders a unified scorePanel element instead of two separate score pills', () => {
    render(<PlayPage {...defaultProps} />)
    expect(document.querySelector('.scorePanel')).toBeInTheDocument()
  })

  it('scorePanel shows Score label and Best chip', () => {
    render(<PlayPage {...defaultProps} />)
    expect(screen.getByText('Score')).toBeInTheDocument()
    expect(screen.getByText('Best 0')).toBeInTheDocument()
  })

  it('scorePanel shows the initial score as "0 / 16"', () => {
    render(<PlayPage {...defaultProps} />)
    expect(screen.getByText('0 / 16')).toBeInTheDocument()
  })

  it('scorePanel renders a progress bar element', () => {
    render(<PlayPage {...defaultProps} />)
    expect(document.querySelector('.scorePanelBar')).toBeInTheDocument()
    expect(document.querySelector('.scorePanelBarFill')).toBeInTheDocument()
  })

  it('scorePanelBarFill starts at 0% width when score is 0', () => {
    render(<PlayPage {...defaultProps} />)
    const fill = document.querySelector('.scorePanelBarFill')
    expect(fill.style.width).toBe('0%')
  })
})

describe('PlayPage background fade gradient', () => {
  it('playSection::before applies a linear-gradient overlay using the safari chrome blend color to soften the edge seam', () => {
    const pseudoRuleMatch = css.match(/\.playSection::before\s*\{([^}]+)\}/)
    expect(pseudoRuleMatch).not.toBeNull()
    const pseudoRule = pseudoRuleMatch[1]
    expect(pseudoRule).toContain('linear-gradient')
    expect(pseudoRule.toLowerCase()).toContain('#4a90d9')
  })
})

describe('Desktop layout: score panel pinned to bottom, card grid centered', () => {
  function get961Section() {
    // The play-page 961px block uses double-space before `{`, distinguishing it from the home-page 961px block
    const idx = css.indexOf('@media (min-width:961px)  {')
    const nextMedia = css.indexOf('@media', idx + 1)
    return css.slice(idx, nextMedia)
  }

  it('outerSection2 uses auto 1fr 1fr auto rows at 961px so the score panel sits at the viewport bottom', () => {
    const section = get961Section()
    const match = section.match(/\.outerSection2\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toContain('grid-template-rows: auto 1fr 1fr auto')
  })

  it('outerSection2 sets height to 100dvh at 961px so the grid fills the full viewport', () => {
    const section = get961Section()
    const match = section.match(/\.outerSection2\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toContain('height: 100dvh')
  })

  it('scorePanel has margin: 0 at 961px making it full-bleed at the bottom edge', () => {
    const section = get961Section()
    const match = section.match(/\.scorePanel\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toContain('margin: 0')
  })

  it('logoSection3 aligns to end at 961px so the top card row clusters toward the vertical center', () => {
    const section = get961Section()
    const match = section.match(/\.logoSection3\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toContain('align-self: end')
  })

  it('logoSection4 aligns to start at 961px so the bottom card row clusters toward the vertical center', () => {
    const section = get961Section()
    const match = section.match(/\.logoSection4\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toContain('align-self: start')
  })
})

describe('Mobile layout: score panel at bottom, card grid centered', () => {
  function getMediaSection(minWidth) {
    // Find the play-page mobile block for the given min-width.
    // The play-page mobile blocks use double-space before `{` (e.g. "@media (min-width:320px)  {")
    // while the home-page block uses single-space. Use the doubled-space form for 320/481.
    const marker = minWidth === 641
      ? '@media (min-width:641px)  {'
      : `@media (min-width:${minWidth}px)  {`
    const idx = css.indexOf(marker)
    if (idx === -1) return ''
    const nextMedia = css.indexOf('@media', idx + 1)
    return css.slice(idx, nextMedia === -1 ? undefined : nextMedia)
  }

  it('outerSection2 uses auto 1fr 1fr auto rows at 320px so the card rows expand into available space', () => {
    const section = getMediaSection(320)
    const match = section.match(/\.outerSection2\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toContain('grid-template-rows: auto 1fr 1fr auto')
  })

  it('outerSection2 uses height: 100% at 320px so 1fr rows have a reference height', () => {
    const section = getMediaSection(320)
    const match = section.match(/\.outerSection2\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toContain('height: 100%')
  })

  it('logoSection3 aligns to end at 320px so the top card row clusters toward the vertical center', () => {
    const section = getMediaSection(320)
    const match = section.match(/\.logoSection3\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toContain('align-self: end')
  })

  it('outerSection2 uses auto 1fr 1fr auto rows at 481px', () => {
    const section = getMediaSection(481)
    const match = section.match(/\.outerSection2\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toContain('grid-template-rows: auto 1fr 1fr auto')
  })

  it('logoSection3 aligns to end at 481px', () => {
    const section = getMediaSection(481)
    const match = section.match(/\.logoSection3\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toContain('align-self: end')
  })

  it('outerSection2 uses auto 1fr 1fr auto rows at 641px', () => {
    const section = getMediaSection(641)
    const match = section.match(/\.outerSection2\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toContain('grid-template-rows: auto 1fr 1fr auto')
  })

  it('logoSection3 aligns to end at 641px so the top card row clusters toward the vertical center', () => {
    const section = getMediaSection(641)
    const match = section.match(/\.logoSection3\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toContain('align-self: end')
  })

  it('logoSection4 aligns to start at 641px so the bottom card row clusters toward the vertical center', () => {
    const section = getMediaSection(641)
    const match = section.match(/\.logoSection4\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toContain('align-self: start')
  })
})

describe('Mobile layout: score panel pushed to viewport bottom with safe-area gap', () => {
  function getMediaSection(minWidth) {
    const marker = minWidth === 641
      ? '@media (min-width:641px)  {'
      : `@media (min-width:${minWidth}px)  {`
    const idx = css.indexOf(marker)
    if (idx === -1) return ''
    const nextMedia = css.indexOf('@media', idx + 1)
    return css.slice(idx, nextMedia === -1 ? undefined : nextMedia)
  }

  it('outerSection2 has min-height: 100dvh at 320px so 1fr rows fill viewport when card content is shorter', () => {
    const section = getMediaSection(320)
    const match = section.match(/\.outerSection2\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toContain('min-height: 100dvh')
  })

  it('outerSection2 has min-height: 100dvh at 481px', () => {
    const section = getMediaSection(481)
    const match = section.match(/\.outerSection2\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toContain('min-height: 100dvh')
  })

  it('outerSection2 has min-height: 100dvh at 641px', () => {
    const section = getMediaSection(641)
    const match = section.match(/\.outerSection2\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toContain('min-height: 100dvh')
  })

  it('scorePanel has env(safe-area-inset-bottom) margin-bottom at 320px to clear mobile Safari home indicator', () => {
    const section = getMediaSection(320)
    const match = section.match(/\.scorePanel\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toContain('env(safe-area-inset-bottom)')
  })

  it('scorePanel has env(safe-area-inset-bottom) margin-bottom at 481px', () => {
    const section = getMediaSection(481)
    const match = section.match(/\.scorePanel\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toContain('env(safe-area-inset-bottom)')
  })

  it('scorePanel has env(safe-area-inset-bottom) margin-bottom at 641px', () => {
    const section = getMediaSection(641)
    const match = section.match(/\.scorePanel\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toContain('env(safe-area-inset-bottom)')
  })
})

describe('Volume slider correct fill colors (regression: was dark blob)', () => {
  it('CSS .volumeSliderWrapper has white background so the yellow fill shows against a light track', () => {
    expect(css).toMatch(/\.volumeSliderWrapper\s*\{[^}]*background:\s*white/)
  })

  it('CSS .volumeSliderWrapper has 3px solid black border matching the DBZ button family', () => {
    expect(css).toMatch(/\.volumeSliderWrapper\s*\{[^}]*border:\s*3px solid black/)
  })

  it('CSS .volumeSliderWrapper:before exists with a glow animation', () => {
    expect(css).toMatch(/\.volumeSliderWrapper:before\s*\{[^}]*animation:/)
  })

  it('CSS .volumeSliderWrapper:hover:before sets opacity to 1 so glow appears on hover', () => {
    expect(css).toMatch(/\.volumeSliderWrapper:hover:before\s*\{[^}]*opacity:\s*1/)
  })

  it('CSS slider thumb background is yellow so the thumb is readable on the white track', () => {
    expect(css).toMatch(/\.volumeSliderInput::-webkit-slider-thumb\s*\{[^}]*background:\s*yellow/)
  })

  it('PlayPage volume slider input uses yellow-on-grey fill gradient matching the white-track design', () => {
    const props = {
      background: 'fake-bg.jpg',
      setHomePage: vi.fn(),
      setAudioPause: vi.fn(),
      setAudioPlay: vi.fn(),
      activeCurrentAudio: false,
      isActiveData: [],
      isVolume: 0.5,
      onVolumeChange: vi.fn(),
    }
    vi.useFakeTimers()
    render(<PlayPage {...props} />)
    const sliderInput = document.querySelector('.volumeSliderInput')
    expect(sliderInput.style.background).toContain('yellow')
    expect(sliderInput.style.background).not.toContain('rgba(0,0,0')
    vi.clearAllTimers()
    vi.useRealTimers()
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
