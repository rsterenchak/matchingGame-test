import React, { useEffect, useRef, useState } from 'react';
import './style.css';
import MobileMenu from './MobileMenu.jsx';
import musicIcon from './assets/musical-notes.svg'
import gitIcon from './assets/github.svg'
import gokuGif from './assets/goku-gif.gif'
import guyGif from './assets/dbzMoving.png'
import shenronTopSvg from './assets/ShenronTop.svg'
import shenronBottomSvg from './assets/ShenronBottom.svg'
import memoryGameTitleSvg from './assets/MemoryGameTitle.svg'

export default function HomePage({
  background,
  setPlayPage,
  setAudioPause,
  setAudioPlay,
  activeCurrentAudio,
  isVolume,
  onVolumeChange
}) {

  console.log('HomePage re-rendered');

  const [sliderOpen, setSliderOpen] = useState(false);
  const musicWrapperRef = useRef(null);

  useEffect(() => {
    if (!sliderOpen) return;

    function handleOutsideClick(e) {
      if (musicWrapperRef.current && !musicWrapperRef.current.contains(e.target)) {
        setSliderOpen(false);
      }
    }

    function handleEscape(e) {
      if (e.key === 'Escape') setSliderOpen(false);
    }

    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [sliderOpen]);


  const boxStyle = {
    backgroundImage: `url(${background})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  }

  function setupPage(){

    setPlayPage();
    setAudioPause();
    setAudioPlay();

  }

  function forMusicIcon(){

    if(activeCurrentAudio === true){

      setAudioPause();

    }
    else{

      setAudioPlay();      

    }

  }

  
  return (



      <div
        className='homeSection'
        style={boxStyle}

      >

        <img className='shenronTop' src={shenronTopSvg} alt="" aria-hidden="true" />
        <img className='shenronBottom' src={shenronBottomSvg} alt="" aria-hidden="true" />

        <div className='outerSection'>
          
          <div className='navSection'>

            <div className='topColumn1'>

                <div className='musicIconWrapper' ref={musicWrapperRef}>

                  <div
                    className='musicBlock'
                    onClick={() => forMusicIcon()}
                  >

                    <img className='musicIcon' src={musicIcon}></img>

                  </div>

                  <div
                    className='speakerButton'
                    onClick={() => setSliderOpen(o => !o)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="black">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                    </svg>
                  </div>

                  <div className={`volumeSliderWrapper${sliderOpen ? ' sliderOpen' : ''}`}>
                    <input
                      type="range"
                      className="volumeSliderInput"
                      min="0"
                      max="1"
                      step="0.005"
                      value={isVolume}
                      style={{background: `linear-gradient(to top, yellow ${isVolume * 100}%, #ccc ${isVolume * 100}%)`}}
                      onChange={e => onVolumeChange(parseFloat(e.target.value))}
                    />
                  </div>

                </div>

                <MobileMenu
                  forMusicIcon={forMusicIcon}
                  activeCurrentAudio={activeCurrentAudio}
                  musicIcon={musicIcon}
                  gitIcon={gitIcon}
                  isVolume={isVolume}
                  onVolumeChange={onVolumeChange}
                />

            </div>
            <div className='topColumn2'>


                <div className='portfolioBlock'>

                  <div className='portfolioText'>@rsterenchak</div>

                  <div className='portfolioIcon'>
                    <a href='https://github.com/rsterenchak' target="_blank">
                      <img className='gitIcon' src={gitIcon}></img>
                    </a>
                  </div>


                </div>


            </div>

          </div>
          
          <div className='logoSection'>

            <div className='logoContainer'></div>

          </div>
          
          <div className='logoSection2'>

            <img className='logoContainer2' src={memoryGameTitleSvg} alt="Memory Game" />


          </div>
          
          <div className='inputSection'
            onClick={() => setupPage()}  
          >

            <div className='fightButton'>

            <svg className='svg-element' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30">
              <text x="50%" y="50%" className="svg-text" alignmentBaseline="middle" textAnchor="middle">Fight</text>
            </svg>

            </div>

          </div>


          
          <div className='animationSection'>

            {/* <img className='guyGif' src={guyGif}></img>
 */}
            <img className='gokuGif' src={gokuGif}></img>


          </div>

        </div>

      </div>
  );
}
