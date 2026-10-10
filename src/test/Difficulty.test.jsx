import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import HomePage from '../HomePage.jsx'
import PlayPage from '../PlayPage.jsx'
import Card from '../Card.jsx'

const __dirname = dirname(fileURLToPath(import.meta.url))
const css = readFileSync(resolve(__dirname, '../style.css'), 'utf8')

function makeCharacters(count) {
  return Array.from({ length: count }, (_, i) => ({ id: i + 1, name: `Fighter ${i + 1}`, image: `f${i + 1}.png` }))
}

describe('HomePage difficulty selector', () => {
  const baseProps = {
    background: 'bg.jpg',
    setPlayPage: vi.fn(),
    setAudioPause: vi.fn(),
    setAudioPlay: vi.fn(),
    activeCurrentAudio: false,
    isVolume: 0.5,
    onVolumeChange: vi.fn(),
  }

  afterEach(() => cleanup())

  it('renders Easy, Hard, and Hardest options inside the fight stage, above the Fight button', () => {
    render(<HomePage {...baseProps} isLevel='easy' setLevel={vi.fn()} />)
    const stage = document.querySelector('.fightStage')
    const buttons = stage.querySelectorAll('.levelSelect .levelButton')
    expect([...buttons].map(b => b.textContent)).toEqual(['Easy', 'Hard', 'Hardest'])
    const select = stage.querySelector('.levelSelect')
    const fight = stage.querySelector('.fightButton')
    expect(select.compareDocumentPosition(fight) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('marks only the current level as active', () => {
    render(<HomePage {...baseProps} isLevel='hardest' setLevel={vi.fn()} />)
    const active = document.querySelectorAll('.levelButton.levelActive')
    expect(active).toHaveLength(1)
    expect(active[0].textContent).toBe('Hardest')
    expect(active[0]).toHaveAttribute('aria-pressed', 'true')
  })

  it('picking a level calls setLevel without starting the game', () => {
    const setLevel = vi.fn()
    const setPlayPage = vi.fn()
    render(<HomePage {...baseProps} setPlayPage={setPlayPage} isLevel='easy' setLevel={setLevel} />)
    fireEvent.click(screen.getByText('Hard'))
    expect(setLevel).toHaveBeenCalledWith('hard')
    expect(setPlayPage).not.toHaveBeenCalled()
  })

  it('styles the selector in the DBZ button family with the shared glowing keyframe', () => {
    const base = css.match(/\.levelButton\s*\{([^}]+)\}/)
    expect(base).not.toBeNull()
    expect(base[1]).toContain('border: 3px solid black')
    expect(base[1]).toContain('border-radius: 20px')
    expect(base[1]).toContain("font-family: 'customFont1'")
    expect(base[1]).toContain('radial-gradient(ellipse at 50% 0%, #ffff55 0%, #ff0 55%, #e8e800 100%)')
    const glow = css.match(/\.levelButton:before\s*\{([^}]+)\}/)
    expect(glow).not.toBeNull()
    expect(glow[1]).toMatch(/animation:\s*glowing\s/)
  })
})

describe('PlayPage per-level parameters', () => {
  const baseProps = {
    background: 'bg.jpg',
    setHomePage: vi.fn(),
    setAudioPause: vi.fn(),
    setAudioPlay: vi.fn(),
    activeCurrentAudio: false,
    isVolume: 0.5,
    onVolumeChange: vi.fn(),
    setHighScore: vi.fn(),
  }

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    cleanup()
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it.each([
    ['easy', 16],
    ['hard', 24],
    ['hardest', 32],
  ])('%s: score, pips, and instructions use a win threshold of %i', (level, winCount) => {
    render(<PlayPage {...baseProps} isLevel={level} isActiveData={[]} />)
    expect(screen.getByText(`0 / ${winCount}`)).toBeInTheDocument()
    expect(document.querySelectorAll('.scorePanelPip')).toHaveLength(winCount)
    expect(screen.getByText(`Pick all ${winCount} unique fighters to win!`)).toBeInTheDocument()
  })

  it('defaults to Easy when no level is passed', () => {
    render(<PlayPage {...baseProps} isActiveData={[]} />)
    expect(screen.getByText('0 / 16')).toBeInTheDocument()
  })

  it('shows the high score passed in for the current level', () => {
    render(<PlayPage {...baseProps} isLevel='hard' isHighScore={7} isActiveData={[]} />)
    expect(screen.getByText('Best 7')).toBeInTheDocument()
  })

  it.each([
    ['easy', 16, 8],
    ['hard', 24, 8],
    ['hardest', 32, 12],
  ])('%s: deals %i-card pool as %i distinct face-up cards per round', (level, poolSize, shownCount) => {
    render(<PlayPage {...baseProps} isLevel={level} isActiveData={makeCharacters(poolSize)} />)
    // Face-down backs match the round size before the flip.
    expect(document.querySelectorAll('.cardBack')).toHaveLength(shownCount)
    act(() => { vi.advanceTimersByTime(1100) })
    const images = [...document.querySelectorAll('.cardImage')].map(img => img.getAttribute('src'))
    expect(images).toHaveLength(shownCount)
    expect(new Set(images).size).toBe(shownCount)
  })

  it('only the 12-card Hardest board gets the 6-across hardestBoard layout', () => {
    const { unmount } = render(<PlayPage {...baseProps} isLevel='hard' isActiveData={[]} />)
    expect(document.querySelector('.outerSection2.hardestBoard')).toBeNull()
    unmount()
    render(<PlayPage {...baseProps} isLevel='hardest' isActiveData={[]} />)
    expect(document.querySelector('.outerSection2.hardestBoard')).not.toBeNull()
    expect(css).toMatch(/\.hardestBoard \.logoSection3,\s*\.hardestBoard \.logoSection4\s*\{\s*grid-template-columns: repeat\(6,/)
  })

  it('does not hang when the level pool is empty (data still loading)', () => {
    render(<PlayPage {...baseProps} isLevel='hardest' isActiveData={[]} />)
    act(() => { vi.advanceTimersByTime(1100) })
    expect(document.querySelectorAll('.cardImage')).toHaveLength(0)
  })
})

describe('Card win threshold follows the level', () => {
  function makeProps(overrides = {}) {
    const item = { id: 1, name: 'Goku', image: 'goku.png' }
    return {
      item,
      shuffleNow: vi.fn(),
      isPickedArray: [],
      setPickedArray: vi.fn(),
      isShown: [item],
      isScore: 0,
      setScore: vi.fn(),
      isPopUp: false,
      setPopUp: vi.fn(),
      style: { cursor: 'pointer' },
      isHighScore: 0,
      setHighScore: vi.fn(),
      startInitialTurn: vi.fn(),
      isPositions: [0],
      setPositions: vi.fn(),
      isResult: false,
      setResult: vi.fn(),
      winCount: 16,
      ...overrides,
    }
  }

  afterEach(() => cleanup())

  it('the 16th unique pick does not end a Hard (24) game', () => {
    const props = makeProps({ isScore: 15, winCount: 24 })
    const { container } = render(<Card {...props} />)
    fireEvent.click(container.querySelector('.card'))
    expect(props.setPopUp).not.toHaveBeenCalled()
    expect(props.shuffleNow).toHaveBeenCalled()
  })

  it('reaching the level win threshold ends the game as a win', () => {
    const props = makeProps({ isScore: 31, winCount: 32 })
    const { container } = render(<Card {...props} />)
    fireEvent.click(container.querySelector('.card'))
    expect(props.setResult).toHaveBeenCalledWith(true)
    expect(props.setPopUp).toHaveBeenCalledWith(true)
    expect(props.shuffleNow).not.toHaveBeenCalled()
  })
})

describe('MainSection fetches a level-sized pool', () => {
  let MainSection

  beforeEach(async () => {
    vi.resetModules()
    vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve())
    vi.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
    MainSection = (await import('../MainSection.jsx')).default
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('requests 16 / 24 / 32 characters for Easy / Hard / Hardest, refetching on each change', async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ items: [] }) }))
    render(<MainSection />)
    await act(async () => {})
    expect(globalThis.fetch.mock.calls.at(-1)[0]).toMatch(/limit=16$/)

    await act(async () => { fireEvent.click(screen.getByText('Hard')) })
    expect(globalThis.fetch.mock.calls.at(-1)[0]).toMatch(/limit=24$/)

    await act(async () => { fireEvent.click(screen.getByText('Hardest')) })
    expect(globalThis.fetch.mock.calls.at(-1)[0]).toMatch(/limit=32$/)
  })

  it('drops a late response for a level that is no longer selected', async () => {
    const pending = []
    globalThis.fetch = vi.fn(url => new Promise(res => pending.push({ url, res })))
    render(<MainSection />)
    await act(async () => { fireEvent.click(screen.getByText('Hardest')) })

    // Resolve the Hardest request first, then the stale Easy one.
    const easy = pending.find(p => /limit=16$/.test(p.url))
    const hardest = pending.find(p => /limit=32$/.test(p.url))
    await act(async () => { hardest.res({ ok: true, json: () => Promise.resolve({ items: makeCharacters(32) }) }) })
    const staleEasy = makeCharacters(16).map(c => ({ ...c, image: `stale-${c.image}` }))
    await act(async () => { easy.res({ ok: true, json: () => Promise.resolve({ items: staleEasy }) }) })

    vi.useFakeTimers()
    fireEvent.click(document.querySelector('.fightButton'))
    act(() => { vi.advanceTimersByTime(1100) })
    // Hardest's 32-card pool and 12-card rounds, not Easy's leftovers.
    expect(screen.getByText('0 / 32')).toBeInTheDocument()
    const images = [...document.querySelectorAll('.cardImage')].map(img => img.getAttribute('src'))
    expect(images).toHaveLength(12)
    expect(images.some(src => src.startsWith('stale-'))).toBe(false)
    vi.useRealTimers()
  })
})

