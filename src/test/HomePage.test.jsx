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

describe('Shenron framing images removed', () => {
  it('does not render a shenronTop img after removal', () => {
    render(<HomePage {...defaultProps} />)
    const topImg = document.querySelector('img.shenronTop')
    expect(topImg).toBeNull()
  })

  it('does not render a shenronBottom img after removal', () => {
    render(<HomePage {...defaultProps} />)
    const bottomImg = document.querySelector('img.shenronBottom')
    expect(bottomImg).toBeNull()
  })

  it('CSS has no .shenronTop rule after removal', () => {
    expect(css).not.toMatch(/\.shenronTop\s*\{/)
  })

  it('CSS has no .shenronBottom rule after removal', () => {
    expect(css).not.toMatch(/\.shenronBottom\s*\{/)
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

describe('DBZ logo drop shadow', () => {
  it('base .logoContainer rule applies a directional drop-shadow filter to lift the logo off the background', () => {
    const baseLogoMatch = css.match(/\.logoContainer\s*\{([^}]+)\}/)
    expect(baseLogoMatch).not.toBeNull()
    expect(baseLogoMatch[1]).toMatch(/filter:\s*drop-shadow/)
  })
})

describe('Nimbus cloud upsize and float animation', () => {
  it('renders logoContainer2 as an img element so filter: drop-shadow traces the cloud silhouette', () => {
    render(<HomePage {...defaultProps} />)
    const img = document.querySelector('img.logoContainer2')
    expect(img).not.toBeNull()
  })

  it('logoContainer2 img src includes the MemoryGameTitle asset', () => {
    render(<HomePage {...defaultProps} />)
    const img = document.querySelector('img.logoContainer2')
    expect(img.getAttribute('src')).toMatch(/MemoryGameTitle/)
  })

  it('logoContainer2 img has alt text so it is accessible', () => {
    render(<HomePage {...defaultProps} />)
    const img = document.querySelector('img.logoContainer2')
    expect(img.getAttribute('alt')).toBeTruthy()
  })

  it('CSS defines the nimbus-float keyframe for the hover animation', () => {
    expect(css).toMatch(/@keyframes\s+nimbus-float/)
  })

  it('961px breakpoint logoContainer2 rule applies the nimbus-float animation', () => {
    const mediaBlock = css.match(/@media\s*\(min-width:\s*961px\)[^{]*\{([\s\S]*?)(?=@media|\*\/|$)/)?.[1] ?? ''
    expect(mediaBlock).toMatch(/\.logoContainer2\s*\{[^}]*animation:\s*nimbus-float/)
  })

  it('961px breakpoint logoContainer2 rule applies a drop-shadow filter for the golden glow', () => {
    const mediaBlock = css.match(/@media\s*\(min-width:\s*961px\)[^{]*\{([\s\S]*?)(?=@media|\*\/|$)/)?.[1] ?? ''
    expect(mediaBlock).toMatch(/\.logoContainer2\s*\{[^}]*filter:\s*drop-shadow/)
  })

  it('961px breakpoint logoContainer2 has an upsized width larger than the pre-upsize 55vw', () => {
    const mediaBlock = css.match(/@media\s*\(min-width:\s*961px\)[^{]*\{([\s\S]*?)(?=@media|\*\/|$)/)?.[1] ?? ''
    const widthMatch = mediaBlock.match(/\.logoContainer2\s*\{[^}]*width:\s*([^;]+)/)
    expect(widthMatch).not.toBeNull()
    expect(widthMatch[1].trim()).not.toBe('55vw')
  })

  it('prefers-reduced-motion block disables logoContainer2 animation to respect motion sensitivity', () => {
    expect(css).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)[^{]*\{[^}]*\.logoContainer2[^}]*animation:\s*none/)
  })
})
