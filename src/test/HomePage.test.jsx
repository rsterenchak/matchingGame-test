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

describe('Volume slider correct fill colors (regression: was dark blob)', () => {
  it('CSS .volumeSliderWrapper has white background so the yellow fill shows against a light track', () => {
    expect(css).toMatch(/\.volumeSliderWrapper\s*\{[^}]*background:\s*white/)
  })

  it('CSS .volumeSliderInput::-webkit-slider-thumb has yellow background so the thumb is readable on the white track', () => {
    expect(css).toMatch(/\.volumeSliderInput::-webkit-slider-thumb\s*\{[^}]*background:\s*yellow/)
  })

  it('CSS .volumeSliderInput::-webkit-slider-thumb border is 2px solid black so the thumb contrasts against yellow', () => {
    expect(css).toMatch(/\.volumeSliderInput::-webkit-slider-thumb\s*\{[^}]*border:\s*2px solid black/)
  })

  it('HomePage volume slider input uses yellow-on-grey fill gradient matching the white-track design', () => {
    render(<HomePage {...defaultProps} isVolume={0.5} onVolumeChange={vi.fn()} />)
    const sliderInput = document.querySelector('.volumeSliderInput')
    expect(sliderInput.style.background).toContain('yellow')
    expect(sliderInput.style.background).not.toContain('rgba(0,0,0')
  })
})

