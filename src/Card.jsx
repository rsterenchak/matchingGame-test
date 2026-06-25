import React from 'react';
import { useState, useEffect } from 'react';
import './style.css';
import musicIcon from './assets/musical-notes.svg'
import planetIcon from './assets/planet.svg'
import gitIcon from './assets/github.svg'
import cardBack from './assets/dbzCardBack.png'

export default function Card({
  item,
  shuffleNow,
  isPickedArray,
  setPickedArray,
  isShown,
  isScore,
  setScore,
  isPopUp,
  setPopUp,
  style,
  isHighScore,
  setHighScore,
  startInitialTurn,
  isPositions,
  setPositions,
  isResult,
  setResult

}) {

  // console.log('Cards re-rendered');

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

  // console.log(item.name);

  const myStyle = {
    border: '1px solid red'

  }

  // Inline transform that tilts the card in 3D toward the cursor. Reset to {}
  // (identity) on mouse leave so the card snaps back flat.
  const [tiltStyle, setTiltStyle] = useState({});

  function handleCardMouseMove(e){

    // Don't tilt while the end-game popup is up — the board is blurred/disabled.
    if(isPopUp){
      return;
    }

    // Respect a reduced-motion preference, mirroring the CSS guard in style.css.
    if(typeof window !== 'undefined' && window.matchMedia &&
       window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      return;
    }

    let rect = e.currentTarget.getBoundingClientRect();

    // Guard against a zero-size rect (avoids NaN rotations).
    if(rect.width === 0 || rect.height === 0){
      return;
    }

    // Normalized cursor offset from the card center, -1 to 1 on each axis.
    let offsetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    let offsetY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

    // The smallest cards (320px breakpoint) use a gentler tilt so the lift
    // doesn't clip into neighboring cards.
    let isSmallest = typeof window !== 'undefined' && window.matchMedia &&
      window.matchMedia('(max-width: 480px)').matches;
    let maxRotate = isSmallest ? 8 : 15;

    let rotateY = offsetX * maxRotate;   // horizontal cursor position rotates around Y
    let rotateX = -offsetY * maxRotate;  // vertical cursor position rotates around X

    setTiltStyle({
      transform: `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    });

  }

  function handleCardMouseLeave(){

    setTiltStyle({});

  }



  function handleCardClick(){

    // Note -> upon card shuffle all cards need to be added to the shown array/state

    // When card is clicked, 

    // console.log(isShown);

    // > check if card has been shown
    if(isShown.includes(item)){

      // console.log('Item has been shown');



      //  > check if it has been picked
      if(isPickedArray.includes(item)){
      
        // > end game  
        console.log('Game is over...exists in the picked array');

        // need to generate an 'end game retry screen'
        // include pop-up, You scored #/#. Would you like to play again?
        // startInitialTurn(false);
        setResult(false);
        setPopUp(true);

        if(isScore > isHighScore){

          setHighScore(isScore);
  
        }


        return;

      }
      
      //  > else if it hasn't been picked
      else{
       
        // console.log(newPositions);

        // > add to picked array (state), increment score (state) 
        let newlyPickedArray = isPickedArray;
        let newPositions = isPositions;
        let incrementedScore = isScore + 1;

        let counter = 0;

        newlyPickedArray.push(item); // pushes card to picked array

        let index = newPositions.indexOf(item.id - 1); // 

        if (index > -1) { // only splice array when item is found
          newPositions.splice(index, 1); // 2nd parameter means remove one item only
        }

        console.log(newlyPickedArray);
        console.log(newPositions);

        setPickedArray(newlyPickedArray);
        setPositions(newPositions);
        setScore(incrementedScore);
        

        if(incrementedScore === 16){
          setResult(true);
          setPopUp(true);

          if(isScore > isHighScore){
    
            setHighScore(incrementedScore);
    
    
          }
    


          return;

        }
        
      
      }
    }

    // > else if it hasn't been shown
    else{
    
      // > end game  
      console.log('Game is over...card was never shown');

      // need to generate an 'end game retry screen'
      // startInitialTurn(false);
      setResult(false);
      setPopUp(true);

      if(isScore > isHighScore){

        setHighScore(isScore);


      }



      return;
    }

    
    
    // if game is not over, shuffle cards and continue


    shuffleNow();

  }



  return (

   <>

            <div
              className='card'
              onClick={() => handleCardClick()}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{ ...style, ...(isPopUp ? {} : tiltStyle) }}
            >
                        
              <div className='cardFront'>
                <img className='cardImage' src={item.image}></img>
                {/* <div className='cardImage'>{item.name}</div> */}
              </div>

            </div>

  </> 


  );

  
}
