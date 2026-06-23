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

  it('base logoContainer2 rule lifts the nimbus up via a negative Y translate so it sits ~20% higher without reflowing siblings', () => {
    const baseRuleMatch = css.match(/^\.logoContainer2\s*\{([^}]+)\}/m)
    expect(baseRuleMatch).not.toBeNull()
    const translateMatch = baseRuleMatch[1].match(/translate:\s*\S+\s+-(\d+(?:\.\d+)?)%/)
    expect(translateMatch).not.toBeNull()
    expect(parseFloat(translateMatch[1])).toBeGreaterThan(0)
  })

  it('base logoContainer2 nimbus lift magnitude is roughly 20% (10–40% band) so the upward nudge stays a nudge', () => {
    const baseRuleMatch = css.match(/^\.logoContainer2\s*\{([^}]+)\}/m)
    expect(baseRuleMatch).not.toBeNull()
    const translateMatch = baseRuleMatch[1].match(/translate:\s*\S+\s+-(\d+(?:\.\d+)?)%/)
    expect(translateMatch).not.toBeNull()
    const magnitude = parseFloat(translateMatch[1])
    expect(magnitude).toBeGreaterThanOrEqual(10)
    expect(magnitude).toBeLessThanOrEqual(40)
  })

  it('base logoContainer2 nimbus lift uses translate (not top/margin-top) so no sibling layout shifts', () => {
    const baseRuleMatch = css.match(/^\.logoContainer2\s*\{([^}]+)\}/m)
    expect(baseRuleMatch).not.toBeNull()
    expect(baseRuleMatch[1]).not.toMatch(/(?<!-)\btop:\s*-/)
    expect(baseRuleMatch[1]).not.toMatch(/margin-top:/)
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

  // Extract a media block by index so inline /* ... */ comments (which contain
  // `*/`) inside a rule do not truncate the captured block.
  const sliceMediaBlock = (startNeedle) => {
    const start = css.indexOf(startNeedle)
    if (start === -1) return ''
    const next = css.indexOf('@media', start + startNeedle.length)
    return css.slice(start, next === -1 ? css.length : next)
  }

  it('961px breakpoint logoContainer2 shifts the nimbus 10% left and 10% down via translate(-10% -10%)', () => {
    const ruleMatch = sliceMediaBlock('@media (min-width:961px)').match(/\.logoContainer2\s*\{([\s\S]*?)\}/)
    expect(ruleMatch).not.toBeNull()
    expect(ruleMatch[1]).toMatch(/translate:\s*-10%\s+-10%/)
  })

  it('1281px breakpoint logoContainer2 shifts the nimbus 10% left and 10% down via translate(-10% -10%)', () => {
    const ruleMatch = sliceMediaBlock('@media (min-width:1281px)').match(/\.logoContainer2\s*\{([\s\S]*?)\}/)
    expect(ruleMatch).not.toBeNull()
    expect(ruleMatch[1]).toMatch(/translate:\s*-10%\s+-10%/)
  })

  it('desktop nimbus shift keeps the Y at -10% (base -20% lift plus a 10% downward nudge)', () => {
    const ruleMatch = sliceMediaBlock('@media (min-width:961px)').match(/\.logoContainer2\s*\{([\s\S]*?)\}/)
    expect(ruleMatch).not.toBeNull()
    const translateMatch = ruleMatch[1].match(/translate:\s*(-?\d+(?:\.\d+)?%)\s+(-?\d+(?:\.\d+)?%)/)
    expect(translateMatch).not.toBeNull()
    expect(translateMatch[1]).toBe('-10%')
    expect(translateMatch[2]).toBe('-10%')
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

describe('Fight button lifted up beneath the Nimbus on mobile (regression: button sat in the lower portion over Safari chrome)', () => {
  it('320px .inputSection aligns content to the top so the Fight button sits just below the Nimbus instead of centered in the lower portion', () => {
    const media320Block = css.match(/@media\s*\(min-width:\s*320px\)\s*\{([\s\S]*?)(?=@media)/)?.[1] ?? ''
    const inputMatch = media320Block.match(/\.inputSection\s*\{([^}]+)\}/)
    expect(inputMatch).not.toBeNull()
    expect(inputMatch[1]).toMatch(/justify-content:\s*flex-start/)
  })

  it('320px .inputSection has a small top gap (≤12px) so the Fight button nearly touches the Nimbus above it', () => {
    const media320Block = css.match(/@media\s*\(min-width:\s*320px\)\s*\{([\s\S]*?)(?=@media)/)?.[1] ?? ''
    const inputMatch = media320Block.match(/\.inputSection\s*\{([^}]+)\}/)
    expect(inputMatch).not.toBeNull()
    const padTop = inputMatch[1].match(/padding-top:\s*([\d.]+)px/)
    expect(padTop).not.toBeNull()
    expect(parseFloat(padTop[1])).toBeLessThanOrEqual(12)
  })

  it('481px .inputSection aligns content to the top so the Fight button is lifted up beneath the Nimbus', () => {
    const media481Block = css.match(/@media\s*\(min-width:\s*481px\)\s*\{([\s\S]*?)(?=@media)/)?.[1] ?? ''
    const inputMatch = media481Block.match(/\.inputSection\s*\{([^}]+)\}/)
    expect(inputMatch).not.toBeNull()
    expect(inputMatch[1]).toMatch(/justify-content:\s*flex-start/)
  })
})

describe('Goku gif base sits flush against the Fight button on mobile (zero gap, no overlap)', () => {
  it('320px .inputSection has zero top padding so the Fight button sits flush against the Nimbus base above it', () => {
    const media320Block = css.match(/@media\s*\(min-width:\s*320px\)\s*\{([\s\S]*?)(?=@media)/)?.[1] ?? ''
    const inputMatch = media320Block.match(/\.inputSection\s*\{([^}]+)\}/)
    expect(inputMatch).not.toBeNull()
    const padTop = inputMatch[1].match(/padding-top:\s*([\d.]+)px/)
    expect(padTop).not.toBeNull()
    expect(parseFloat(padTop[1])).toBe(0)
  })

  it('481px .inputSection has zero top padding so the Fight button sits flush against the Nimbus base above it', () => {
    const media481Block = css.match(/@media\s*\(min-width:\s*481px\)\s*\{([\s\S]*?)(?=@media)/)?.[1] ?? ''
    const inputMatch = media481Block.match(/\.inputSection\s*\{([^}]+)\}/)
    expect(inputMatch).not.toBeNull()
    const padTop = inputMatch[1].match(/padding-top:\s*([\d.]+)px/)
    expect(padTop).not.toBeNull()
    expect(parseFloat(padTop[1])).toBe(0)
  })
})

describe('Nimbus cloud 641–960px position fix (regression: drifted up and overlapped DBZ title at tall viewport heights)', () => {
  it('641px breakpoint defines a .logoContainer2 rule so the cloud has its own positioning instead of falling through to the over-aggressive 481px values', () => {
    const media641Block = css.match(/@media\s*\(min-width:\s*641px\)[^{]*\{([\s\S]*?)(?=@media|\*\/|$)/)?.[1] ?? ''
    expect(media641Block).toMatch(/\.logoContainer2\s*\{/)
  })

  it('641px .logoContainer2 uses no large negative top or margin-top (single-digit vh or absent) so the grid overflow cannot be reintroduced at tall viewport heights', () => {
    const media641Block = css.match(/@media\s*\(min-width:\s*641px\)[^{]*\{([\s\S]*?)(?=@media|\*\/|$)/)?.[1] ?? ''
    const ruleMatch = media641Block.match(/\.logoContainer2\s*\{([^}]+)\}/)
    expect(ruleMatch).not.toBeNull()
    const topMatch = ruleMatch[1].match(/top:\s*-(\d+(?:\.\d+)?)vh/)
    const marginMatch = ruleMatch[1].match(/margin-top:\s*-(\d+(?:\.\d+)?)vh/)
    if (topMatch) expect(parseFloat(topMatch[1])).toBeLessThan(10)
    if (marginMatch) expect(parseFloat(marginMatch[1])).toBeLessThan(10)
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
  it('481px .logoContainer2 uses no large negative top or margin-top (single-digit vh or absent) so the grid overflow cannot be reintroduced on mid-size phones', () => {
    const media481Block = css.match(/@media\s*\(min-width:\s*481px\)[^{]*\{([\s\S]*?)(?=@media|\*\/|$)/)?.[1] ?? ''
    const ruleMatch = media481Block.match(/\.logoContainer2\s*\{([^}]+)\}/)
    expect(ruleMatch).not.toBeNull()
    const topMatch = ruleMatch[1].match(/top:\s*-(\d+(?:\.\d+)?)vh/)
    const marginMatch = ruleMatch[1].match(/margin-top:\s*-(\d+(?:\.\d+)?)vh/)
    if (topMatch) expect(parseFloat(topMatch[1])).toBeLessThan(10)
    if (marginMatch) expect(parseFloat(marginMatch[1])).toBeLessThan(10)
  })

  it('641px .logoContainer2 uses no large negative top so the cloud does not cover the DBZ letter baseline (structural guard)', () => {
    const media641Block = css.match(/@media\s*\(min-width:\s*641px\)[^{]*\{([\s\S]*?)(?=@media|\*\/|$)/)?.[1] ?? ''
    const ruleMatch = media641Block.match(/\.logoContainer2\s*\{([^}]+)\}/)
    expect(ruleMatch).not.toBeNull()
    const topMatch = ruleMatch[1].match(/top:\s*-(\d+(?:\.\d+)?)vh/)
    const marginMatch = ruleMatch[1].match(/margin-top:\s*-(\d+(?:\.\d+)?)vh/)
    if (topMatch) expect(parseFloat(topMatch[1])).toBeLessThan(10)
    if (marginMatch) expect(parseFloat(marginMatch[1])).toBeLessThan(10)
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

describe('Mobile nimbus cloud structural layout guards (regression: large offsets caused overflow or logo overlap)', () => {
  it('base .outerSection grid-template-areas has nav/logo/logoSection2/input in order so the four-row structural layout is preserved', () => {
    const baseRuleMatch = css.match(/^\.outerSection\s*\{([^}]+)\}/m)
    expect(baseRuleMatch).not.toBeNull()
    const areas = baseRuleMatch[1]
    const areaOrder = ['navSection', 'logoSection', 'logoSection2', 'inputSection']
    let lastIndex = -1
    for (const area of areaOrder) {
      const idx = areas.indexOf(area)
      expect(idx).toBeGreaterThan(lastIndex)
      lastIndex = idx
    }
  })

  it('320px .logoContainer2 uses no large negative top or margin-top (single-digit vh or absent) so grid overflow cannot be reintroduced on small phones', () => {
    const media320Block = css.match(/@media\s*\(min-width:\s*320px\)\s*\{([\s\S]*?)(?=@media)/)?.[1] ?? ''
    const ruleMatch = media320Block.match(/\.logoContainer2\s*\{([^}]+)\}/)
    expect(ruleMatch).not.toBeNull()
    const topMatch = ruleMatch[1].match(/top:\s*-(\d+(?:\.\d+)?)vh/)
    const marginMatch = ruleMatch[1].match(/margin-top:\s*-(\d+(?:\.\d+)?)vh/)
    if (topMatch) expect(parseFloat(topMatch[1])).toBeLessThan(10)
    if (marginMatch) expect(parseFloat(marginMatch[1])).toBeLessThan(10)
  })
})

describe('Goku nimbus gif relocated beneath the DBZ title on mobile (Option A)', () => {
  const media320 = css.match(/@media\s*\(min-width:\s*320px\)\s*\{([\s\S]*?)(?=@media)/)?.[1] ?? ''
  const media481 = css.match(/@media\s*\(min-width:\s*481px\)\s*\{([\s\S]*?)(?=@media)/)?.[1] ?? ''
  const media641 = css.match(/@media\s*\(min-width:\s*641px\)[^{]*\{([\s\S]*?)(?=@media|\*\/|$)/)?.[1] ?? ''
  const media961 = css.match(/@media\s*\(min-width:\s*961px\)[^{]*\{([\s\S]*?)(?=@media|\*\/|$)/)?.[1] ?? ''

  function areaOrderHolds(block) {
    const ruleMatch = block.match(/\.outerSection\s*\{([^}]+)\}/)
    if (!ruleMatch) return false
    const areas = ruleMatch[1]
    const order = ['navSection', 'logoSection', 'logoSection2', 'animationSection', 'inputSection']
    let last = -1
    for (const a of order) {
      const idx = areas.indexOf(a)
      if (idx <= last) return false
      last = idx
    }
    return true
  }

  function rowTrackCount(block) {
    const ruleMatch = block.match(/\.outerSection\s*\{([^}]+)\}/)
    if (!ruleMatch) return 0
    const rowsMatch = ruleMatch[1].match(/grid-template-rows:\s*([^;]+);/)
    if (!rowsMatch) return 0
    return rowsMatch[1].trim().split(/\s+/).length
  }

  it('320px outerSection places animationSection between logoSection2 and inputSection so the gif sits beneath the title', () => {
    expect(areaOrderHolds(media320)).toBe(true)
  })

  it('481px outerSection places animationSection between logoSection2 and inputSection so the gif sits beneath the title', () => {
    expect(areaOrderHolds(media481)).toBe(true)
  })

  it('320px outerSection grid-template-rows has five tracks for the added gif row', () => {
    expect(rowTrackCount(media320)).toBe(5)
  })

  it('481px outerSection grid-template-rows has five tracks for the added gif row', () => {
    expect(rowTrackCount(media481)).toBe(5)
  })

  it('641px outerSection grid-template-rows has five tracks so the inherited animationSection area has a track', () => {
    expect(rowTrackCount(media641)).toBe(5)
  })

  it('320px animationSection sits behind the Fight button as an absolute, centered, lowered-z-index backdrop instead of in the grid flow', () => {
    const ruleMatch = media320.match(/\.animationSection\s*\{([^}]+)\}/)
    expect(ruleMatch).not.toBeNull()
    expect(ruleMatch[1]).toMatch(/position:\s*absolute/)
    expect(ruleMatch[1]).toMatch(/transform:\s*translateX\(-50%\)/)
    const z = ruleMatch[1].match(/z-index:\s*(-?\d+)/)
    expect(z).not.toBeNull()
    expect(parseInt(z[1], 10)).toBeLessThan(0)
  })

  it('320px gokuGif is height- and width-bounded so the relocated gif cannot overflow the column or hide the Fight button', () => {
    const ruleMatch = media320.match(/\.gokuGif\s*\{([^}]+)\}/)
    expect(ruleMatch).not.toBeNull()
    expect(ruleMatch[1]).toMatch(/height:\s*\d+(?:\.\d+)?vh/)
    expect(ruleMatch[1]).toMatch(/max-width:\s*\d+(?:\.\d+)?vw/)
    expect(ruleMatch[1]).not.toMatch(/width:\s*600px/)
  })

  it('961px desktop restores animationSection to its absolute bottom-right position so the desktop layout is unchanged', () => {
    const ruleMatch = media961.match(/\.animationSection\s*\{([^}]+)\}/)
    expect(ruleMatch).not.toBeNull()
    expect(ruleMatch[1]).toMatch(/position:\s*absolute/)
    expect(ruleMatch[1]).toMatch(/z-index:\s*-1/)
  })

  it('961px desktop restores gokuGif to its 600px width so the desktop gif size is unchanged', () => {
    const ruleMatch = media961.match(/\.gokuGif\s*\{([^}]+)\}/)
    expect(ruleMatch).not.toBeNull()
    expect(ruleMatch[1]).toMatch(/width:\s*600px/)
  })

  it('base .outerSection grid stays four rows (animationSection relocation is mobile-only)', () => {
    const baseRuleMatch = css.match(/^\.outerSection\s*\{([^}]+)\}/m)
    expect(baseRuleMatch).not.toBeNull()
    expect(baseRuleMatch[1]).not.toMatch(/animationSection/)
  })

  it('renders the gokuGif as a decorative img with no click handler so it adds no new interaction', () => {
    render(<HomePage {...defaultProps} />)
    const gif = document.querySelector('img.gokuGif')
    expect(gif).not.toBeNull()
    expect(gif.getAttribute('role')).toBeNull()
  })
})

describe('Goku gif layered behind the Fight button as a centered backdrop on mobile', () => {
  const media320 = css.match(/@media\s*\(min-width:\s*320px\)\s*\{([\s\S]*?)(?=@media)/)?.[1] ?? ''
  const media961 = css.match(/@media\s*\(min-width:\s*961px\)[^{]*\{([\s\S]*?)(?=@media|\*\/|$)/)?.[1] ?? ''

  it('320px gokuGif backdrop has a lowered z-index so the Fight button renders in front', () => {
    const ruleMatch = media320.match(/\.animationSection\s*\{([^}]+)\}/)
    expect(ruleMatch).not.toBeNull()
    const z = ruleMatch[1].match(/z-index:\s*(-?\d+)/)
    expect(z).not.toBeNull()
    expect(parseInt(z[1], 10)).toBeLessThan(0)
  })

  it('320px gokuGif backdrop is horizontally centered behind the button', () => {
    const ruleMatch = media320.match(/\.animationSection\s*\{([^}]+)\}/)
    expect(ruleMatch).not.toBeNull()
    expect(ruleMatch[1]).toMatch(/left:\s*50%/)
    expect(ruleMatch[1]).toMatch(/transform:\s*translateX\(-50%\)/)
  })

  it('320px gokuGif backdrop is lifted up off the floor so more of it peeks above the button', () => {
    const ruleMatch = media320.match(/\.animationSection\s*\{([^}]+)\}/)
    expect(ruleMatch).not.toBeNull()
    const bottom = ruleMatch[1].match(/bottom:\s*([\d.]+)vh/)
    expect(bottom).not.toBeNull()
    expect(parseFloat(bottom[1])).toBeGreaterThan(0)
  })

  it('961px desktop gif stays at its absolute bottom-right position behind content (z-index -1) so the desktop layering is unchanged', () => {
    const ruleMatch = media961.match(/\.animationSection\s*\{([^}]+)\}/)
    expect(ruleMatch).not.toBeNull()
    expect(ruleMatch[1]).toMatch(/position:\s*absolute/)
    expect(ruleMatch[1]).toMatch(/z-index:\s*-1/)
  })
})

describe('Goku gif and Fight button share one positioned container (regression: rendered as stacked rows, not z-layered)', () => {
  it('the Goku gif lives inside the same .fightStage container as the Fight button so it layers behind it instead of occupying a separate row', () => {
    render(<HomePage {...defaultProps} />)
    const gif = document.querySelector('img.gokuGif')
    const button = document.querySelector('.fightButton')
    expect(gif).not.toBeNull()
    expect(button).not.toBeNull()
    const stage = button.closest('.fightStage')
    expect(stage).not.toBeNull()
    expect(stage.contains(gif)).toBe(true)
  })

  it('.fightStage is a positioned container so the absolutely-positioned gif anchors to the button area rather than the page', () => {
    const match = css.match(/\.fightStage\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toMatch(/position:\s*relative/)
  })

  it('the gif is non-interactive (pointer-events: none) so layering it over the button area adds no new click target', () => {
    const match = css.match(/\.animationSection\s*\{([^}]+)\}/)
    expect(match).not.toBeNull()
    expect(match[1]).toMatch(/pointer-events:\s*none/)
  })
})

describe('Fight button shifted down relative to the Goku gif so more of the gif shows above it', () => {
  const media320 = css.match(/@media\s*\(min-width:\s*320px\)\s*\{([\s\S]*?)(?=@media)/)?.[1] ?? ''
  const media961 = css.match(/@media\s*\(min-width:\s*961px\)[^{]*\{([\s\S]*?)(?=@media|\*\/|$)/)?.[1] ?? ''

  it('320px .fightButton uses a positive downward top offset (~30% of the 20vh gif, a cumulative two-nudge shift) so it sits lower behind the gif', () => {
    const ruleMatch = media320.match(/\.fightButton\s*\{([^}]+)\}/)
    expect(ruleMatch).not.toBeNull()
    const top = ruleMatch[1].match(/top:\s*([\d.]+)vh/)
    expect(top).not.toBeNull()
    const v = parseFloat(top[1])
    expect(v).toBeGreaterThan(3)
    expect(v).toBeLessThanOrEqual(9)
  })

  it('961px desktop resets the .fightButton top offset so the desktop button position is unchanged (gif sits in the corner there)', () => {
    const ruleMatch = media961.match(/\.fightButton\s*\{([^}]+)\}/)
    expect(ruleMatch).not.toBeNull()
    expect(ruleMatch[1]).toMatch(/top:\s*0/)
  })
})
