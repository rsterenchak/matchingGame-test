import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// jsdom has no Web Audio, so a minimal fake records the oscillator and gain
// nodes that playSfx schedules.

function makeFakeAudioContext() {
  const calls = { contexts: 0, oscillators: [], gains: [], resumes: 0 }

  function makeParam() {
    return {
      value: 0,
      events: [],
      setValueAtTime(v, t) { this.events.push(['set', v, t]) },
      exponentialRampToValueAtTime(v, t) { this.events.push(['ramp', v, t]) }
    }
  }

  class FakeAudioContext {
    constructor() {
      calls.contexts++
      this.state = 'suspended'
      this.currentTime = 0
      this.destination = { kind: 'destination' }
    }
    createOscillator() {
      const node = {
        type: 'sine',
        frequency: makeParam(),
        connected: [],
        connect(t) { this.connected.push(t); return t },
        start(t) { this.started = t },
        stop(t) { this.stopped = t }
      }
      calls.oscillators.push(node)
      return node
    }
    createGain() {
      const node = {
        gain: makeParam(),
        connected: [],
        connect(t) { this.connected.push(t); return t },
        disconnect() {}
      }
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

describe('Synthesized button sounds', () => {
  let calls
  let sfx

  beforeEach(async () => {
    vi.resetModules()
    const fake = makeFakeAudioContext()
    calls = fake.calls
    window.AudioContext = fake.FakeAudioContext
    sfx = await import('../sfx.js')
    sfx.setSfxEnabled(true)
  })

  afterEach(() => {
    delete window.AudioContext
  })

  it('creates the AudioContext lazily and only once', () => {
    expect(calls.contexts).toBe(0)
    sfx.playSfx('tap')
    sfx.playSfx('hit')
    sfx.playSfx('fight')
    expect(calls.contexts).toBe(1)
    expect(calls.resumes).toBe(1)
  })

  it('schedules a self-stopping oscillator through a gain envelope for tap', () => {
    sfx.playSfx('tap')
    expect(calls.oscillators.length).toBe(1)
    expect(calls.gains.length).toBe(1)
    const [osc] = calls.oscillators
    const [gain] = calls.gains
    expect(osc.type).toBe('square')
    expect(osc.connected).toEqual([gain])
    expect(gain.connected[0].kind).toBe('destination')
    expect(osc.started).toBe(0)
    expect(osc.stopped).toBeCloseTo(0.06, 10)
    // The envelope decays to near-silence by the time the oscillator stops.
    expect(gain.gain.events.at(-1)).toEqual(['ramp', 0.0001, osc.stopped])
  })

  it('schedules nothing while disabled', () => {
    sfx.setSfxEnabled(false)
    sfx.playSfx('tap')
    sfx.playSfx('miss')
    expect(calls.contexts).toBe(0)
    expect(calls.oscillators.length).toBe(0)
    expect(calls.gains.length).toBe(0)
  })

  it('scales the peak gain by volume squared', () => {
    sfx.setSfxVolume(0.5)
    sfx.playSfx('hit')
    const quarter = calls.gains[0].gain.events[0][1]
    sfx.setSfxVolume(1)
    sfx.playSfx('hit')
    const full = calls.gains[1].gain.events[0][1]
    expect(quarter / full).toBeCloseTo(0.25, 10)
  })

  it('sweeps the fight and miss sounds in the right direction', () => {
    sfx.playSfx('fight')
    sfx.playSfx('miss')
    const [fight, miss] = calls.oscillators
    expect(fight.frequency.events[0]).toEqual(['set', 220, 0])
    expect(fight.frequency.events[1][1]).toBe(880)
    expect(miss.frequency.events[0]).toEqual(['set', 330, 0])
    expect(miss.frequency.events[1][1]).toBe(110)
  })

  it('never throws when Web Audio is missing or broken', () => {
    delete window.AudioContext
    expect(() => sfx.playSfx('tap')).not.toThrow()

    window.AudioContext = class { constructor() { throw new Error('nope') } }
    expect(() => sfx.playSfx('tap')).not.toThrow()
  })
})
