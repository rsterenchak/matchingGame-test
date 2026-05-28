import React, { useState, useEffect } from 'react';

export default function MobileMenu({
  forMusicIcon,
  activeCurrentAudio,
  musicIcon,
  setupPage,
  planetIcon,
  openInstructions,
  gitIcon,
  isVolume,
  onVolumeChange,
  popUpStyle,
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(e) {
      if (e.key === 'Escape') setIsOpen(false);
    }

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <>
      <div className='mobileMenuWrapper'>
        <div
          className='hamburgerButton'
          onClick={() => setIsOpen(o => !o)}
          style={popUpStyle}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="black">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className='mobileMenuBackdrop' onClick={() => setIsOpen(false)}>
          <div className='mobileMenuModal' onClick={e => e.stopPropagation()}>
            <div className='mobileMenuModalHeader'>
              <span className='mobileMenuModalTitle'>Menu</span>
              <div className='mobileMenuCloseButton' onClick={() => setIsOpen(false)}>✕</div>
            </div>

            <div className='mobileMenuDivider' />

            <div
              className='mobileMenuRow'
              onClick={() => forMusicIcon()}
            >
              <img className='mobileMenuIcon' src={musicIcon} alt="" />
              <span className='mobileMenuLabel'>Music {activeCurrentAudio ? '(On)' : '(Off)'}</span>
            </div>

            <div className='mobileMenuDivider' />

            <div className='mobileMenuRow mobileMenuSliderRow'>
              <input
                type="range"
                className="mobileMenuVolumeSlider"
                min="0"
                max="1"
                step="0.005"
                value={isVolume}
                style={{ background: `linear-gradient(to right, yellow ${isVolume * 100}%, #ccc ${isVolume * 100}%)` }}
                onChange={e => onVolumeChange(parseFloat(e.target.value))}
              />
            </div>

            {setupPage && (
              <>
                <div className='mobileMenuDivider' />
                <div
                  className='mobileMenuRow'
                  onClick={() => { setIsOpen(false); setupPage(); }}
                >
                  <img className='mobileMenuIcon' src={planetIcon} alt="" />
                  <span className='mobileMenuLabel'>Background</span>
                </div>
              </>
            )}

            {openInstructions && (
              <>
                <div className='mobileMenuDivider' />
                <div
                  className='mobileMenuRow'
                  onClick={() => { setIsOpen(false); openInstructions(); }}
                >
                  <span className='mobileMenuIconText'>?</span>
                  <span className='mobileMenuLabel'>How to Play</span>
                </div>
              </>
            )}

            <div className='mobileMenuDivider' />

            <a
              href='https://github.com/rsterenchak'
              target='_blank'
              rel='noreferrer'
              className='mobileMenuRow'
            >
              <img className='mobileMenuIcon' src={gitIcon} alt="" />
              <span className='mobileMenuLabel'>GitHub</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