describe('Fight button prominence', () => {
  it('base .fightButton rule uses 3px solid black border to match the button family', () => {
    const match = css.match(/\.fightButton\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toMatch(/border:\s*3px solid black/)
  })

  it('base .fightButton rule has height >= 80px so the button is visually prominent', () => {
    const match = css.match(/\.fightButton\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    const heightMatch = match[1].match(/height:\s*(\d+)px/)
    expect(heightMatch).not.toBeNull()
    expect(parseInt(heightMatch[1], 10)).toBeGreaterThanOrEqual(80)
  })

  it('base .fightButton rule has width >= 250px so the button is visually prominent', () => {
    const match = css.match(/\.fightButton\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    const widthMatch = match[1].match(/width:\s*(\d+)px/)
    expect(widthMatch).not.toBeNull()
    expect(parseInt(widthMatch[1], 10)).toBeGreaterThanOrEqual(250)
  })

  it('.fightButton:before has opacity: 1 so the glow halo is always visible', () => {
    const match = css.match(/\.fightButton:before\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toMatch(/opacity:\s*1\b/)
  })

  it('base .fightButton rule keeps font-size modest (≤ 22px) so text does not crowd the larger box', () => {
    const match = css.match(/\.fightButton\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    const fontSizeMatch = match[1].match(/font-size:\s*(\d+)px/)
    expect(fontSizeMatch).not.toBeNull()
    expect(parseInt(fontSizeMatch[1], 10)).toBeLessThanOrEqual(22)
  })
})

describe('Volume slider border and glow halo', () => {
  it('.volumeSliderWrapper base rule has border: 3px solid black to match the button family', () => {
    const match = css.match(/\.volumeSliderWrapper\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toMatch(/border:\s*3px solid black/)
  })

  it('.volumeSliderWrapper:before rule has opacity: 0 so the glow is hidden by default', () => {
    const match = css.match(/\.volumeSliderWrapper:before\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toMatch(/opacity:\s*0/)
  })

  it('.volumeSliderWrapper:hover:before rule has opacity: 1 so the glow appears on hover', () => {
    const match = css.match(/\.volumeSliderWrapper:hover:before\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toMatch(/opacity:\s*1/)
  })

  it('.volumeSliderWrapper:before uses an animation that reuses an existing glowing keyframe', () => {
    const match = css.match(/\.volumeSliderWrapper:before\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toMatch(/animation:\s*glowing/)
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

  it('nimbus-float keyframe 50% frame uses only translateY with no rotation so the cloud bobs vertically', () => {
    const start = css.indexOf('@keyframes nimbus-float')
    const end = css.indexOf('\n}', start) + 2
    const keyframeBlock = css.slice(start, end)
    expect(keyframeBlock).toMatch(/50%\s*\{\s*transform:\s*translateY\([^)]+\)\s*;\s*\}/)
    expect(keyframeBlock).not.toMatch(/rotate/)
  })

  it('nimbus-float keyframe 50% frame uses translateY(-5px) for the gentle 5px bob', () => {
    const start = css.indexOf('@keyframes nimbus-float')
    const end = css.indexOf('\n}', start) + 2
    const keyframeBlock = css.slice(start, end)
    expect(keyframeBlock).toContain('translateY(-5px)')
  })

  it('961px breakpoint logoContainer2 animation duration is 5s for a slower, calmer cycle', () => {
    const mediaBlock = css.match(/@media\s*\(min-width:\s*961px\)[^{]*\{([\s\S]*?)(?=@media|\*\/|$)/)?.[1] ?? ''
    expect(mediaBlock).toMatch(/\.logoContainer2\s*\{[^}]*animation:\s*nimbus-float\s+5s/)
  })
})

describe('Fight button Safari bottom bar clearance (regression: was missing safe-area inset)', () => {
  it('base .inputSection rule includes env(safe-area-inset-bottom) so the Fight button clears the Safari home-indicator bar', () => {
    const baseRuleMatch = css.match(/^\.inputSection\s*\{([^}]+)\}/m)
    expect(baseRuleMatch).not.toBeNull()
    expect(baseRuleMatch[1]).toContain('env(safe-area-inset-bottom)')
  })

  it('320px breakpoint .inputSection padding-bottom includes env(safe-area-inset-bottom) for phone-portrait Safari clearance', () => {
    const media320Block = css.match(/@media\s*\(min-width:\s*320px\)\s*\{([\s\S]*?)(?=@media)/)?.[1] ?? ''
    const inputMatch = media320Block.match(/\.inputSection\s*\{([^}]+)\}/)
    expect(inputMatch).not.toBeNull()
    expect(inputMatch[1]).toContain('env(safe-area-inset-bottom)')
  })

  it('481px breakpoint .inputSection padding-bottom includes env(safe-area-inset-bottom) for larger phone Safari clearance', () => {
    const media481Block = css.match(/@media\s*\(min-width:\s*481px\)\s*\{([\s\S]*?)(?=@media)/)?.[1] ?? ''
    const inputMatch = media481Block.match(/\.inputSection\s*\{([^}]+)\}/)
    expect(inputMatch).not.toBeNull()
    expect(inputMatch[1]).toContain('env(safe-area-inset-bottom)')
  })
})

describe('Nimbus cloud 641–960px position fix (regression: drifted up and overlapped DBZ title at tall viewport heights)', () => {
  it('641px breakpoint defines a .logoContainer2 rule so the cloud has its own positioning instead of falling through to the over-aggressive 481px values', () => {
    const media641Block = css.match(/@media\s*\(min-width:\s*641px\)[^{]*\{([\s\S]*?)(?=@media|\*\/|$)/)?.[1] ?? ''
    expect(media641Block).toMatch(/\.logoContainer2\s*\{/)
  })

  it('641px .logoContainer2 top offset is at most 12vh so the cloud does not push up into the DBZ title at tall viewport heights (like 938x1273)', () => {
    const media641Block = css.match(/@media\s*\(min-width:\s*641px\)[^{]*\{([\s\S]*?)(?=@media|\*\/|$)/)?.[1] ?? ''
    const ruleMatch = media641Block.match(/\.logoContainer2\s*\{([^}]+)\}/)
    expect(ruleMatch).not.toBeNull()
    const topMatch = ruleMatch[1].match(/top:\s*-(\d+(?:\.\d+)?)vh/)
    expect(topMatch).not.toBeNull()
    expect(parseFloat(topMatch[1])).toBeLessThanOrEqual(12)
  })

  it('641px .logoContainer2 has left: 0 so the parent flex centering keeps the cloud centered without a positional offset drifting it sideways', () => {
    const media641Block = css.match(/@media\s*\(min-width:\s*641px\)[^{]*\{([\s\S]*?)(?=@media|\*\/|$)/)?.[1] ?? ''
    const ruleMatch = media641Block.match(/\.logoContainer2\s*\{([^}]+)\}/)
    expect(ruleMatch).not.toBeNull()
    expect(ruleMatch[1]).toMatch(/left:\s*0\b/)
  })
})

describe('Home page 641–960px layout audit (DBZ logo min-height and grid row)', () => {
  it('641px breakpoint .logoContainer has min-height >= 200px so the DBZ title has adequate height across the wide tablet range', () => {
    const media641Block = css.match(/@media\s*\(min-width:\s*641px\)[^{]*\{([\s\S]*?)(?=@media|\*\/|$)/)?.[1] ?? ''
    const ruleMatch = media641Block.match(/\.logoContainer\s*\{([^}]+)\}/)
    expect(ruleMatch).not.toBeNull()
    const minHeightMatch = ruleMatch[1].match(/min-height:\s*(\d+)px/)
    expect(minHeightMatch).not.toBeNull()
    expect(parseInt(minHeightMatch[1], 10)).toBeGreaterThanOrEqual(200)
  })

  it('641px breakpoint .outerSection grid-template-rows logo fraction exceeds the 481px 1.4fr so proportions widen with the viewport', () => {
    const media641Block = css.match(/@media\s*\(min-width:\s*641px\)[^{]*\{([\s\S]*?)(?=@media|\*\/|$)/)?.[1] ?? ''
    const ruleMatch = media641Block.match(/\.outerSection\s*\{([^}]+)\}/)
    expect(ruleMatch).not.toBeNull()
    const rowsMatch = ruleMatch[1].match(/grid-template-rows:\s*\S+\s+(\S+)/)
    expect(rowsMatch).not.toBeNull()
    expect(parseFloat(rowsMatch[1])).toBeGreaterThan(1.4)
  })
})

describe('Nimbus cloud letterform overlap fix (regression: cloud covered DBZ letters at 481px, 641px, 1281px breakpoints)', () => {
  it('481px .logoContainer2 top offset is at most 12vh so the cloud sits below the DBZ title letters rather than across them', () => {
    const media481Block = css.match(/@media\s*\(min-width:\s*481px\)[^{]*\{([\s\S]*?)(?=@media|\*\/|$)/)?.[1] ?? ''
    const ruleMatch = media481Block.match(/\.logoContainer2\s*\{([^}]+)\}/)
    expect(ruleMatch).not.toBeNull()
    const topMatch = ruleMatch[1].match(/top:\s*-(\d+(?:\.\d+)?)vh/)
    expect(topMatch).not.toBeNull()
    expect(parseFloat(topMatch[1])).toBeLessThanOrEqual(12)
  })

  it('641px .logoContainer2 top offset is at most 6vh so the cloud clears the letter baseline at the start of the 641px range', () => {
    const media641Block = css.match(/@media\s*\(min-width:\s*641px\)[^{]*\{([\s\S]*?)(?=@media|\*\/|$)/)?.[1] ?? ''
    const ruleMatch = media641Block.match(/\.logoContainer2\s*\{([^}]+)\}/)
    expect(ruleMatch).not.toBeNull()
    const topMatch = ruleMatch[1].match(/top:\s*-(\d+(?:\.\d+)?)vh/)
    expect(topMatch).not.toBeNull()
    expect(parseFloat(topMatch[1])).toBeLessThanOrEqual(6)
  })

  it('1281px .logoContainer2 top offset is at most 18vh so the enlarged cloud does not cover the DBZ letters on wide viewports', () => {
    const media1281Block = css.match(/@media\s*\(min-width:\s*1281px\)[^{]*\{([\s\S]*?)(?=@media|\*\/|$)/)?.[1] ?? ''
    const ruleMatch = media1281Block.match(/\.logoContainer2\s*\{([^}]+)\}/)
    expect(ruleMatch).not.toBeNull()
    const topMatch = ruleMatch[1].match(/top:\s*-(\d+(?:\.\d+)?)vh/)
    expect(topMatch).not.toBeNull()
    expect(parseFloat(topMatch[1])).toBeLessThanOrEqual(18)
  })
})

describe('Home screen fits within the viewport at 1281px (regression: stacked column overflowed below the fold)', () => {
  const media1281Block = css.match(/@media\s*\(min-width:\s*1281px\)[^{]*\{([\s\S]*?)(?=@media|\*\/|$)/)?.[1] ?? ''

  it('1281px .logoContainer min-height does not exceed the working 1025px value of 220px', () => {
    const ruleMatch = media1281Block.match(/\.logoContainer\s*\{([^}]+)\}/)
    expect(ruleMatch).not.toBeNull()
    const minHeightMatch = ruleMatch[1].match(/min-height:\s*([\d.]+)px/)
    expect(minHeightMatch).not.toBeNull()
    expect(parseFloat(minHeightMatch[1])).toBeLessThanOrEqual(220)
  })

  it('1281px .logoContainer2 does not pin a fixed pixel height taller than the working 1025px cloud (315px)', () => {
    const ruleMatch = media1281Block.match(/\.logoContainer2\s*\{([^}]+)\}/)
    expect(ruleMatch).not.toBeNull()
    const fixedHeightMatch = ruleMatch[1].match(/(?<![\w-])height:\s*([\d.]+)px/)
    if (fixedHeightMatch) {
      expect(parseFloat(fixedHeightMatch[1])).toBeLessThanOrEqual(315)
    }
  })

  it('1281px .inputSection bottom padding does not exceed the working 1025px value of 8vh', () => {
    const ruleMatch = media1281Block.match(/\.inputSection\s*\{([^}]+)\}/)
    expect(ruleMatch).not.toBeNull()
    const padMatch = ruleMatch[1].match(/padding-bottom:\s*([\d.]+)vh/)
    expect(padMatch).not.toBeNull()
    expect(parseFloat(padMatch[1])).toBeLessThanOrEqual(8)
  })
})
