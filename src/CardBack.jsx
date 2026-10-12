// One face-down card, shown while a new deal flips over; purely presentational.
import React from 'react';
import { useState, useEffect } from 'react';
import './style.css';
import musicIcon from './assets/musical-notes.svg'
import planetIcon from './assets/planet.svg'
import gitIcon from './assets/github.svg'
import cardBack from './assets/dbzCardBack.png'

export default function CardBack({
  item,
  shuffleNow

}) {



  const myStyle = {
    border: '1px solid red'
    
  }



  return (

   <>

            <div className='card'>
              
              <img className='cardBack' src={cardBack}></img>

            </div>

  </> 


  );

  
}
