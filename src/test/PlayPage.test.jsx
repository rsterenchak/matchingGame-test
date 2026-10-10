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

  it('scorePanel renders 16 pip tracker elements', () => {
    render(<PlayPage {...defaultProps} />)
    expect(document.querySelector('.scorePanelPips')).toBeInTheDocument()
    const pips = document.querySelectorAll('.scorePanelPip')
    expect(pips).toHaveLength(16)
  })

  it('no scorePanelPip has the lit class when score is 0', () => {
    render(<PlayPage {...defaultProps} />)
    const litPips = document.querySelectorAll('.scorePanelPip.lit')
    expect(litPips).toHaveLength(0)
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

  // .playSection is the 100dvh scroll root, so 100% fills the full viewport
  // without the section's 1px border pushing the grid into a 2px overflow.
  it('outerSection2 sets height to 100% of the 100dvh scroll root at 961px so the grid fills the full viewport', () => {
    const section = get961Section()
    const match = section.match(/\.outerSection2\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toMatch(/(?:^|\n)\s*height:\s*100%/)
  })

  it('scorePanel has max-width at 961px for a contained floating widget instead of full-bleed', () => {
    const section = get961Section()
    const match = section.match(/\.scorePanel\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toContain('max-width')
    expect(match[1]).not.toMatch(/margin:\s*0;/)
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

  it('outerSection2 uses min-height: 100dvh at 320px so 1fr rows have a reference height', () => {
    const section = getMediaSection(320)
    const match = section.match(/\.outerSection2\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toContain('min-height: 100dvh')
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

  it('outerSection2 has min-height: 100dvh at 320px so 1fr rows fill the viewport now that the document scrolls', () => {
    const section = getMediaSection(320)
    const match = section.match(/\.outerSection2\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toContain('min-height: 100dvh')
    expect(match[1]).not.toContain('min-height: 100%')
    expect(match[1]).not.toMatch(/(?:^|\n)\s*height:/)
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

  it('CSS ≥641px in-flow volume slider override is scoped to .sliderOpen so it only takes flow space when open', () => {
    // The base rule keeps the wrapper position: absolute; the ≥641px override
    // that switches it to position: relative must be scoped to .sliderOpen,
    // otherwise the closed slider renders permanently in-flow and breaks the
    // 3-icon nav row alignment.
    expect(css).toMatch(/\.volumeSliderWrapper\.sliderOpen\s*\{[^}]*position:\s*relative/)
  })

  it('CSS has no unscoped .volumeSliderWrapper rule forcing position: relative (would stretch the nav row when closed)', () => {
    expect(css).not.toMatch(/\.volumeSliderWrapper\s*\{[^}]*position:\s*relative/)
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

  it('shows a goal banner above the list that interpolates the level win count', () => {
    render(<PlayPage {...defaultProps} isLevel='hard' />)
    const goal = document.querySelector('.instructionsGoal')
    expect(goal).not.toBeNull()
    expect(goal.textContent).toContain('24')
    expect(goal.nextElementSibling.classList.contains('instructionsList')).toBe(true)
  })

  it('renders each rule as an icon row with a check, shuffle, danger ✕ and win ★ icon', () => {
    render(<PlayPage {...defaultProps} />)
    const rows = document.querySelectorAll('.instructionsList li')
    expect(rows).toHaveLength(4)
    const icons = [...rows].map(li => li.querySelector('.instructionsIcon'))
    expect(icons[0].classList.contains('instructionsIconCheck')).toBe(true)
    expect(icons[1].classList.contains('instructionsIconShuffle')).toBe(true)
    expect(icons[2].classList.contains('instructionsIconDanger')).toBe(true)
    expect(icons[2].textContent).toBe('✕')
    expect(icons[3].classList.contains('instructionsIconWin')).toBe(true)
    expect(icons[3].textContent).toBe('★')
    icons.forEach(icon => expect(icon.getAttribute('aria-hidden')).toBe('true'))
  })

  it('styles the list as unbulleted flex rows with a 24px icon column and 22px horizontal card padding', () => {
    const listRule = css.match(/\.instructionsList\s*\{([^}]+)\}/)
    expect(listRule[1]).toMatch(/list-style:\s*none/)
    expect(listRule[1]).toMatch(/padding:\s*0/)
    expect(listRule[1]).toMatch(/gap:\s*8px/)
    expect(listRule[1]).toMatch(/line-height:\s*1\.4/)
    const rowRule = css.match(/\.instructionsList li\s*\{([^}]+)\}/)
    expect(rowRule[1]).toMatch(/display:\s*flex/)
    expect(rowRule[1]).toMatch(/padding:\s*8px 12px/)
    const iconRule = css.match(/\.instructionsIcon\s*\{([^}]+)\}/)
    expect(iconRule[1]).toMatch(/flex:\s*0 0 24px/)
    const cardRule = css.match(/\.instructionsCard\s*\{([^}]+)\}/)
    expect(cardRule[1]).toMatch(/padding:\s*\d+px 22px/)
  })
})

describe('Tablet layout (641–960px): nav shows 3 icons instead of the hamburger', () => {
  function get641Section() {
    const marker = '@media (min-width:641px)  {'
    const idx = css.indexOf(marker)
    const nextMedia = css.indexOf('@media', idx + 1)
    return css.slice(idx, nextMedia === -1 ? undefined : nextMedia)
  }

  it('mobileMenuWrapper is hidden (display: none) at 641px so the hamburger no longer shows on tablets', () => {
    const section = get641Section()
    const match = section.match(/\.mobileMenuWrapper\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toContain('display: none')
    expect(match[1]).not.toContain('display: block')
  })

  it('topColumn3 > .musicIconWrapper is visible at 641px so the music+slider cluster shows directly on the play screen', () => {
    const section = get641Section()
    expect(section).toMatch(/\.topColumn3\s*>\s*\.musicIconWrapper\s*\{[^}]*display:\s*flex/)
    expect(section).not.toMatch(/\.topColumn3\s*>\s*\.musicIconWrapper\s*\{[^}]*display:\s*none/)
  })

  it('topColumn3 > .musicBlock3 is shown (display: flex) at 641px so the background-switch button joins the nav', () => {
    const section = get641Section()
    expect(section).toMatch(/\.topColumn3\s*>\s*\.musicBlock3\s*\{[^}]*display:\s*flex/)
    expect(section).not.toMatch(/\.topColumn3\s*>\s*\.musicBlock3\s*\{[^}]*display:\s*none/)
  })

  it('topColumn3 > .helpButton is shown (display: flex) at 641px so the how-to-play button joins the nav', () => {
    const section = get641Section()
    expect(section).toMatch(/\.topColumn3\s*>\s*\.helpButton\s*\{[^}]*display:\s*flex/)
    expect(section).not.toMatch(/\.topColumn3\s*>\s*\.helpButton\s*\{[^}]*display:\s*none/)
  })
})

describe('Play screen music controls show inline on mobile (moved out of hamburger)', () => {
  function get320Section() {
    const marker = '@media (min-width:320px)  {'
    const idx = css.indexOf(marker)
    const nextMedia = css.indexOf('@media', idx + 1)
    return css.slice(idx, nextMedia === -1 ? undefined : nextMedia)
  }

  it('topColumn3 > .musicIconWrapper is not hidden at 320px so the music cluster stays reachable on mobile without the hamburger', () => {
    const section = get320Section()
    expect(section).not.toMatch(/\.topColumn3\s*>\s*\.musicIconWrapper\s*\{[^}]*display:\s*none/)
  })

  it('PlayPage renders the inline music toggle and volume slider directly in the nav', () => {
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
    expect(document.querySelector('.musicIconWrapper .musicBlock2')).not.toBeNull()
    expect(document.querySelector('.musicIconWrapper .volumeSliderInput')).not.toBeNull()
    vi.clearAllTimers()
    vi.useRealTimers()
  })
})

describe('Mobile PlayPage nav shows 3 icons (music, background, help) instead of the hamburger', () => {
  function get320Section() {
    const marker = '@media (min-width:320px)  {'
    const idx = css.indexOf(marker)
    const nextMedia = css.indexOf('@media', idx + 1)
    return css.slice(idx, nextMedia === -1 ? undefined : nextMedia)
  }

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
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    localStorage.clear()
  })

  it('mobileMenuWrapper is hidden (display: none) at 320px so the hamburger no longer shows on mobile', () => {
    const section = get320Section()
    const match = section.match(/\.mobileMenuWrapper\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toContain('display: none')
    expect(match[1]).not.toContain('display: block')
  })

  it('topColumn3 > .musicBlock3 and .helpButton are shown (display: flex) at 320px so background + help join the mobile nav', () => {
    const section = get320Section()
    const match = section.match(/\.topColumn3\s*>\s*\.musicBlock3,\s*\.topColumn3\s*>\s*\.helpButton\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toContain('display: flex')
    expect(match[1]).not.toContain('display: none')
  })

  it('topColumn3 > .musicIconWrapper stays visible (display: flex) at 320px so the music toggle remains', () => {
    const section = get320Section()
    expect(section).toMatch(/\.topColumn3\s*>\s*\.musicIconWrapper\s*\{[^}]*display:\s*flex/)
  })

  it('portfolioBlock2 (the @rsterenchak text + GitHub icon next to the button stack) is hidden', () => {
    // The first .portfolioBlock2 rule is the base rule; it must remove the block
    // from the layout so the username/icon no longer render beside the nav stack.
    const match = css.match(/\.portfolioBlock2\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toContain('display: none')
    expect(match[1]).not.toContain('display: flex')
  })

  it('no longer renders a separate speakerButton element (long-press replaces it)', () => {
    render(<PlayPage {...defaultProps} />)
    expect(document.querySelector('.speakerButton')).toBeNull()
  })

  it('a quick tap on the music icon toggles play/pause', () => {
    render(<PlayPage {...defaultProps} />)
    const music = document.querySelector('.musicBlock2')
    fireEvent.mouseDown(music)
    fireEvent.mouseUp(music)
    fireEvent.click(music)
    // activeCurrentAudio is false, so a tap should start playback
    expect(defaultProps.setAudioPlay).toHaveBeenCalled()
  })

  it('a long-press on the music icon opens the volume slider', () => {
    render(<PlayPage {...defaultProps} />)
    const music = document.querySelector('.musicBlock2')
    fireEvent.mouseDown(music)
    act(() => vi.advanceTimersByTime(500))
    expect(document.querySelector('.volumeSliderWrapper.sliderOpen')).not.toBeNull()
  })

  it('the click following a long-press does not also toggle play/pause', () => {
    render(<PlayPage {...defaultProps} />)
    const music = document.querySelector('.musicBlock2')
    fireEvent.mouseDown(music)
    act(() => vi.advanceTimersByTime(500))
    fireEvent.mouseUp(music)
    fireEvent.click(music)
    expect(defaultProps.setAudioPlay).not.toHaveBeenCalled()
    expect(document.querySelector('.volumeSliderWrapper.sliderOpen')).not.toBeNull()
  })
})

describe('Music toggle hover does not shift card rows (regression: hover grew box model)', () => {
  it('.musicBlock2 base rule keeps a fixed 60x55 size', () => {
    const match = css.match(/\.musicBlock2\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toMatch(/width:\s*60px/)
    expect(match[1]).toMatch(/height:\s*55px/)
  })

  it('the nav circles grow on hover by transform only — never by changing width or height', () => {
    const match = css.match(/\.topColumn3\s+\.navStackButton:hover\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    // transform: scale leaves the box model untouched, so card rows never shift.
    expect(match[1]).toMatch(/transform:\s*scale\(1\.08\)/)
    expect(match[1]).not.toMatch(/\bwidth:/)
    expect(match[1]).not.toMatch(/\bheight:/)
  })

  it('the size-growing change-color3 keyframes are removed everywhere', () => {
    expect(css).not.toMatch(/change-color3/)
  })
})

describe('PlayPage buttons share HomePage\'s depth treatment', () => {
  const icons = ['.musicBlock2', '.musicBlock3', '.helpButton']
  const pills = ['.retryButton', '.gotItButton']
  const gradient = /background-image:\s*radial-gradient\(ellipse at 50% 0%, #ffff55 0%, #ff0 55%, #e8e800 100%\)/
  const esc = (sel) => sel.replace('.', '\\.')
  const rule = (sel, suffix = '') => {
    const match = css.match(new RegExp(`^${esc(sel)}${suffix}\\s*\\{([^}]+)\\}`, 'm'))
    expect(match).not.toBeNull()
    return match[1]
  }

  it.each([...icons, ...pills])('%s has the gradient face, layered shadow, isolation, and transition', (sel) => {
    const base = rule(sel)
    expect(base).toMatch(gradient)
    expect(base).toMatch(/0 0 0 2px rgb\(179, 179, 0\)/)
    expect(base).toMatch(/inset 0 0 0 2px rgba\(255, 255, 255, 0\.35\)/)
    expect(base).toMatch(/isolation:\s*isolate/)
    expect(base).toMatch(/transition:\s*transform \.2s, box-shadow \.2s/)
  })

  it.each([...icons, ...pills])('%s keeps a blurred rotating :before glow that is always on', (sel) => {
    const before = rule(sel, ':before')
    expect(before).toMatch(/filter:\s*blur/)
    expect(before).toMatch(/animation:\s*glowing[257] 20s/)
    expect(before).toMatch(/opacity:\s*1/)
    expect(css).not.toMatch(new RegExp(`${esc(sel)}:hover:before`))
  })

  it.each([
    ...icons.map((sel) => [sel, '50%']),
    ...pills.map((sel) => [sel, '17px']),
  ])('%s:after is a click-through bevelled face with border-radius %s, not the #111 backing', (sel, radius) => {
    const after = rule(sel, ':after')
    expect(after).toMatch(/inset:\s*-3px/)
    expect(after).toMatch(/border:\s*3px solid black/)
    expect(after).toMatch(new RegExp(`border-radius:\\s*${radius}`))
    expect(after).toMatch(/inset 0 3px 5px rgba\(120, 120, 0, 0\.45\)/)
    expect(after).toMatch(/inset 0 -2px 0 rgba\(255, 255, 255, 0\.6\)/)
    expect(after).toMatch(/pointer-events:\s*none/)
    expect(after).not.toMatch(/#111/)
    const pressed = rule(sel, ':active:after')
    expect(pressed).toMatch(/inset 0 4px 10px rgba\(120, 120, 0, 0\.6\)/)
    expect(pressed).not.toMatch(/transparent/)
  })

  it('nav circles scale up on hover and down on :active', () => {
    expect(css).toMatch(/\.topColumn3\s+\.navStackButton:hover\s*\{[^}]*transform:\s*scale\(1\.08\)/)
    expect(css).toMatch(/\.topColumn3\s+\.navStackButton:active\s*\{[^}]*transform:\s*scale\(0\.95\)/)
    expect(css).not.toMatch(/\.topColumn3\s+\.navStackButton:hover\s*\{[^}]*change-color2/)
  })

  it.each(pills)('%s scales on hover and press instead of the width/height keyframes', (sel) => {
    expect(rule(sel, ':hover')).toMatch(/transform:\s*scale\(1\.036\)/)
    expect(rule(sel, ':active')).toMatch(/transform:\s*scale\(0\.98\)/)
    expect(css).not.toMatch(/change-color5|change-color7/)
  })

  it.each(pills)('%s keeps its 160x55 size', (sel) => {
    const base = rule(sel)
    expect(base).toMatch(/width:\s*160px/)
    expect(base).toMatch(/height:\s*55px/)
  })

  it('mobile holds the PlayPage nav circles at their touch size on hover', () => {
    const start = css.indexOf('@media (max-width:480px) {')
    const block = css.slice(start, css.indexOf('@media', start + 1))
    expect(block).toMatch(/\.topColumn3\s+\.navStackButton:hover:not\(:active\)\s*\{[^}]*transform:\s*none/)
  })
})

describe('Mobile nav spacing: .topColumn3 icons evenly spaced when flex', () => {
  // Slice a play-page mobile media block (double-space marker form).
  function getMediaSection(minWidth) {
    const marker = `@media (min-width:${minWidth}px)  {`
    const idx = css.indexOf(marker)
    if (idx === -1) return ''
    const nextMedia = css.indexOf('@media', idx + 1)
    return css.slice(idx, nextMedia === -1 ? undefined : nextMedia)
  }

  // Match a standalone rule (e.g. `.helpButton { ... }`) inside a section,
  // ignoring compound selectors like `.topColumn3 > .helpButton { ... }` by
  // anchoring to the start of a line (spaces/tabs only, never crossing lines).
  function standaloneRule(section, selector) {
    const escaped = selector.replace('.', '\\.')
    return section.match(new RegExp(`(?:^|\\n)[ \\t]*${escaped}\\s*\\{([^}]*)\\}`))
  }

  // The flex breakpoints where .topColumn3 loses the desktop grid's empty-track
  // spacing and needs an explicit margin-left on the trailing two nav icons.
  it.each([320, 481, 641])('musicBlock3 has margin-left: 20px at %ipx so it does not sit flush against the music icon', (bp) => {
    const match = standaloneRule(getMediaSection(bp), '.musicBlock3')
    expect(match).not.toBeNull()
    expect(match[1]).toMatch(/margin-left:\s*20px/)
  })

  it.each([320, 481, 641])('helpButton has margin-left: 20px at %ipx so it does not sit flush against the background button', (bp) => {
    const match = standaloneRule(getMediaSection(bp), '.helpButton')
    expect(match).not.toBeNull()
    expect(match[1]).toMatch(/margin-left:\s*20px/)
  })

  // At 961px+ .topColumn3 reverts to grid, so the mobile margin-left must be
  // reset to 0 — otherwise the min-width cascade leaks it and shifts the
  // desktop nav icons, which must remain unchanged.
  it('musicBlock3 margin-left is reset to 0 at 961px so the desktop grid spacing is unchanged', () => {
    const match = standaloneRule(getMediaSection(961), '.musicBlock3')
    expect(match).not.toBeNull()
    expect(match[1]).toMatch(/margin-left:\s*0\b/)
  })

  it('helpButton margin-left is reset to 0 at 961px so the desktop grid spacing is unchanged', () => {
    const match = standaloneRule(getMediaSection(961), '.helpButton')
    expect(match).not.toBeNull()
    expect(match[1]).toMatch(/margin-left:\s*0\b/)
  })
})

describe('Mobile PlayPage nav: section2 buttons form a centered matched-pair row (320/481)', () => {
  function getMediaSection(minWidth) {
    const marker = `@media (min-width:${minWidth}px)  {`
    const idx = css.indexOf(marker)
    if (idx === -1) return ''
    const nextMedia = css.indexOf('@media', idx + 1)
    return css.slice(idx, nextMedia === -1 ? undefined : nextMedia)
  }

  function standaloneRule(section, selector) {
    const escaped = selector.replace('.', '\\.')
    return section.match(new RegExp(`(?:^|\\n)[ \\t]*${escaped}\\s*\\{([^}]*)\\}`))
  }

  // .topColumn3 becomes a flex row shared by the 320px and 481px breakpoints (the
  // 481px block has no .topColumn3 rule, so it cascades from 320px). Centering it
  // lays the three nav buttons out as a single horizontal, vertically-aligned row.
  it('topColumn3 centers its nav buttons horizontally and vertically at 320px so they read as a matched-pair row', () => {
    const match = standaloneRule(getMediaSection(320), '.topColumn3')
    expect(match).not.toBeNull()
    expect(match[1]).toMatch(/align-items:\s*center/)
    expect(match[1]).toMatch(/justify-content:\s*center/)
    expect(match[1]).not.toMatch(/align-items:\s*flex-start/)
  })

  // The leading music icon inherits a base margin-left of 10px that the two
  // trailing icons don't have; zeroing it at the mobile breakpoints keeps the gap
  // between all three buttons consistent (the 20px sibling margins alone).
  it.each([320, 481])('musicBlock2 margin-left is reset to 0 at %ipx so the music icon is flush with its matched pair', (bp) => {
    const match = standaloneRule(getMediaSection(bp), '.musicBlock2')
    expect(match).not.toBeNull()
    expect(match[1]).toMatch(/margin-left:\s*0\b/)
  })

  // The centering is scoped to mobile only: at 641px .topColumn3 must go back to a
  // left-aligned flex-start row (justify-content reset) and the music icon must
  // regain its 10px offset, so the tablet/desktop nav layout stays unchanged.
  it('topColumn3 resets to flex-start justification at 641px so the desktop/tablet nav is not re-centered', () => {
    const match = standaloneRule(getMediaSection(641), '.topColumn3')
    expect(match).not.toBeNull()
    expect(match[1]).toMatch(/justify-content:\s*flex-start/)
    expect(match[1]).not.toMatch(/justify-content:\s*center/)
  })

  it('musicBlock2 margin-left is restored to 10px at 641px so the mobile reset does not leak into the tablet nav', () => {
    const match = standaloneRule(getMediaSection(641), '.musicBlock2')
    expect(match).not.toBeNull()
    expect(match[1]).toMatch(/margin-left:\s*10px/)
  })
})

describe('PlayPage nav controls form a uniform vertical stack in the upper-left corner', () => {
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
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    localStorage.clear()
  })

  // The three nav triggers stack vertically instead of the old horizontal row.
  it('.topColumn3 is laid out as a flex column so the nav buttons stack vertically', () => {
    const match = css.match(/\.navSection2\s+\.topColumn3\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toMatch(/display:\s*flex/)
    expect(match[1]).toMatch(/flex-direction:\s*column/)
    expect(match[1]).toMatch(/align-items:\s*flex-start/)
  })

  // A single shared .navStackButton rule gives every trigger identical
  // dimensions (fixes the per-breakpoint size drift). Because it out-specifies
  // the individual .musicBlock2/3 / .helpButton size rules, it wins everywhere.
  it('.navStackButton sets one identical width/height for every nav button', () => {
    const match = css.match(/\.topColumn3\s+\.navStackButton\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    const widthMatch = match[1].match(/width:\s*([0-9]+px)/)
    const heightMatch = match[1].match(/height:\s*([0-9]+px)/)
    expect(widthMatch).not.toBeNull()
    expect(heightMatch).not.toBeNull()
    // Circular buttons: identical width and height.
    expect(widthMatch[1]).toBe(heightMatch[1])
    // Sibling margins are cleared so the column gap alone controls spacing.
    expect(match[1]).toMatch(/margin:\s*0\b/)
  })

  it('.navStackButton is sized to a compact 34px circle', () => {
    const match = css.match(/\.topColumn3\s+\.navStackButton\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    const widthMatch = match[1].match(/width:\s*([0-9]+)px/)
    expect(widthMatch).not.toBeNull()
    const size = Number(widthMatch[1])
    expect(size).toBe(34)
  })

  // The PlayPage desktop rules live in the SECOND @media (min-width:1025px)
  // block (the first only tweaks HomePage's .inputSection padding).
  function desktopBlock() {
    const marker = '@media (min-width:1025px) {'
    const firstIdx = css.indexOf(marker)
    const secondIdx = css.indexOf(marker, firstIdx + 1)
    const nextMedia = css.indexOf('@media', secondIdx + 1)
    return css.slice(secondIdx, nextMedia === -1 ? undefined : nextMedia)
  }

  it('at the 1025px desktop breakpoint the nav icon stack grows to match HomePage\'s nav button (60x55)', () => {
    // HomePage's top-left nav button (.musicBlock base rule) sets the target size.
    const homeNav = css.match(/\.musicBlock\s*\{([^}]+)\}/)
    expect(homeNav).not.toBeNull()
    const homeW = homeNav[1].match(/width:\s*([0-9]+)px/)[1]
    const homeH = homeNav[1].match(/height:\s*([0-9]+)px/)[1]

    const override = desktopBlock().match(/\.topColumn3\s+\.navStackButton\s*\{([^}]+)\}/)
    expect(override).not.toBeNull()
    const w = override[1].match(/width:\s*([0-9]+)px/)[1]
    const h = override[1].match(/height:\s*([0-9]+)px/)[1]
    // Matches HomePage's nav button, and is larger than the compact 34px default.
    expect(w).toBe(homeW)
    expect(h).toBe(homeH)
    expect(Number(w)).toBeGreaterThan(34)
  })

  it('the desktop help "?" glyph scales up so it stays proportional in the larger button', () => {
    // The base .helpButton rule is un-indented (column 0); media-query and
    // .topColumn3-scoped rules are indented, so anchor to start-of-line.
    const helpBase = css.match(/^\.helpButton\s*\{([^}]+)\}/m)
    const baseFont = Number(helpBase[1].match(/font-size:\s*([0-9]+)px/)[1])

    const override = desktopBlock().match(/\.topColumn3\s+\.helpButton\s*\{([^}]+)\}/)
    expect(override).not.toBeNull()
    const desktopFont = Number(override[1].match(/font-size:\s*([0-9]+)px/)[1])
    expect(desktopFont).toBeGreaterThan(baseFont)
  })

  it('at desktop the nav stack is offset from the page border to match HomePage\'s nav button', () => {
    // HomePage's nav button sits 10px in from the top-left corner via its
    // .musicIconWrapper margins. The PlayPage stack should carry the same offset.
    const homeWrapper = css.match(/\.musicIconWrapper\s*\{([^}]+)\}/)
    expect(homeWrapper).not.toBeNull()
    const homeLeft = homeWrapper[1].match(/margin-left:\s*([0-9]+)px/)[1]
    const homeTop = homeWrapper[1].match(/margin-top:\s*([0-9]+)px/)[1]

    const override = desktopBlock().match(/\.navSection2\s+\.topColumn3\s*\{([^}]+)\}/)
    expect(override).not.toBeNull()
    const left = override[1].match(/margin-left:\s*([0-9]+)px/)
    const top = override[1].match(/margin-top:\s*([0-9]+)px/)
    expect(left).not.toBeNull()
    expect(top).not.toBeNull()
    expect(left[1]).toBe(homeLeft)
    expect(top[1]).toBe(homeTop)
  })

  it('at desktop the nav buttons no longer grow via the change-color2 width/height keyframes', () => {
    // The shared transform: scale hover replaces the keyframe grow; the yellow
    // :after face under isolation: isolate keeps the button from blackening.
    expect(desktopBlock()).not.toMatch(/\.topColumn3\s+\.navStackButton:hover\s*\{[^}]*change-color2/)
  })

  it('all three nav triggers (music, background, help) carry the shared navStackButton class', () => {
    render(<PlayPage {...defaultProps} />)
    expect(document.querySelectorAll('.navStackButton')).toHaveLength(3)
    expect(document.querySelector('.musicBlock2.navStackButton')).not.toBeNull()
    expect(document.querySelector('.musicBlock3.navStackButton')).not.toBeNull()
    expect(document.querySelector('.helpButton.navStackButton')).not.toBeNull()
  })

  it('the music toggle inside the stack still fires the audio play/pause handler on tap', () => {
    render(<PlayPage {...defaultProps} />)
    const music = document.querySelector('.musicBlock2.navStackButton')
    fireEvent.mouseDown(music)
    fireEvent.mouseUp(music)
    fireEvent.click(music)
    expect(defaultProps.setAudioPlay).toHaveBeenCalled()
  })

  it('the help trigger opens the instructions popover, which stays centered via position: fixed (not re-anchored to the button)', () => {
    render(<PlayPage {...defaultProps} />)
    // Dismiss the mount-time modal first, then reopen via the relocated button.
    act(() => vi.advanceTimersByTime(400))
    fireEvent.click(document.querySelector('.gotItButton'))
    expect(screen.queryByText('How to Play')).not.toBeInTheDocument()

    fireEvent.click(document.querySelector('.helpButton.navStackButton'))
    expect(screen.getByText('How to Play')).toBeInTheDocument()

    const backdropRule = css.match(/\.instructionsBackdrop\s*\{([^}]+)\}/)
    expect(backdropRule).not.toBeNull()
    expect(backdropRule[1]).toMatch(/position:\s*fixed/)
    expect(backdropRule[1]).toMatch(/align-items:\s*center/)
    expect(backdropRule[1]).toMatch(/justify-content:\s*center/)
  })
})

describe('PlayPage scroll position on entry', () => {
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

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('scrolls the window back to the top on mount so a scrolled short home page does not leave the play screen clipped', () => {
    const scrollSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    render(<PlayPage {...defaultProps} />)
    expect(scrollSpy).toHaveBeenCalledWith(0, 0)
  })
})

describe('End-game popup: name entry and saved high scores', () => {
  const characters = Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    name: `Fighter ${i + 1}`,
    image: `fighter-${i + 1}.png`,
  }))

  const defaultProps = {
    background: 'fake-bg.jpg',
    setHomePage: vi.fn(),
    setAudioPause: vi.fn(),
    setAudioPlay: vi.fn(),
    activeCurrentAudio: false,
    isActiveData: characters,
    isVolume: 0.5,
    onVolumeChange: vi.fn(),
    setHighScore: vi.fn(),
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

  // Clicks the first face-up card every round until the run ends — it either
  // repeats a picked fighter (loss) or eventually picks all 16 (win).
  function playUntilGameOver() {
    for (let turn = 0; turn < 40 && !document.querySelector('.endGame'); turn++) {
      act(() => { vi.advanceTimersByTime(1000) })
      const card = document.querySelector('.card')
      expect(card).not.toBeNull()
      fireEvent.click(card)
    }
    expect(document.querySelector('.endGame')).toBeInTheDocument()
  }

  it('does not prompt for a name while the run is still in progress', () => {
    render(<PlayPage {...defaultProps} />)
    act(() => { vi.advanceTimersByTime(1000) })
    expect(document.querySelector('.card')).not.toBeNull()
    expect(screen.queryByPlaceholderText('Enter your name')).not.toBeInTheDocument()
    expect(document.querySelector('.saveButton')).not.toBeInTheDocument()
  })

  it('prompts for a name with the high scores list once the game ends', () => {
    render(<PlayPage {...defaultProps} />)
    playUntilGameOver()
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()
    expect(screen.getByText('High scores')).toBeInTheDocument()
    expect(document.querySelector('.endGame .retryButton')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })

  it('saving writes the run to matchingGame_highScores and highlights the player row', () => {
    render(<PlayPage {...defaultProps} />)
    playUntilGameOver()
    const finalScore = parseInt(document.querySelector('.scorePanelValue').textContent, 10)

    fireEvent.change(screen.getByPlaceholderText('Enter your name'), { target: { value: '  Goku  ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(JSON.parse(localStorage.getItem('matchingGame_highScores'))).toEqual([
      { name: 'Goku', score: finalScore },
    ])
    const ownRow = document.querySelector('.highScoresRow.ownRow')
    expect(ownRow).not.toBeNull()
    expect(ownRow.textContent).toContain('Goku')
    expect(screen.getByRole('button', { name: 'Saved' })).toBeDisabled()
  })

  it('stores and renders saved runs sorted by score descending', () => {
    localStorage.setItem('matchingGame_highScores', JSON.stringify([
      { name: 'Krillin', score: 3 },
      { name: 'Vegeta', score: 99 },
      { name: 'Yamcha', score: -1 },
    ]))
    render(<PlayPage {...defaultProps} />)
    playUntilGameOver()

    fireEvent.change(screen.getByPlaceholderText('Enter your name'), { target: { value: 'Goku' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    const stored = JSON.parse(localStorage.getItem('matchingGame_highScores'))
    const scores = stored.map(entry => entry.score)
    expect(scores).toEqual([...scores].sort((a, b) => b - a))
    expect(stored[0]).toEqual({ name: 'Vegeta', score: 99 })
    expect(stored[stored.length - 1]).toEqual({ name: 'Yamcha', score: -1 })

    const names = [...document.querySelectorAll('.highScoresName')].map(el => el.textContent)
    expect(names).toEqual(stored.map(entry => entry.name))
  })

  it('a corrupt stored value falls back to an empty list instead of crashing', () => {
    localStorage.setItem('matchingGame_highScores', '{not json')
    render(<PlayPage {...defaultProps} />)
    playUntilGameOver()
    expect(screen.getByText('No scores yet')).toBeInTheDocument()
  })

  it('popup card uses padding instead of a fixed height, with 2px borders and 12px radii on the input and list', () => {
    const endGame = css.match(/^\.endGame\s*\{([^}]+)\}/m)[1]
    expect(endGame).not.toMatch(/\bheight:\s*200px/)
    expect(endGame).toMatch(/padding:/)
    expect(endGame).toMatch(/border-radius:\s*20px/)
    for (const sel of ['endGameNameInput', 'highScoresBlock']) {
      const rule = css.match(new RegExp(`^\\.${sel}\\s*\\{([^}]+)\\}`, 'm'))[1]
      expect(rule).toMatch(/border:\s*2px solid black/)
      expect(rule).toMatch(/border-radius:\s*12px/)
    }
    expect(css).toMatch(/\.highScoresRow\.ownRow\s*\{[^}]*#fff6a8/)
  })
})

describe('Mobile Safari safe areas: scroll roots, insets, and the phone bottom dock', () => {
  function block(marker) {
    const idx = css.indexOf(marker)
    expect(idx).not.toBe(-1)
    return css.slice(idx, css.indexOf('@media', idx + 1))
  }

  function standaloneRule(section, selector) {
    const escaped = selector.replace('.', '\\.')
    return section.match(new RegExp(`(?:^|\\n)[ \\t]*${escaped}\\s*\\{([^}]*)\\}`))
  }

  // Phones scroll the document so Safari manages its bottom toolbar; a 100dvh
  // inner scroller's bottom edge would sit under the expanded toolbar.
  it.each([
    ['.homeSection', '@media (min-width:320px){'],
    ['.playSection', '@media (min-width:320px)  {'],
  ])('%s is not a fixed-height scroll root at 320px', (sel, marker) => {
    const match = standaloneRule(block(marker), sel)
    if (match) {
      expect(match[1]).not.toMatch(/(?:^|\n)\s*height:/)
      expect(match[1]).not.toMatch(/overflow(-[xy])?:/)
    }
  })

  it.each([
    ['.homeSection::before', '@media (min-width:320px){'],
    ['.playSection::before', '@media (min-width:320px)  {'],
  ])('%s keeps the base absolute edge-fade at 320px (no sticky override)', (sel, marker) => {
    expect(block(marker)).not.toContain(`${sel} {`)
    const base = css.match(new RegExp(`(?:^|\\n)${sel.replace('.', '\\.')}\\s*\\{([^}]+)\\}`))[1]
    expect(base).toMatch(/position:\s*absolute/)
    expect(base).toMatch(/inset:\s*0/)
  })

  // 641px+ keeps body overflow: hidden, so the sections stay 100dvh scroll roots.
  it.each([
    ['.homeSection', '@media (min-width:641px) {'],
    ['.playSection', '@media (min-width:641px)  {'],
  ])('%s is a 100dvh scroll root at 641px+', (sel, marker) => {
    const match = standaloneRule(block(marker), sel)
    expect(match).not.toBeNull()
    expect(match[1]).toMatch(/height:\s*100vh;[\s\S]*height:\s*100dvh/)
    expect(block(marker)).toMatch(new RegExp(`${sel.replace('.', '\\.')}::before\\s*\\{[^}]*position:\\s*sticky`))
  })

  it('body keeps overflow: hidden by default for 641px+', () => {
    expect(css.match(/(?:^|\n)body\s*\{([^}]+)\}/)[1]).toMatch(/overflow:\s*hidden/)
  })

  it('phones (max-width:640px) let the document scroll vertically, after the base body rule', () => {
    const baseIdx = css.search(/(?:^|\n)body\s*\{/)
    const phoneIdx = css.indexOf('@media (max-width:640px) {')
    expect(phoneIdx).toBeGreaterThan(baseIdx)
    const body = standaloneRule(block('@media (max-width:640px) {'), 'body')
    expect(body).not.toBeNull()
    expect(body[1]).toMatch(/overflow-y:\s*auto/)
    expect(body[1]).toMatch(/overflow-x:\s*hidden/)
  })

  it('both page grids pad by the top/left/right safe-area insets with an 8px top gutter', () => {
    const match = css.match(/\.outerSection,\s*\n\.outerSection2\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toMatch(/padding-top:\s*max\(env\(safe-area-inset-top\),\s*8px\)/)
    expect(match[1]).toMatch(/padding-left:\s*env\(safe-area-inset-left\)/)
    expect(match[1]).toMatch(/padding-right:\s*env\(safe-area-inset-right\)/)
    // Must come after every breakpoint's `padding: 0px` reset to take effect.
    expect(css.lastIndexOf('padding: 0px')).toBeLessThan(match.index)
  })

  it('phone nav pill and score panel are sticky above the bottom inset, pill stacked above the panel', () => {
    const phone = block('@media (max-width:480px) {')
    const nav = standaloneRule(phone, '.navSection2')[1]
    const panel = standaloneRule(phone, '.scorePanel')[1]
    expect(nav).toMatch(/position:\s*sticky/)
    expect(nav).toMatch(/bottom:\s*calc\(76px \+ env\(safe-area-inset-bottom\)\)/)
    expect(panel).toMatch(/position:\s*sticky/)
    expect(panel).toMatch(/bottom:\s*0/)
    expect(panel).toMatch(/margin:\s*0 10px;/)
    expect(panel).toMatch(/padding-bottom:\s*calc\(10px \+ env\(safe-area-inset-bottom\)\)/)
  })

  it('phone nav pill floats on the page with no dark strip or top border behind it', () => {
    const nav = standaloneRule(block('@media (max-width:480px) {'), '.navSection2')[1]
    expect(nav).not.toMatch(/background-color:/)
    expect(nav).not.toMatch(/border-top:/)
    expect(nav).toMatch(/z-index:\s*12;/)
  })

  it('phone board is centered between two 1fr spacer rows with the dock below', () => {
    const phone = block('@media (max-width:480px) {')
    expect(standaloneRule(phone, '.outerSection2')[1]).toMatch(/grid-template-rows:\s*1fr auto auto 1fr auto auto;/)
    expect(standaloneRule(phone, '.logoSection3')[1]).toMatch(/grid-row:\s*2;/)
    expect(standaloneRule(phone, '.logoSection4')[1]).toMatch(/grid-row:\s*3;/)
    const nav = standaloneRule(phone, '.navSection2')[1]
    const panel = standaloneRule(phone, '.scorePanel')[1]
    expect(nav).toMatch(/grid-row:\s*5;/)
    expect(panel).toMatch(/grid-row:\s*6;/)
    expect(nav).not.toMatch(/order:/)
    expect(panel).not.toMatch(/order:/)
  })
})
