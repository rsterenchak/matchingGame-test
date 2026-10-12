// Tests that every source file has a purpose comment and an area in codemap.json, and that codetour.json still compiles.
import { describe, it, expect } from 'vitest'
import { createRequire } from 'module'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const { buildWebManifest, buildWebTours } = require('../../scripts/gen-src-manifest.cjs')

const srcDir = resolve(__dirname, '..')

describe('Code map', () => {
  const warnings = []
  const manifest = buildWebManifest({ srcDir, warn: w => warnings.push(w) })

  it('reads codemap.json without drift warnings', () => {
    expect(manifest.areas).toHaveLength(4)
    expect(warnings).toEqual([])
  })

  it('every module opens with a purpose comment', () => {
    const missing = manifest.modules.filter(m => !m.purpose).map(m => m.path)
    expect(missing).toEqual([])
  })

  it('every module is in exactly one area', () => {
    manifest.modules.forEach(m => {
      const owners = manifest.areas.filter(a => a.files.includes(m.path)).map(a => a.id)
      expect(owners, m.path).toHaveLength(1)
    })
  })
})

describe('Code tours', () => {
  const warnings = []
  const tours = buildWebTours({ srcDir, warn: w => warnings.push(w) })

  it('compile with no dropped steps', () => {
    expect(warnings).toEqual([])
    expect(tours.tours).toHaveLength(5)
  })

  it('keep every step title and why within limits', () => {
    tours.tours.forEach(tour => {
      expect(tour.steps.length, tour.id).toBeGreaterThanOrEqual(4)
      expect(tour.steps.length, tour.id).toBeLessThanOrEqual(8)
      tour.steps.forEach(step => {
        expect(step.title.length, step.title).toBeLessThanOrEqual(60)
        expect(step.why.length, step.why).toBeLessThanOrEqual(140)
      })
    })
  })
})
