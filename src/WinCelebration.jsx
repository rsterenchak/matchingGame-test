import React from 'react';
import { useState, useEffect } from 'react';
import './style.css';

// One-shot "summon the dragon" layer shown behind the win popup: a golden
// flash, then waves of the seven Dragon Balls rising up the screen. Harder
// levels add more waves. Presentational only — it removes itself once the
// last ball has finished rising.

const wavesByLevel = {easy: 1, hard: 2, hardest: 3};
const ballCount = 7;
const ballStagger = 0.15; // seconds between balls in one wave
const waveGap = 0.9; // seconds between waves
const riseDuration = 2.8; // seconds for one ball to cross the screen
const reducedMotionDuration = 1.5; // seconds the static glow stays up

export default function WinCelebration({
  isLevel = 'easy'
}) {

  const [isDone, setDone] = useState(false);

  const waves = wavesByLevel[isLevel] ?? 1;
  const lastDelay = (waves - 1) * waveGap + (ballCount - 1) * ballStagger;

  // Fallback in case animationend never fires (reduced motion hides the
  // balls, or the tab is in the background).
  useEffect(() => {

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const seconds = reduceMotion ? reducedMotionDuration : lastDelay + riseDuration;

    const key = setTimeout(() => setDone(true), seconds * 1000 + 200);

    return () => clearTimeout(key);

  }, [])

  if(isDone){
    return null;
  }

  const balls = [];

  for(let wave = 0; wave < waves; wave++){
    for(let i = 0; i < ballCount; i++){

      const delay = wave * waveGap + i * ballStagger;
      const isLast = wave === waves - 1 && i === ballCount - 1;

      balls.push(
        <span
          key={`${wave}-${i}`}
          className='dragonBall'
          data-stars={i + 1}
          style={{left: `${((i + 0.5) / ballCount) * 100}%`, animationDelay: `${delay}s`}}
          onAnimationEnd={isLast ? () => setDone(true) : undefined}
        ></span>
      );

    }
  }

  return (

    <div className={`winCelebration${waves === 3 ? ' longFlash' : ''}`} aria-hidden='true'>

      <div className='winFlash'></div>
      {balls}

    </div>

  );
}
