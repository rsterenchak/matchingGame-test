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

  it('.navStackButton is shrunk to a compact ~28-30px circle', () => {
    const match = css.match(/\.topColumn3\s+\.navStackButton\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    const widthMatch = match[1].match(/width:\s*([0-9]+)px/)
    expect(widthMatch).not.toBeNull()
    const size = Number(widthMatch[1])
    expect(size).toBeGreaterThanOrEqual(28)
    expect(size).toBeLessThanOrEqual(30)
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
