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

  console.log(item);

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
        // console.log('Game is over...exists in the picked array');

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

        newlyPickedArray.push(item);

        let index = newPositions.indexOf(item.id);

        if (index > -1) { // only splice array when item is found
          newPositions.splice(index, 1); // 2nd parameter means remove one item only
        }



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
      // console.log('Game is over...card was never shown');

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
              style={style}
            >
                        
              <div className='cardFront'>
                <img className='cardImage' src={item.image}></img>
                {/* <div className='cardImage'>{item.name}</div> */}
              </div>

            </div>

  </> 


  );

  
}
