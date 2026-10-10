import React from 'react';
import { useState, useEffect, useRef } from 'react';
import './style.css';
import Card from './Card.jsx'
import CardBack from './CardBack.jsx';
import MobileMenu from './MobileMenu.jsx';
import WinCelebration from './WinCelebration.jsx';
import musicIcon from './assets/musical-notes.svg'
import planetIcon from './assets/planet.svg'
import gitIcon from './assets/github.svg'
import cardBack from './assets/dbzCardBack.png'
import trophyIcon from './assets/trophy.svg'
import { highScoresKey, sortHighScores, loadHighScores, levelWinCounts } from './highScores.js'

// Per-level board settings: how many cards are shown each round, and how many
// unique picks win the game (the size of the level's pool). Exported so the
// HomePage level info line reads the same numbers.
export const levelSettings = {
  easy: {shownCount: 8, winCount: levelWinCounts.easy},
  hard: {shownCount: 8, winCount: levelWinCounts.hard},
  hardest: {shownCount: 12, winCount: levelWinCounts.hardest}
};

const maxHighScoresShown = 5;


export default function PlayPage({
  background,
  setHomePage,
  setAudioPause,
  setAudioPlay,
  activeCurrentAudio,
  isActiveData,
  isVolume,
  onVolumeChange,
  isLevel = 'easy',
  isHighScore = 0,
  setHighScore,
  openScores

}) {

  
  console.log('PlayPage re-rendered');

  const [sliderOpen, setSliderOpen] = useState(false);
  const musicWrapperRef = useRef(null);
  const longPressTimerRef = useRef(null);
  const longPressFiredRef = useRef(false);

  const [activeInstructionsModal, setActiveInstructionsModal] = useState(true);
  const modalInteractiveRef = useRef(false);

  // A short home page can be scrolled down to reach the Fight button; start the
  // play screen at the top so its nav row isn't left scrolled out of view.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  useEffect(() => {
    if (!activeInstructionsModal) return;

    // Absorb ghost clicks: iOS synthesizes a click ~300ms after touchend on the
    // previous element, which lands on the backdrop and immediately dismisses the
    // modal. Disallow closure until the ghost-click window has passed.
    modalInteractiveRef.current = false;
    const guardTimer = setTimeout(() => {
      modalInteractiveRef.current = true;
    }, 400);

    function handleEscape(e) {
      if (e.key === 'Escape' && modalInteractiveRef.current) {
        setActiveInstructionsModal(false);
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
      clearTimeout(guardTimer);
    };
  }, [activeInstructionsModal]);


  const dataArray = [
    {
      id: Math.random(),
      name: 'Goku',
    },
    {
      id: Math.random(),
      name: 'Vegeta',
    },
    {
      id: Math.random(),
      name: 'Piccolo',
    },
    {
      id: Math.random(),
      name: 'Gohan',
    },
    {
      id: Math.random(),
      name: 'Majin Bu',
    },
    {
      id: Math.random(),
      name: 'Cell',
    },
    {
      id: Math.random(),
      name: 'Gotenks',
    },
    {
      id: Math.random(),
      name: 'Krillin',
    },
    {
      id: Math.random(),
      name: 'King Kai',
    },
    {
      id: Math.random(),
      name: 'Namekian',
    },
    {
      id: Math.random(),
      name: 'Zarbon',
    },
    {
      id: Math.random(),
      name: 'Frieza',
    },
    {
      id: Math.random(),
      name: 'Android',
    },
    {
      id: Math.random(),
      name: 'Balma',
    },
    {
      id: Math.random(),
      name: 'Popo',
    },
    {
      id: Math.random(),
      name: 'Raditz',
    }
  ];

  // console.log(isActiveData);
  // console.log('Runs playpage');
  // console.log(isActiveData);

  const [activeStandardArray, setActiveStandardArray] = useState(isActiveData); // regular array
  const [activeShuffledArray, setActiveShuffledArray] = useState([]); // Regular Array

  const [activeTopRow, setActiveTopRow] = useState([]); // set top cards row
  const [activeBottomRow, setActiveBottomRow] = useState([]); // set bottom cards row

  const [activeShown, setActiveShown] = useState([]); // set top cards row

  // const [isUnpickedArray, setUnpickedArray] = useState([]); // cards that haven't been chosen yet
  const [activePickedArray, setActivePickedArray] = useState([]); //  cards that have already been picked

  const [activePopUp, setActivePopUp] = useState(false);

  const {shownCount, winCount} = levelSettings[isLevel];

  const [activeScore, setActiveScore] = useState(0);

  // The high score lives in MainSection, one value per level, so it survives
  // trips back to the HomePage to switch difficulty.
  const activeHighScore = isHighScore;
  const setActiveHighScore = setHighScore;

  const [isSide, setSide] = useState(false); // regular array

  const [isHovered, setIsHovered] = useState(false); // going to use to for disabling 'hover' on all button elements when game over popup appears

  const [isInitialTurn, setInitialTurn] = useState(false);

  const [activePositions, setActivePositions] = useState(() => Array.from({length: winCount}, (_, i) => i));

  const [isOver, setOver] = useState(false);

  const [isEffect, setEffect] = useState(false);

  // Saved runs for the end-game "High scores" list, read once on mount. A
  // corrupt or missing value falls back to an empty list instead of crashing.
  const [activeHighScores, setActiveHighScores] = useState(() => loadHighScores());

  const [activePlayerName, setActivePlayerName] = useState('');

  // The entry saved from the run that just ended, so its row can be highlighted
  // (and the Save button disabled) until Retry starts a new run.
  const [activeSavedEntry, setActiveSavedEntry] = useState(null);

  const boxStyle = {
    backgroundImage: `url(${background})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    filter: activePopUp ? 'blur(5px)' : 'blur(0px)'
  }

  const popUpStyle ={

    cursor: activePopUp ? 'auto' : 'pointer'

  }

  function setupPage(){

    setHomePage();
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

  // Long-press on the music icon reveals the volume slider inline (replacing the
  // separate speaker button on mobile). A quick tap still toggles play/pause.
  function cancelMusicPress() {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }

  function startMusicPress() {
    cancelMusicPress();
    longPressFiredRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      longPressFiredRef.current = true;
      setSliderOpen(true);
    }, 500);
  }

  function handleMusicClick() {
    if (longPressFiredRef.current) {
      // The long-press already opened the slider — don't also toggle play/pause.
      longPressFiredRef.current = false;
      return;
    }
    forMusicIcon();
  }

  useEffect(() => cancelMusicPress, []);



  function closeInstructions() {
    if (!modalInteractiveRef.current) return;
    setActiveInstructionsModal(false);
  }

  function randomIntFromInterval(min, max) { // min and max included

    return Math.floor(Math.random() * (max - min + 1) + min)
  
  }
  

  function verifyArray(random, available){

    let counter = 0;

    while(counter < available.length){

      if(random.includes(available[counter])){
        


        return true;
      }
      else{

        counter += 1;

      }
    }

    return false;

  }


  // Sets new cards to shuffledArray state in PlayPage
  function shuffleArray(){


    let counter = 0;

    let newlyShownArray = activeShown;

    // activePositions = [0, 1, ..., winCount - 1] minus the picked cards

    let currentlyAvailablePositions = activePositions; 

    // pre-add cards
    if(isInitialTurn){

      // Adds previous set of cards 
      while(counter < activeShuffledArray.length){


        // if card is not already in the newlyShownArray push it onto the array
        if(newlyShownArray.includes(activeShuffledArray[counter])){

          // console.log('Already exists on array');

        }
        else{

          newlyShownArray.push(activeShuffledArray[counter]);

        }

        counter += 1;


      }    


      setActiveShown(newlyShownArray);

      // console.log('Cards from after initial set up');
      // console.log(newlyShownArray);

      counter = 0;

    }

    let randomArrayPositions = [];

    // Cards dealt this round — capped by the pool so an empty board (data still
    // loading, or the fetch failed) never spins this loop forever.
    let roundSize = Math.min(shownCount, activeStandardArray.length);

    // Re-roll cap for the unpicked-card guard below — if the position list ever
    // goes stale, deal the round anyway instead of hanging the browser.
    let maxRerolls = 500;
    let rerolls = 0;

    // Generates non-duplicate array positions - ***** Needs to keep track of unpicked array positions *****
    while((counter < roundSize)){

      let newPos = randomIntFromInterval(0, activeStandardArray.length - 1); 


      if(randomArrayPositions.includes(newPos)){

        // console.log('Duplicate digit');

      }
      else{

        randomArrayPositions.push(newPos);

        let result = verifyArray(randomArrayPositions, activePositions);

        console.log(result);

/*         console.log(randomArrayPositions);
        console.log(activePositions);
        console.log(activeStandardArray); */

        // Nothing left unpicked means no deal can pass the guard, so skip it.
        if((counter === (roundSize - 1)) && (result === false) && (activePositions.length > 0) && (rerolls < maxRerolls)){

          console.log('Renew digits array');

          rerolls += 1;

          if(rerolls === maxRerolls){
            console.warn('shuffleArray: no unpicked card dealt after ' + maxRerolls + ' re-rolls; dealing the round anyway');
          }

          counter = 0;
          randomArrayPositions = [];

        }  
        else{

          counter += 1;
        
        }

      }



    }
  

    // setArrayVerified(false);

    let newlyShuffledArray = []


    counter = 0;

    // Generates array with values
    while(counter < randomArrayPositions.length){

      newlyShuffledArray.push(activeStandardArray[randomArrayPositions[counter]]);


      counter += 1;


    }
    console.log(newlyShuffledArray);

    setActiveShuffledArray(newlyShuffledArray);


    counter = 0;

    // Initial set up for shown cards
    if(isInitialTurn === false){

      newlyShownArray = activeShown;


    // Adds previous set of cards 
      while(counter < newlyShuffledArray.length){


        // if card is not already in the newlyShownArray push it onto the array
        if(newlyShownArray.includes(newlyShuffledArray[counter])){

          // console.log('Already exists on array');

        }
        else{

          newlyShownArray.push(newlyShuffledArray[counter]);

        }

        counter += 1;


      }    

      setActiveShown(newlyShownArray);

      setInitialTurn(true);

      // console.log('Cards from initial set up');
      // console.log(newlyShownArray);

    }

    let topRowArray =[];
    let bottomRowArray =[];

    let maxLength = randomArrayPositions.length;
    let middleMaxLength = maxLength/2;

    counter = 0;

    while(counter < middleMaxLength){

      topRowArray.push(newlyShuffledArray[counter]);

      counter+= 1;
    }

    setActiveTopRow(topRowArray);

    while(counter < maxLength){

      bottomRowArray.push(newlyShuffledArray[counter]);
      counter+= 1;
    }

    setActiveBottomRow(bottomRowArray);


  }

  let shuffledTopRow = activeTopRow.map(item => 

    <Card 
      item={item}
      key={item.id}
      shuffleNow={() => shuffleArray()}
      isPickedArray={activePickedArray}
      setPickedArray={setActivePickedArray}
      isShown={activeShown}
      isScore={activeScore}
      setScore={setActiveScore}
      isPopUp={activePopUp}
      setPopUp={setActivePopUp}
      style={popUpStyle}
      isHighScore={activeHighScore}
      setHighScore={setActiveHighScore}
      startInitialTurn={setInitialTurn}
      isPositions={activePositions}
      setPositions={setActivePositions}
      isResult={isOver}
      setResult={setOver}
      winCount={winCount}
    />
    
  );

  let shuffledBottomRow = activeBottomRow.map(item => 

    <Card 
      item={item}
      key={item.id}
      image={item.image}
      shuffleNow={() => shuffleArray()}
      isPickedArray={activePickedArray}
      setPickedArray={setActivePickedArray}
      isShown={activeShown}
      isScore={activeScore}
      setScore={setActiveScore}
      isPopUp={activePopUp}
      setPopUp={setActivePopUp}  
      style={popUpStyle} 
      isHighScore={activeHighScore}
      setHighScore={setActiveHighScore}
      startInitialTurn={setInitialTurn}   
      isPositions={activePositions}
      setPositions={setActivePositions} 
      isResult={isOver}
      setResult={setOver}
      winCount={winCount}
    />
    
  );

  // Records the finished run under the typed name. Only reachable from the
  // end-game popup, so the list never changes mid-run.
  function saveHighScore(){

    let name = activePlayerName.trim();

    if(name === '' || activeSavedEntry !== null){
      return;
    }

    let newEntry = {name: name, score: activeScore, level: isLevel};
    let newHighScores = sortHighScores([...activeHighScores, newEntry]);

    localStorage.setItem(highScoresKey, JSON.stringify(newHighScores));
    setActiveHighScores(newHighScores);
    setActiveSavedEntry(newEntry);

  }

  function resetGame(){

    // console.log('Runs reset game');
    setActiveSavedEntry(null);
    setActiveScore(0);
    setActivePickedArray([]);
    setActivePositions(Array.from({length: winCount}, (_, i) => i));
    setActiveShown(activeShuffledArray);
    setActivePopUp(false);

    // console.log(activeShuffledArray);

  }

  // console.log(activeShown);


// used for initial shuffle - runs once during cleanup
  useEffect(() => {

    // console.log('Runs effect - PlayPage');

    return () => {   

      // console.log('Runs cleanup - PlayPage');
      shuffleArray();
      
        
    };
  }, [isEffect === false])


  // shuffleArray();

// used for card flip when shuffled array changes  
  useEffect(() => {

    setEffect(true);
    // console.log('Runs effect - card');

    const key = setInterval(() => {

      // console.log('setSide true');
      setSide(true);

    }, 1000);


    return () => {
      
      // console.log('Runs cleanup - card');

      // console.log('setSide false');
      setSide(false);
      clearInterval(key);
      // console.log(activeStandardArray);
      // shuffleArray();

    };
  }, [activeShuffledArray]) 

  // Top entries of the history list, plus the just-saved run when it ranks
  // below them so the player always sees their own row.
  const highScoreRows = activeHighScores
    .map((entry, i) => ({entry: entry, rank: i + 1}))
    .filter(row => row.rank <= maxHighScoresShown || row.entry === activeSavedEntry);

  // Shared body of both end-game popups: name entry, the saved history list,
  // and the Retry / Save buttons.
  const endGameScores = (
    <>

      <input
        className='endGameNameInput'
        type='text'
        placeholder='Enter your name'
        aria-label='Your name'
        maxLength={12}
        autoFocus
        value={activePlayerName}
        disabled={activeSavedEntry !== null}
        onChange={e => setActivePlayerName(e.target.value)}
        onKeyDown={e => { if(e.key === 'Enter') saveHighScore(); }}
      />

      <div className='highScoresBlock'>

        <div className='highScoresTitle'>High scores</div>

        {activeHighScores.length > 0 ? (
          <ol className='highScoresList'>
            {highScoreRows.map(({entry, rank}) => (
              <li
                key={rank}
                className={`highScoresRow${entry === activeSavedEntry ? ' ownRow' : ''}`}
              >
                <span className='highScoresRank'>{rank}</span>
                <span className='highScoresName'>{entry.name}</span>
                <span className='highScoresScore'>{entry.score}</span>
              </li>
            ))}
          </ol>
        ) : (
          <div className='highScoresEmpty'>No scores yet</div>
        )}

      </div>

      <div className='endGameButtons'>

        <div 
          className='retryButton'
          onClick={() => resetGame()}
        >Retry?</div>

        <button
          type='button'
          className='saveButton'
          disabled={activePlayerName.trim() === '' || activeSavedEntry !== null}
          onClick={() => saveHighScore()}
        >{activeSavedEntry !== null ? 'Saved' : 'Save'}</button>

      </div>

    </>
  );

  console.log('Picked');
  console.log(activePickedArray);
  console.log('Shown');
  console.log(activeShown);


  return (

    <>


      <div 
        className='playSection'
        style={boxStyle}
      >

        <div className={`outerSection2${shownCount > 8 ? ' hardestBoard' : ''}`}>
              
          <div className='navSection2'>

            <div className='topColumn3'>

                <div className='musicIconWrapper' ref={musicWrapperRef}>

                  <div
                    className='musicBlock2 navStackButton'
                    onClick={handleMusicClick}
                    onMouseDown={startMusicPress}
                    onMouseUp={cancelMusicPress}
                    onMouseLeave={cancelMusicPress}
                    onTouchStart={startMusicPress}
                    onTouchEnd={cancelMusicPress}
                    style={popUpStyle}
                  >

                    <img className='musicIcon2' src={musicIcon}></img>

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

                <div
                  className='musicBlock3 navStackButton'
                  onClick={() => setupPage()}
                  style={popUpStyle}
                >

                  <img className='musicIcon3' src={planetIcon}></img>

                </div>

                <div
                  className='helpButton navStackButton'
                  onClick={() => setActiveInstructionsModal(true)}
                  style={popUpStyle}
                >
                  ?
                </div>

                <div
                  className='scoresButton navStackButton'
                  onClick={() => openScores()}
                  style={popUpStyle}
                >

                  <img className='musicIcon3' src={trophyIcon} alt="High scores"></img>

                </div>

                <MobileMenu
                  forMusicIcon={forMusicIcon}
                  activeCurrentAudio={activeCurrentAudio}
                  musicIcon={musicIcon}
                  setupPage={setupPage}
                  planetIcon={planetIcon}
                  openInstructions={() => setActiveInstructionsModal(true)}
                  openScores={openScores}
                  trophyIcon={trophyIcon}
                  gitIcon={gitIcon}
                  isVolume={isVolume}
                  onVolumeChange={onVolumeChange}
                  popUpStyle={popUpStyle}
                  showMusic={false}
                />

            </div>
            <div className='topColumn4'>


                <div className='portfolioBlock2'>

                  <div className='portfolioText2'>@rsterenchak</div>

                  <div 
                    className='portfolioIcon2'
                    style={popUpStyle}
                  >
                    <a href='https://github.com/rsterenchak' target="_blank">
                      <img className='gitIcon' src={gitIcon}></img>
                    </a>
                  </div>


                </div>


            </div>


          </div>
          
          <div className='logoSection3'>

            {isSide ?(
            <>
              {shuffledTopRow}
            </>
            ) : (
              <>
                {Array.from({length: shownCount / 2}, (_, i) => <CardBack key={i} />)}
              </>
            )

            }

          </div>
          
          <div className='logoSection4'>

            {isSide ?(
              <>
                {shuffledBottomRow}
              </>
              ) : (
                <>
                  {Array.from({length: shownCount / 2}, (_, i) => <CardBack key={i} />)}
                </>
              )

            }

          </div>
          
          {/* Delete Section - no longer needed */}
{/*           <div className='currentScoreSection'></div> */}

          <div className='scorePanel'>
            <div className='scorePanelRow'>
              <div className='scorePanelScoreGroup'>
                <span className='scorePanelLabel'>Score</span>
                <span className='scorePanelValue'>{activeScore} / {winCount}</span>
              </div>
              <div className='scorePanelBestChip'>Best {activeHighScore}</div>
            </div>
            <div className='scorePanelPips'>
              {Array.from({length: winCount}, (_, i) => (
                <div key={i} className={`scorePanelPip${i < activeScore ? ' lit' : ''}`}></div>
              ))}
            </div>
          </div>


        </div>

      </div>
    

    {/* Pop-up element that will generate when game is over */}


    {activePopUp ? (
      <>
      {isOver ? (

        <>

        <WinCelebration isLevel={isLevel} />

        <div className='endGame'>

          <div className='gameOverTitle'>You Won!</div>
          {endGameScores}

        </div>

        </>
      ) : (

        <div className='endGame'>

        <div className='gameOverTitle'>Game Over</div>
        {endGameScores}

        </div>
      )
      
      }

      </>

      ):(

        <></>
    
      )
    
    }

    {activeInstructionsModal && (
      <div className='instructionsBackdrop' onClick={closeInstructions}>
        <div className='instructionsCard' onClick={e => e.stopPropagation()}>
          <div className='instructionsTitle'>How to Play</div>
          <div className='instructionsGoal'>Goal: pick {winCount} different fighters without repeating one.</div>
          <ul className='instructionsList'>
            <li><span className='instructionsIcon instructionsIconCheck' aria-hidden='true'>✓</span><span>Pick a Z Fighter you haven't picked before.</span></li>
            <li><span className='instructionsIcon instructionsIconShuffle' aria-hidden='true'>⇄</span><span>Cards reshuffle after every turn.</span></li>
            <li><span className='instructionsIcon instructionsIconDanger' aria-hidden='true'>✕</span><span>Picking a repeated fighter ends the game.</span></li>
            <li><span className='instructionsIcon instructionsIconWin' aria-hidden='true'>★</span><span>Pick all {winCount} unique fighters to win!</span></li>
          </ul>
          <div className='gotItButton' onClick={closeInstructions}>Got it!</div>
        </div>
      </div>
    )}

  </>
  );
}





      /* 
      if(randomArrayPositions.includes(newPos)){

        // console.log('Duplicate digit');

      }
      else{

        randomArrayPositions.push(newPos);

        let result = verifyArray(randomArrayPositions); // needs to return true when randomArray includes unpicked items

        if((counter === (((activeStandardArray.length)/2) - 1)) && (result === false)){
          

          console.log('counter reset');
          console.log(randomArrayPositions);
          console.log(counter);

          randomArrayPositions = [];
          counter = 0;

        }
        else{

          console.log('counter proceeds');

          counter += 1;

        }

        


      
      } */


      /**
 * 'Card Generation Logic' - 1/23 - *** Currently working ***
 * 
 * - Will most likely need to take place in a useEffect hook
 * - the max amount of turns until game is beaten is 16 (the amount of cards in array) 
 * - Load 16 cards into array as objects with pertaining information (name, image link, id(unique id))
 * - Shuffle array
 * - Show 8 cards
 * - you will need three arrays, 
 *    - regular array
 *    - show array
 *    - shown array
 *    - picked array
 * - every turn do these things (starting with first turn),
 * 
 *    - >>>> Shuffle regular array <<<<
 * 
 *    - store first 8 cards into - show array
 *    - make sure 'show array' contains at least 1 unpicked card (regular array - picked array) = unpicked array
 *    - if all cards are picked (repeat 'Shuffle regular array') 
 * 
 *    - display those cards - show array
 *    - pick card
 *    - verify card isn't in the picked array
 *    - if it isn't in the picked array, add it to - picked array CONTINUE GAME (+ score)
 *    - else if it is, stop game, user lost. END GAME (0 score increase)
 * 
 *    - >>>> Shuffle regular array <<<<
 * 
 * 
 */

/* let lastResponse = '';
 */
/* async function pullCharacters(value) {
  let url = 'https://dragonball-api.com/api/characters?page=1&limit=' + value;


  // issue getting new fetch calls

  try {
    let response = await fetch(url, {mode: 'cors'});
  

    if(!response.ok){
    
      throw new Error(`HTTP error! Status: ${response.status}`);
    
    }


    let forecast = await response.json();
    
    lastResponse = forecast;

    console.log(lastResponse);

    // validInput();
    // changeWeatherInfo(alldays).validInput();

    return lastResponse;

      } 
  catch(err) {
    // catches errors both in fetch and response.json
    
    // need function call to indexChanges that signals invalid input to user
    // invalidInput();
    // changeWeatherInfo(alldays).invalidInput();

    // alert(err);
    console.log(err);

    return lastResponse;

  }

}
 */
// let newArray = pullCharacters(16);
// setActiveStandardArray(newArray.items);

