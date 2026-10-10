import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { highScoresKey, sortHighScores, loadHighScores, levelLabel, entryLevel, levelWinCounts } from '../highScores.js'
import HomePage from '../HomePage.jsx'
import PlayPage from '../PlayPage.jsx'
import MobileMenu from '../MobileMenu.jsx'
import MainSection from '../MainSection.jsx'

describe('highScores helpers', () => {
  beforeEach(() => localStorage.clear())

  it('stores runs under the matchingGame_ prefixed key', () => {
    expect(highScoresKey).toBe('matchingGame_highScores')
  })

  it('sorts by score, highest first, without mutating the input', () => {
    const list = [{ name: 'a', score: 1 }, { name: 'b', score: 9 }]
    expect(sortHighScores(list).map(e => e.name)).toEqual(['b', 'a'])
    expect(list[0].name).toBe('a')
  })

  it('loads valid entries sorted and keeps their level', () => {
    localStorage.setItem(highScoresKey, JSON.stringify([
      { name: 'Krillin', score: 3 },
      { name: 'Vegeta', score: 20, level: 'hard' },
      { name: 42, score: 5 },
    ]))
    expect(loadHighScores()).toEqual([
      { name: 'Vegeta', score: 20, level: 'hard' },
      { name: 'Krillin', score: 3 },
    ])
  })

  it('falls back to an empty list for missing or corrupt storage', () => {
    expect(loadHighScores()).toEqual([])
    localStorage.setItem(highScoresKey, '{not json')
    expect(loadHighScores()).toEqual([])
  })

  it('labels each level from the saved level field', () => {
    expect(levelLabel({ level: 'easy' })).toBe('Easy')
    expect(levelLabel({ level: 'hard' })).toBe('Hard')
    expect(levelLabel({ level: 'hardest' })).toBe('Hardest')
  })

  it('infers a missing level from the score only when unambiguous, otherwise no label', () => {
    expect(levelLabel({ score: 20 })).toBe('Hard')
    expect(levelLabel({ score: 24 })).toBe('Hard')
    expect(levelLabel({ score: 25 })).toBe('Hardest')
    expect(levelLabel({ score: 30 })).toBe('Hardest')
    expect(levelLabel({ score: 16 })).toBe('')
    expect(levelLabel({ score: 12 })).toBe('')
    expect(levelLabel({})).toBe('')
  })

  it('resolves entryLevel to a level key, or null when it cannot be known', () => {
    expect(entryLevel({ level: 'hard', score: 3 })).toBe('hard')
    expect(entryLevel({ score: 20 })).toBe('hard')
    expect(entryLevel({ score: 30 })).toBe('hardest')
    expect(entryLevel({ score: 12 })).toBeNull()
    expect(entryLevel({ score: 12, level: 'insane' })).toBeNull()
  })

  it('exposes the per-level win counts', () => {
    expect(levelWinCounts).toEqual({ easy: 16, hard: 24, hardest: 32 })
  })

  it('keeps entries whose level is missing or unrecognised', () => {
    localStorage.setItem(highScoresKey, JSON.stringify([
      { name: 'Gohan', score: 30 },
      { name: 'Piccolo', score: 4, level: 'insane' },
    ]))
    expect(loadHighScores().map(e => e.name)).toEqual(['Gohan', 'Piccolo'])
  })
})

