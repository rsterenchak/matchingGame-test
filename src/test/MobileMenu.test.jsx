import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'
import MobileMenu from '../MobileMenu.jsx'

const defaultProps = {
  forMusicIcon: vi.fn(),
  activeCurrentAudio: false,
  musicIcon: 'music.svg',
  setupPage: vi.fn(),
  planetIcon: 'planet.svg',
  openInstructions: vi.fn(),
  gitIcon: 'github.svg',
  isVolume: 0.5,
  onVolumeChange: vi.fn(),
  popUpStyle: {},
}

describe('MobileMenu modal', () => {
  it('does not show the modal backdrop before the hamburger is clicked', () => {
    render(<MobileMenu {...defaultProps} />)
    expect(document.querySelector('.mobileMenuBackdrop')).toBeNull()
  })

  it('shows a .mobileMenuBackdrop with a centered .mobileMenuModal when the hamburger is clicked', () => {
    render(<MobileMenu {...defaultProps} />)
    fireEvent.click(document.querySelector('.hamburgerButton'))
    expect(document.querySelector('.mobileMenuBackdrop')).toBeInTheDocument()
    expect(document.querySelector('.mobileMenuModal')).toBeInTheDocument()
  })

  it('shows the "Menu" title inside the modal', () => {
    render(<MobileMenu {...defaultProps} />)
    fireEvent.click(document.querySelector('.hamburgerButton'))
    expect(screen.getByText('Menu')).toBeInTheDocument()
  })

  it('shows all expected menu rows inside the modal', () => {
    render(<MobileMenu {...defaultProps} />)
    fireEvent.click(document.querySelector('.hamburgerButton'))
    expect(screen.getByText(/Music/)).toBeInTheDocument()
    expect(screen.getByText('Background')).toBeInTheDocument()
    expect(screen.getByText('How to Play')).toBeInTheDocument()
    expect(screen.getByText('GitHub')).toBeInTheDocument()
  })

  it('closes the modal when the X close button is clicked', () => {
    render(<MobileMenu {...defaultProps} />)
    fireEvent.click(document.querySelector('.hamburgerButton'))
    expect(document.querySelector('.mobileMenuBackdrop')).toBeInTheDocument()
    fireEvent.click(document.querySelector('.mobileMenuCloseButton'))
    expect(document.querySelector('.mobileMenuBackdrop')).toBeNull()
  })

  it('closes the modal when the backdrop is clicked', () => {
    render(<MobileMenu {...defaultProps} />)
    fireEvent.click(document.querySelector('.hamburgerButton'))
    expect(document.querySelector('.mobileMenuBackdrop')).toBeInTheDocument()
    fireEvent.click(document.querySelector('.mobileMenuBackdrop'))
    expect(document.querySelector('.mobileMenuBackdrop')).toBeNull()
  })

  it('does not close the modal when clicking inside the modal panel', () => {
    render(<MobileMenu {...defaultProps} />)
    fireEvent.click(document.querySelector('.hamburgerButton'))
    fireEvent.click(document.querySelector('.mobileMenuModal'))
    expect(document.querySelector('.mobileMenuBackdrop')).toBeInTheDocument()
  })

  it('closes the modal when Escape is pressed', () => {
    render(<MobileMenu {...defaultProps} />)
    fireEvent.click(document.querySelector('.hamburgerButton'))
    expect(document.querySelector('.mobileMenuBackdrop')).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(document.querySelector('.mobileMenuBackdrop')).toBeNull()
  })

  it('does not render a .mobileMenuDropdown element (dropdown replaced by modal)', () => {
    render(<MobileMenu {...defaultProps} />)
    fireEvent.click(document.querySelector('.hamburgerButton'))
    expect(document.querySelector('.mobileMenuDropdown')).toBeNull()
  })
})

describe('hamburgerButton desktop color matches musicBlock3', () => {
  const cssPath = join(__dirname, '../style.css')
  const css = readFileSync(cssPath, 'utf8')

  it('hamburgerButton has background-color: yellow inside a min-width:961px breakpoint so it matches musicBlock3', () => {
    // Split on @media boundaries; collect every block that targets min-width:961px
    const blocks = css.split(/(?=@media)/)
    const media961Blocks = blocks.filter(b => /min-width:961px/.test(b))
    expect(media961Blocks.length).toBeGreaterThan(0)

    // At least one 961px block must contain a .hamburgerButton rule with background-color: yellow
    const hasMatch = media961Blocks.some(block => {
      const ruleMatch = block.match(/\.hamburgerButton\s*\{([^}]*)\}/)
      return ruleMatch && ruleMatch[1].includes('background-color: yellow')
    })
    expect(hasMatch).toBe(true)
  })
})
