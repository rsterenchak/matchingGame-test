import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import HomePage from '../HomePage.jsx'

describe('HomePage', () => {
  const defaultProps = {
    background: 'fake-bg.jpg',
    setPlayPage: vi.fn(),
    setAudioPause: vi.fn(),
    setAudioPlay: vi.fn(),
    activeCurrentAudio: false,
  }

  it('renders the Fight button', () => {
    render(<HomePage {...defaultProps} />)
    expect(screen.getByText('Fight')).toBeInTheDocument()
  })

  it('renders the portfolio handle', () => {
    render(<HomePage {...defaultProps} />)
    expect(screen.getByText('@rsterenchak')).toBeInTheDocument()
  })
})