describe('High scores trophy buttons', () => {
  it('HomePage trophy sits in the music stack after the speaker and opens the scores', () => {
    const openScores = vi.fn()
    render(
      <HomePage
        background='bg.jpg'
        setPlayPage={vi.fn()}
        setAudioPause={vi.fn()}
        setAudioPlay={vi.fn()}
        activeCurrentAudio={false}
        isVolume={0.5}
        onVolumeChange={vi.fn()}
        openScores={openScores}
      />
    )
    const trophy = document.querySelector('.topColumn1 .scoresButton.navStackButton')
    expect(trophy).not.toBeNull()
    expect(trophy.previousElementSibling.classList.contains('speakerButton')).toBe(true)
    expect(trophy.querySelector('img').getAttribute('alt')).toBe('High scores')
    fireEvent.click(trophy)
    expect(openScores).toHaveBeenCalledTimes(1)
  })

  it('PlayPage trophy follows the help button, gets popUpStyle, and opens the scores', () => {
    vi.useFakeTimers()
    const openScores = vi.fn()
    render(
      <PlayPage
        background='bg.jpg'
        setHomePage={vi.fn()}
        setAudioPause={vi.fn()}
        setAudioPlay={vi.fn()}
        activeCurrentAudio={false}
        isActiveData={[]}
        isVolume={0.5}
        onVolumeChange={vi.fn()}
        openScores={openScores}
      />
    )
    const trophy = document.querySelector('.topColumn3 > .scoresButton.navStackButton')
    expect(trophy).not.toBeNull()
    expect(trophy.previousElementSibling.classList.contains('helpButton')).toBe(true)
    expect(trophy.style.cursor).toBe('pointer')
    fireEvent.click(trophy)
    expect(openScores).toHaveBeenCalledTimes(1)
    cleanup()
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it('MobileMenu shows a High scores row after How to Play that closes the menu', () => {
    const openScores = vi.fn()
    render(
      <MobileMenu
        forMusicIcon={vi.fn()}
        musicIcon='music.svg'
        openInstructions={vi.fn()}
        openScores={openScores}
        trophyIcon='trophy.svg'
        gitIcon='github.svg'
        isVolume={0.5}
        onVolumeChange={vi.fn()}
      />
    )
    fireEvent.click(document.querySelector('.hamburgerButton'))
    const labels = [...document.querySelectorAll('.mobileMenuLabel')].map(el => el.textContent)
    expect(labels.indexOf('High scores')).toBe(labels.indexOf('How to Play') + 1)
    fireEvent.click(screen.getByText('High scores'))
    expect(openScores).toHaveBeenCalledTimes(1)
    expect(document.querySelector('.mobileMenuBackdrop')).toBeNull()
  })
})

describe('HighScoresModal in MainSection', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
    vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve())
    vi.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
    globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ items: [] }) }))
  })

  afterEach(() => {
    cleanup()
    vi.clearAllTimers()
    vi.useRealTimers()
    vi.restoreAllMocks()
    localStorage.clear()
  })

  function openModal() {
    render(<MainSection />)
    fireEvent.click(document.querySelector('.topColumn1 .scoresButton'))
  }

  it('opens from the HomePage trophy with "No scores yet" when nothing is saved', () => {
    openModal()
    expect(document.querySelector('.instructionsBackdrop.scoresBackdrop .instructionsCard.scoresCard')).not.toBeNull()
    expect(screen.getByText('High scores')).toBeInTheDocument()
    expect(screen.getByText('No scores yet')).toBeInTheDocument()
  })

  it('lists the top 10 runs of the active tab with rank, name, and score / winCount', () => {
    const runs = Array.from({ length: 12 }, (_, i) => ({ name: 'P' + i, score: i, level: 'easy' }))
    runs.push({ name: 'H1', score: 15, level: 'hard' })
    localStorage.setItem('matchingGame_highScores', JSON.stringify(runs))
    openModal()
    const rows = document.querySelectorAll('.scoresCard .highScoresRow')
    expect(rows).toHaveLength(10)
    expect(rows[0].querySelector('.highScoresRank').textContent).toBe('1')
    expect(rows[0].querySelector('.highScoresName').textContent).toBe('P11')
    expect(rows[0].querySelector('.highScoresScore').textContent).toBe('11 / 16')
    expect(document.querySelector('.scoresCard .highScoresLevel')).toBeNull()
    expect(screen.queryByText('H1')).toBeNull()
  })

  it('shows Easy / Hard / Hardest tabs, opening on the current level', () => {
    openModal()
    const tabs = document.querySelectorAll('.scoresTabs .scoresTab')
    expect([...tabs].map(t => t.textContent)).toEqual(['Easy', 'Hard', 'Hardest'])
    expect(tabs[0].getAttribute('aria-selected')).toBe('true')
    expect(tabs[0].classList.contains('scoresTabActive')).toBe(true)
    expect(tabs[1].getAttribute('aria-selected')).toBe('false')
  })

  it('opens on the level picked on the home page', () => {
    render(<MainSection />)
    fireEvent.click(screen.getByText('Hard'))
    fireEvent.click(document.querySelector('.topColumn1 .scoresButton'))
    expect(document.querySelector('.scoresTab.scoresTabActive').textContent).toBe('Hard')
  })

  it('switches lists on tab click and arrow keys without closing or changing the level', () => {
    localStorage.setItem('matchingGame_highScores', JSON.stringify([
      { name: 'Goku', score: 16, level: 'easy' },
      { name: 'Vegeta', score: 15, level: 'hard' },
      { name: 'Gohan', score: 30 },
    ]))
    openModal()
    expect(document.querySelector('.scoresCard .highScoresName').textContent).toBe('Goku')

    fireEvent.click(document.querySelector('.scoresTabs').children[1])
    expect(document.querySelector('.scoresBackdrop')).not.toBeNull()
    expect(document.querySelector('.scoresCard .highScoresName').textContent).toBe('Vegeta')
    expect(document.querySelector('.scoresCard .highScoresScore').textContent).toBe('15 / 24')

    fireEvent.keyDown(document.querySelector('.scoresTab.scoresTabActive'), { key: 'ArrowRight' })
    expect(document.querySelector('.scoresTab.scoresTabActive').textContent).toBe('Hardest')
    expect(document.activeElement.textContent).toBe('Hardest')
    expect(document.querySelector('.scoresCard .highScoresScore').textContent).toBe('30 / 32')

    fireEvent.keyDown(document.activeElement, { key: 'ArrowRight' })
    expect(document.querySelector('.scoresTab.scoresTabActive').textContent).toBe('Easy')
    fireEvent.keyDown(document.activeElement, { key: 'ArrowLeft' })
    expect(document.querySelector('.scoresTab.scoresTabActive').textContent).toBe('Hardest')

    // The home page's selected level is untouched by tab switches.
    expect(document.querySelector('.levelButton.levelActive').textContent).toBe('Easy')
  })

  it('shows "No scores yet" on an empty tab', () => {
    localStorage.setItem('matchingGame_highScores', JSON.stringify([{ name: 'Goku', score: 16, level: 'easy' }]))
    openModal()
    expect(screen.queryByText('No scores yet')).toBeNull()
    fireEvent.click(document.querySelector('.scoresTabs').children[2])
    expect(screen.getByText('No scores yet')).toBeInTheDocument()
  })

  it('notes runs without a recorded level instead of listing them', () => {
    localStorage.setItem('matchingGame_highScores', JSON.stringify([
      { name: 'Krillin', score: 12 },
      { name: 'Yamcha', score: 3 },
    ]))
    openModal()
    expect(screen.queryByText('Krillin')).toBeNull()
    expect(screen.getByText('2 older runs without a recorded level')).toBeInTheDocument()
  })

  it('omits the older-runs note when every run has a known level', () => {
    localStorage.setItem('matchingGame_highScores', JSON.stringify([{ name: 'Goku', score: 16, level: 'easy' }]))
    openModal()
    expect(document.querySelector('.highScoresUnknown')).toBeNull()
  })

  it('re-reads storage on each open so a newly saved run shows without a reload', () => {
    openModal()
    act(() => { vi.advanceTimersByTime(400) })
    fireEvent.click(screen.getByText('Close'))
    expect(document.querySelector('.scoresBackdrop')).toBeNull()

    localStorage.setItem('matchingGame_highScores', JSON.stringify([{ name: 'Goku', score: 16, level: 'easy' }]))
    fireEvent.click(document.querySelector('.topColumn1 .scoresButton'))
    expect(document.querySelector('.scoresCard .highScoresName').textContent).toBe('Goku')
  })

  it('ignores backdrop taps during the 400ms ghost-click window, then closes on tap', () => {
    openModal()
    fireEvent.click(document.querySelector('.scoresBackdrop'))
    expect(document.querySelector('.scoresBackdrop')).not.toBeNull()
    act(() => { vi.advanceTimersByTime(400) })
    fireEvent.click(document.querySelector('.scoresCard'))
    expect(document.querySelector('.scoresBackdrop')).not.toBeNull()
    fireEvent.click(document.querySelector('.scoresBackdrop'))
    expect(document.querySelector('.scoresBackdrop')).toBeNull()
  })

  it('closes on Escape once the guard has passed', () => {
    openModal()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(document.querySelector('.scoresBackdrop')).not.toBeNull()
    act(() => { vi.advanceTimersByTime(400) })
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(document.querySelector('.scoresBackdrop')).toBeNull()
  })

  it('uses a gotItButton-styled Close button', () => {
    openModal()
    expect(screen.getByText('Close').classList.contains('gotItButton')).toBe(true)
  })
})
