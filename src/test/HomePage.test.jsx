import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import HomePage from '../HomePage.jsx'

const __dirname = dirname(fileURLToPath(import.meta.url))
const css = readFileSync(resolve(__dirname, '../style.css'), 'utf8')
const indexHtml = readFileSync(resolve(__dirname, '../../index.html'), 'utf8')

const defaultProps = {
  background: 'fake-bg.jpg',
  setPlayPage: vi.fn(),
  setAudioPause: vi.fn(),
  setAudioPlay: vi.fn(),
  activeCurrentAudio: false,
}

describe('HomePage', () => {
  it('renders the Fight button', () => {
    render(<HomePage {...defaultProps} />)
    expect(screen.getByText('Fight')).toBeInTheDocument()
  })

  it('renders the portfolio handle', () => {
    render(<HomePage {...defaultProps} />)
    expect(screen.getByText('@rsterenchak')).toBeInTheDocument()
  })
})

describe('Shenron framing images', () => {
  it('renders a shenronTop img so the dragon head appears at the top of the home screen', () => {
    render(<HomePage {...defaultProps} />)
    const topImg = document.querySelector('img.shenronTop')
    expect(topImg).not.toBeNull()
  })

  it('renders a shenronBottom img so the dragon tail appears at the bottom of the home screen', () => {
    render(<HomePage {...defaultProps} />)
    const bottomImg = document.querySelector('img.shenronBottom')
    expect(bottomImg).not.toBeNull()
  })

  it('shenronTop and shenronBottom imgs have aria-hidden so they are invisible to assistive technology', () => {
    render(<HomePage {...defaultProps} />)
    const topImg = document.querySelector('img.shenronTop')
    const bottomImg = document.querySelector('img.shenronBottom')
    expect(topImg.getAttribute('aria-hidden')).toBe('true')
    expect(bottomImg.getAttribute('aria-hidden')).toBe('true')
  })

  it('shenronTop CSS rule sets position absolute and pointer-events none so it does not interfere with clicks', () => {
    expect(css).toMatch(/\.shenronTop\s*\{[^}]*position:\s*absolute/)
    expect(css).toMatch(/\.shenronTop\s*\{[^}]*pointer-events:\s*none/)
  })

  it('shenronBottom CSS rule sets position absolute and pointer-events none', () => {
    expect(css).toMatch(/\.shenronBottom\s*\{[^}]*position:\s*absolute/)
    expect(css).toMatch(/\.shenronBottom\s*\{[^}]*pointer-events:\s*none/)
  })

  it('shenronTop base CSS height is 28vh as specified for desktop', () => {
    expect(css).toMatch(/\.shenronTop\s*\{[^}]*height:\s*28vh/)
  })

  it('shenronBottom base CSS height is 24vh as specified for desktop', () => {
    expect(css).toMatch(/\.shenronBottom\s*\{[^}]*height:\s*24vh/)
  })
})

describe('HomePage background layout', () => {
  it('homeSection base rule uses min-height: 100dvh so the background fills the full dynamic viewport without white strips on mobile', () => {
    const baseRuleMatch = css.match(/\.homeSection\s*\{([^}]+)\}/)
    expect(baseRuleMatch).not.toBeNull()
    const baseRule = baseRuleMatch[1]
    expect(baseRule).toContain('min-height: 100dvh')
    expect(baseRule).not.toMatch(/^\s*height:\s*100vh\b/m)
  })

  it('homeSection base rule includes -webkit-fill-available fallback so older iOS Safari fills the visible area', () => {
    const baseRuleMatch = css.match(/\.homeSection\s*\{([^}]+)\}/)
    expect(baseRuleMatch).not.toBeNull()
    const baseRule = baseRuleMatch[1]
    expect(baseRule).toContain('-webkit-fill-available')
  })
})

describe('Global html and body baseline', () => {
  it('body rule includes min-height: 100dvh so the body always covers the full dynamic viewport and leaves no white strips at the edges', () => {
    const bodyRuleMatch = css.match(/^body\s*\{([^}]+)\}/m)
    expect(bodyRuleMatch).not.toBeNull()
    const bodyRule = bodyRuleMatch[1]
    expect(bodyRule).toContain('min-height: 100dvh')
  })

  it('html rule explicitly zeros margin and padding to prevent browser-default whitespace at viewport edges', () => {
    const htmlRuleMatch = css.match(/^html\s*\{([^}]+)\}/m)
    expect(htmlRuleMatch).not.toBeNull()
    const htmlRule = htmlRuleMatch[1]
    expect(htmlRule).toMatch(/margin:\s*0/)
    expect(htmlRule).toMatch(/padding:\s*0/)
  })
})

describe('Background fade gradient', () => {
  it('homeSection::before applies a linear-gradient overlay using the safari chrome blend color to soften the edge seam', () => {
    const pseudoRuleMatch = css.match(/\.homeSection::before\s*\{([^}]+)\}/)
    expect(pseudoRuleMatch).not.toBeNull()
    const pseudoRule = pseudoRuleMatch[1]
    expect(pseudoRule).toContain('linear-gradient')
    expect(pseudoRule.toLowerCase()).toContain('#4a90d9')
  })
})

describe('Safari chrome meta tags and background blend', () => {
  it('index.html viewport meta includes viewport-fit=cover so iOS Safari extends the page into the status-bar and home-indicator safe areas', () => {
    expect(indexHtml).toContain('viewport-fit=cover')
  })

  it('index.html includes a theme-color meta tag so Safari tints the status-bar chrome to match the background instead of showing white', () => {
    expect(indexHtml).toMatch(/<meta[^>]+name="theme-color"/)
  })

  it('html CSS rule has a background-color so the Safari safe-area inset blends with the background image rather than showing white', () => {
    const htmlRuleMatch = css.match(/^html\s*\{([^}]+)\}/m)
    expect(htmlRuleMatch).not.toBeNull()
    expect(htmlRuleMatch[1]).toMatch(/background-color\s*:/)
  })

  it('body CSS rule has a background-color so the Safari safe-area inset blends with the background image rather than showing white', () => {
    const bodyRuleMatch = css.match(/^body\s*\{([^}]+)\}/m)
    expect(bodyRuleMatch).not.toBeNull()
    expect(bodyRuleMatch[1]).toMatch(/background-color\s*:/)
  })
})
