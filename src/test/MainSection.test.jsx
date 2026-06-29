import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const source = readFileSync(resolve(__dirname, '../MainSection.jsx'), 'utf8')

describe('Background music volume', () => {
  it('defaults the music volume to ~0.003 when no saved value exists', () => {
    // The fallback after the localStorage lookup is the hardcoded default volume.
    const match = source.match(/parseFloat\(saved\)\s*:\s*([0-9.]+)/)
    expect(match).not.toBeNull()
    const fallback = parseFloat(match[1])
    expect(fallback).toBeCloseTo(0.003, 4)
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

describe('Persistent Audio instances (overlapping-instance fix)', () => {
  // Regression guard for the bug where MainSection re-instantiated `new Audio(...)`
  // on every render of each Handle*Audio component. The stale instances kept playing
  // (the useEffect cleanup only paused the one captured in its render), stacking
  // tracks and making the music far louder than the set volume. The fix lazily
  // constructs each track's Audio inside a useRef so exactly one instance survives
  // re-renders. These assertions lock that in so a future edit can't reintroduce a
  // bare `new Audio(...)` in the component body.

  it('never constructs Audio bare in the component body (old leaking pattern is gone)', () => {
    // The pre-fix code did `const audioElement = new Audio(...)` directly in render.
    expect(source).not.toMatch(/const\s+audioElement\s*=\s*new Audio/)
    expect(source).not.toMatch(/audioElement\.volume/)
  })

  it('lazily constructs each track instance inside a useRef guard', () => {
    const refs = source.match(/const audioRef = useRef\(null\)/g) || []
    const guards = source.match(/if \(audioRef\.current === null\)/g) || []
    const constructs = source.match(/audioRef\.current = a/g) || []
    const newAudio = source.match(/new Audio\(/g) || []
    // One ref, one lazy-init guard, one assignment, one construction per helper (4 total),
    // and every `new Audio(` lives behind that guard.
    expect(refs.length).toBe(4)
    expect(guards.length).toBe(4)
    expect(constructs.length).toBe(4)
    expect(newAudio.length).toBe(4)
  })

  it('sets volume on the single persistent instance, not a throwaway', () => {
    expect(source).toMatch(/audioRef\.current\.volume = volumeLevel/)
  })

  it('drives play and cleanup-pause through the same ref instance', () => {
    expect(source).toMatch(/audioRef\.current\.play\(\)/)
    expect(source).toMatch(/audioRef\.current\.pause\(\)/)
  })

  it('keeps looping and the autoplay .then/.catch guard intact', () => {
    const loops = source.match(/a\.loop = true/g) || []
    expect(loops.length).toBe(4)
    expect(source).toMatch(/\.catch\(/)
  })
})

describe('No overlapping playback (play()/pause() race fix)', () => {
  // Regression guard for the bug where switching pages or toggling audio could
  // leave a track playing on top of the active one. Each "play" helper calls
  // audioRef.current.play(), which returns a promise. If the helper unmounted
  // before that promise resolved, the cleanup's pause() ran first and the pending
  // play then started the instance again — an orphaned, stacked track that nothing
  // paused. The fix tracks a `cancelled` flag: cleanup sets it, and the resolved
  // play promise pauses the instance when it sees the helper was cancelled.

  it('arms a cancellation flag in each play helper before awaiting play()', () => {
    // Both play helpers (home + play tracks) declare the guard.
    const armed = source.match(/let cancelled = false/g) || []
    expect(armed.length).toBe(2)
  })

  it('flips the flag in cleanup so a late-resolving play() is undone', () => {
    const flipped = source.match(/cancelled = true/g) || []
    expect(flipped.length).toBe(2)
  })

  it('pauses the instance when a play() resolves after cancellation', () => {
    // The resolved-play handler must re-pause when cancelled, killing the orphan.
    const guarded = source.match(/if \(cancelled\) \{\s*audioRef\.current\.pause\(\)/g) || []
    expect(guarded.length).toBe(2)
  })
})