describe('HomePage selected-level info line', () => {
  const baseProps = {
    background: 'bg.jpg',
    setPlayPage: vi.fn(),
    setAudioPause: vi.fn(),
    setAudioPlay: vi.fn(),
    activeCurrentAudio: false,
    isVolume: 0.5,
    onVolumeChange: vi.fn(),
    setLevel: vi.fn(),
  }

  afterEach(() => cleanup())

  it('sits between the level selector and the Fight button', () => {
    render(<HomePage {...baseProps} isLevel='easy' />)
    const stage = document.querySelector('.fightStage')
    const select = stage.querySelector('.levelSelect')
    const info = stage.querySelector('.levelInfo')
    const fight = stage.querySelector('.fightButton')
    expect(info).not.toBeNull()
    expect(select.compareDocumentPosition(info) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(info.compareDocumentPosition(fight) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it.each([
    ['easy', '16 characters', '8 cards shown per round'],
    ['hard', '24 characters', '8 cards shown per round'],
    ['hardest', '32 characters', '12 cards shown per round'],
  ])('describes %s', (level, characters, shown) => {
    render(<HomePage {...baseProps} isLevel={level} />)
    const info = document.querySelector('.levelInfo')
    expect(info).toHaveTextContent(characters)
    expect(info).toHaveTextContent(shown)
  })

  it('reads the character count from the levelLimits passed in', () => {
    render(<HomePage {...baseProps} isLevel='hard' levelLimits={{ easy: 10, hard: 20, hardest: 30 }} />)
    expect(document.querySelector('.levelInfo')).toHaveTextContent('20 characters')
  })

  it('tapping the info line does not start the game', () => {
    const setPlayPage = vi.fn()
    render(<HomePage {...baseProps} setPlayPage={setPlayPage} isLevel='easy' />)
    fireEvent.click(document.querySelector('.levelInfo'))
    expect(setPlayPage).not.toHaveBeenCalled()
  })

  it('uses the DBZ face with a default cursor', () => {
    const rule = css.match(/\.levelInfo\s*\{([^}]+)\}/)
    expect(rule).not.toBeNull()
    expect(rule[1]).toContain('border: 3px solid black')
    expect(rule[1]).toContain('border-radius: 20px')
    expect(rule[1]).toContain("font-family: 'customFont1'")
    expect(rule[1]).toContain('font-size: 13px')
    expect(rule[1]).toContain('cursor: default')
  })
})

describe('MainSection level info updates with the picked level', () => {
  let MainSection

  beforeEach(async () => {
    vi.resetModules()
    vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve())
    vi.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
    MainSection = (await import('../MainSection.jsx')).default
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('switches the info copy immediately when a level is picked', async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ items: [] }) }))
    render(<MainSection />)
    await act(async () => {})
    expect(document.querySelector('.levelInfo')).toHaveTextContent('16 characters')

    await act(async () => { fireEvent.click(screen.getByText('Hardest')) })
    const info = document.querySelector('.levelInfo')
    expect(info).toHaveTextContent('32 characters')
    expect(info).toHaveTextContent('12 cards shown per round')
  })
})
