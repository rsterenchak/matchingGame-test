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

  it('outerSection2 sets height to 100dvh at 961px so the grid fills the full viewport', () => {
    const section = get961Section()
    const match = section.match(/\.outerSection2\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toContain('height: 100dvh')
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

describe('Desktop layout: hamburger replaces individual nav controls at 641px+', () => {
  function get641Section() {
    const marker = '@media (min-width:641px)  {'
    const idx = css.indexOf(marker)
    const nextMedia = css.indexOf('@media', idx + 1)
    return css.slice(idx, nextMedia === -1 ? undefined : nextMedia)
  }

  it('mobileMenuWrapper uses display: block (not none) at 641px so the hamburger is visible on desktop', () => {
    const section = get641Section()
    const match = section.match(/\.mobileMenuWrapper\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toContain('display: block')
    expect(match[1]).not.toContain('display: none')
  })

  it('topColumn3 > .musicIconWrapper is visible at 641px so the music+slider cluster shows directly on the play screen', () => {
    const section = get641Section()
    expect(section).toMatch(/\.topColumn3\s*>\s*\.musicIconWrapper\s*\{[^}]*display:\s*flex/)
    expect(section).not.toMatch(/\.topColumn3\s*>\s*\.musicIconWrapper\s*\{[^}]*display:\s*none/)
  })

  it('topColumn3 > .musicBlock3 is hidden at 641px so the background-switch button does not show on desktop', () => {
    const section = get641Section()
    expect(section).toMatch(/\.topColumn3\s*>\s*\.musicBlock3\s*\{[^}]*display:\s*none/)
  })

  it('topColumn3 > .helpButton is hidden at 641px so the how-to-play button does not show on desktop', () => {
    const section = get641Section()
    expect(section).toMatch(/\.topColumn3\s*>\s*\.helpButton\s*\{[^}]*display:\s*none/)
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

  it('portfolioIcon2 is shown (display: block) at 320px so the GitHub link is not lost on mobile', () => {
    const section = get320Section()
    const match = section.match(/\.portfolioIcon2\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toContain('display: block')
    expect(match[1]).not.toContain('display: none')
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

  it('.musicBlock2:hover:before reveals the glow without a size-growing animation', () => {
    const match = css.match(/\.musicBlock2:hover:before\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    // The glow appears purely by fading the :before layer in — no box-model change.
    expect(match[1]).toMatch(/opacity:\s*1/)
    expect(match[1]).not.toMatch(/change-color3/)
  })

  it('.musicBlock2:hover:before never changes width or height on hover', () => {
    const match = css.match(/\.musicBlock2:hover:before\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).not.toMatch(/\bwidth:/)
    expect(match[1]).not.toMatch(/\bheight:/)
  })

  it('the size-growing change-color3 keyframes are removed everywhere', () => {
    expect(css).not.toMatch(/change-color3/)
  })
})

describe('Nav icons in .navSection2 share HomePage\'s rotating glow on hover (replaces scale-on-hover)', () => {
  const icons = ['.musicBlock2', '.musicBlock3', '.helpButton']

  it.each(icons)('%s no longer uses transform: scale on hover or active', (sel) => {
    const escaped = sel.replace('.', '\\.')
    const hover = css.match(new RegExp(`${escaped}:hover\\s*\\{([^}]+)\\}`))
    if (hover) expect(hover[1]).not.toMatch(/transform:\s*scale/)
    const active = css.match(new RegExp(`${escaped}:active\\s*\\{([^}]+)\\}`))
    if (active) expect(active[1]).not.toMatch(/transform:\s*scale/)
  })

  it.each(icons)('%s has a blurred rotating :before glow layer hidden by default', (sel) => {
    const escaped = sel.replace('.', '\\.')
    const match = css.match(new RegExp(`${escaped}:before\\s*\\{([^}]+)\\}`))
    expect(match).not.toBeNull()
    expect(match[1]).toMatch(/filter:\s*blur/)
    expect(match[1]).toMatch(/animation:\s*glowing2/)
    expect(match[1]).toMatch(/background-size:\s*400%/)
    expect(match[1]).toMatch(/opacity:\s*0/)
    expect(match[1]).toMatch(/border-radius:\s*15px/)
  })

  it.each(icons)('%s reveals the glow on hover via :hover:before opacity 1', (sel) => {
    const escaped = sel.replace('.', '\\.')
    const match = css.match(new RegExp(`${escaped}:hover:before\\s*\\{([^}]+)\\}`))
    expect(match).not.toBeNull()
    expect(match[1]).toMatch(/opacity:\s*1/)
  })

  it.each(icons)('%s has a black :after backing layer with border-radius 20px', (sel) => {
    const escaped = sel.replace('.', '\\.')
    const match = css.match(new RegExp(`${escaped}:after\\s*\\{([^}]+)\\}`))
    expect(match).not.toBeNull()
    expect(match[1]).toMatch(/background:\s*#111/)
    expect(match[1]).toMatch(/border-radius:\s*20px/)
  })

  it.each(icons)('%s grows on hover via the change-color2 animation, layered with the glow', (sel) => {
    const escaped = sel.replace('.', '\\.')
    const match = css.match(new RegExp(`${escaped}:hover\\s*\\{([^}]+)\\}`))
    expect(match).not.toBeNull()
    expect(match[1]).toMatch(/animation:\s*0\.5s\s+change-color2/)
  })
})
