// Button and card sounds synthesized with the Web Audio API, so there are no
// audio files to ship. Each sound is one OscillatorNode through a GainNode
// envelope that stops itself. Muted along with the music toggle and scaled by
// the same volume slider, squared like the music gain.

let audioContext = null;
let sfxEnabled = false;
let sfxVolume = 1;

// Peak gain at full slider volume, before the volume ** 2 taper.
const peakGain = 0.4;

const sounds = {
  tap: {type: 'square', from: 880, to: 880, duration: 0.06},
  // The pitch tops out before the gain fades, leaving a short tail.
  fight: {type: 'sawtooth', from: 220, to: 880, duration: 0.35, rise: 0.28},
  hit: {type: 'triangle', from: 660, to: 660, duration: 0.09},
  miss: {type: 'sawtooth', from: 330, to: 110, duration: 0.3}
};

// One context for the whole app: the music's gain routing in MainSection uses
// it too, since iOS limits how many contexts a page may open. Created lazily so
// the first call happens inside a user gesture. Null without Web Audio.
export function getAudioContext(){

  if(audioContext === null){

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if(!AudioCtx) return null;

    audioContext = new AudioCtx();

  }

  return audioContext;

}

export function setSfxEnabled(enabled){

  sfxEnabled = enabled;

}

export function setSfxVolume(volume){

  sfxVolume = volume;

}

export function playSfx(name){

  const sound = sounds[name];
  if(!sfxEnabled || !sound) return;

  try {

    const ctx = getAudioContext();
    if(!ctx) return;

    if(ctx.state === 'suspended'){
      ctx.resume().catch(() => {
        // Resume was blocked; the next click retries it.
      });
    }

    const start = ctx.currentTime;
    const end = start + sound.duration;

    const oscillator = ctx.createOscillator();
    oscillator.type = sound.type;
    oscillator.frequency.setValueAtTime(sound.from, start);
    if(sound.to !== sound.from){
      oscillator.frequency.exponentialRampToValueAtTime(sound.to, start + (sound.rise ?? sound.duration));
    }

    // exponentialRamp can't reach 0, so decay to a near-silent floor.
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(Math.max(peakGain * sfxVolume ** 2, 0.0001), start);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, end);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.onended = () => gainNode.disconnect();

    oscillator.start(start);
    oscillator.stop(end);

  } catch {

    // A missing or half-implemented Web Audio must never break a click handler.

  }

}
