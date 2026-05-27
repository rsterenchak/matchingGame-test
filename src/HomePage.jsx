import React, { useEffect, useRef, useState } from 'react';
import './style.css';
import musicIcon from './assets/musical-notes.svg'
import gitIcon from './assets/github.svg'
import gokuGif from './assets/goku-gif.gif'
import guyGif from './assets/dbzMoving.png'

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
                    className='volumeChevron'
                    onClick={() => setSliderOpen(o => !o)}
                  >▾</div>

                  {sliderOpen && (
                    <div className='volumeSliderWrapper'>
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
                  )}

                </div>


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

            <div className='logoContainer2'></div>


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
