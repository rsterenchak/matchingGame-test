import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, act, cleanup } from '@testing-library/react'

// Regression guard for music playing at full volume on iOS. iOS Safari ignores
// HTMLMediaElement.volume, so the volume slider had no effect there. The fix routes
// each playing track through a shared AudioContext GainNode and drives gain.value
// from the slider instead. jsdom has no Web Audio, so a minimal fake records the
// graph that MainSection builds.

function makeFakeAudioContext() {
  const calls = { contexts: 0, sources: [], gains: [], resumes: 0 }
  class FakeAudioContext {
    constructor() {
      calls.contexts++
      this.state = 'suspended'
      this.destination = { kind: 'destination' }
    }
    createMediaElementSource(el) {
      const node = { el, connected: [], connect(t) { this.connected.push(t); return t } }
      calls.sources.push(node)
      return node
    }
    createGain() {
      const node = { gain: { value: 1 }, connected: [], connect(t) { this.connected.push(t); return t } }
      calls.gains.push(node)
      return node
    }
    resume() {
      calls.resumes++
      this.state = 'running'
      return Promise.resolve()
    }
  }
  return { FakeAudioContext, calls }
}

describe('Volume control via Web Audio GainNode (iOS full-volume fix)', () => {
  let calls
  let played

  beforeEach(() => {
    vi.resetModules()
    localStorage.clear()
    const fake = makeFakeAudioContext()
    calls = fake.calls
    window.AudioContext = fake.FakeAudioContext
    played = []
    vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(function () {
      played.push(this)
      return Promise.resolve()
    })
    vi.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
    globalThis.fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve({ items: [] }) }))
  })

  afterEach(() => {
    cleanup()
    delete window.AudioContext
    vi.restoreAllMocks()
  })

  async function renderAndStartMusic() {
    const { default: MainSection } = await import('../MainSection.jsx')
    const utils = render(<MainSection />)
    await act(async () => {
      fireEvent.click(utils.container.querySelector('.musicBlock'))
    })
    return utils
  }

  it('routes the playing track through a GainNode tapered like the old a.volume', async () => {
    await renderAndStartMusic()
    expect(calls.contexts).toBe(1)
    expect(calls.sources.length).toBe(1)
    expect(calls.gains.length).toBe(1)
    const [source] = calls.sources
    const [gain] = calls.gains
    expect(source.connected).toEqual([gain])
    expect(gain.connected.length).toBe(1)
    expect(gain.connected[0].kind).toBe('destination')
    // Default volume 0.003 keeps the same squared curve, now applied by the gain.
    expect(gain.gain.value).toBeCloseTo(0.003 ** 2, 10)
    // The element itself stays at full volume so the taper isn't applied twice.
    expect(source.el.volume).toBe(1)
    expect(calls.resumes).toBe(1)
  })

  it('moves gain.value when the volume slider changes', async () => {
    const { container } = await renderAndStartMusic()
    const slider = container.querySelector('.volumeSliderInput')
    await act(async () => {
      fireEvent.change(slider, { target: { value: '0.5' } })
    })
    expect(calls.gains[0].gain.value).toBeCloseTo(0.25, 10)
  })

  it('builds the media element source only once per track across toggles', async () => {
    const { container } = await renderAndStartMusic()
    const toggle = container.querySelector('.musicBlock')
    await act(async () => { fireEvent.click(toggle) })
    await act(async () => { fireEvent.click(toggle) })
    // Re-enabling music remounts the home helper with a fresh element, but the
    // shared context is reused rather than recreated.
    expect(calls.contexts).toBe(1)
    const els = calls.sources.map(s => s.el)
    expect(new Set(els).size).toBe(els.length)
  })

  it('falls back to a.volume when the browser has no AudioContext', async () => {
    delete window.AudioContext
    const { container } = await renderAndStartMusic()
    expect(calls.contexts).toBe(0)
    const slider = container.querySelector('.volumeSliderInput')
    await act(async () => {
      fireEvent.change(slider, { target: { value: '0.5' } })
    })
    expect(calls.gains.length).toBe(0)
    expect(played.length).toBe(1)
    expect(played[0].volume).toBeCloseTo(0.25, 10)
  })
})
