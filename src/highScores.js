// Saved runs persist across reloads as a JSON array of { name, score, level }.
// Pure helpers shared by the end-game popup and the high scores modal, so the
// list can be read from either page without mounting the game.
export const highScoresKey = 'matchingGame_highScores';

export const levelLabels = {easy: 'Easy', hard: 'Hard', hardest: 'Hardest'};

// Characters a run must pick to win on each level. Lives here rather than in
// PlayPage so the high scores modal can show "score / winCount" per level
// without importing the page.
export const levelWinCounts = {easy: 16, hard: 24, hardest: 32};

export function sortHighScores(list){

  return [...list].sort((a, b) => b.score - a.score);

}

export function loadHighScores(){

  try {

    let parsed = JSON.parse(localStorage.getItem(highScoresKey));

    if(!Array.isArray(parsed)){
      return [];
    }

    return sortHighScores(parsed.filter(entry =>
      entry && typeof entry.name === 'string' && typeof entry.score === 'number'
    ));

  } catch {

    return [];

  }

}

// Runs saved before levels were recorded have no level field, but the level
// selector shipped first, so they may have been played on any level. Infer the
// level only where the score rules the others out (Easy wins at 16, Hard at 24);
// otherwise return null rather than a wrong level.
export function entryLevel(entry){

  if(levelLabels[entry.level]){
    return entry.level;
  }

  if(entry.score > levelWinCounts.hard){
    return 'hardest';
  }

  if(entry.score > levelWinCounts.easy){
    return 'hard';
  }

  return null;

}

// '' when the level can't be known, so the row shows no badge.
export function levelLabel(entry){

  return levelLabels[entryLevel(entry)] ?? '';

}
