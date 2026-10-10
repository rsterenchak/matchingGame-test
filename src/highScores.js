// Saved runs persist across reloads as a JSON array of { name, score, level }.
// Pure helpers shared by the end-game popup and the high scores modal, so the
// list can be read from either page without mounting the game.
export const highScoresKey = 'matchingGame_highScores';

const levelLabels = {easy: 'Easy', hard: 'Hard', hardest: 'Hardest'};

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
// otherwise return '' so the row shows no badge rather than a wrong one.
export function levelLabel(entry){

  if(levelLabels[entry.level]){
    return levelLabels[entry.level];
  }

  if(entry.score > 24){
    return 'Hardest';
  }

  if(entry.score > 16){
    return 'Hard';
  }

  return '';

}
