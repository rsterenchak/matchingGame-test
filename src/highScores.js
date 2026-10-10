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

// Runs saved before levels were recorded have no level field; they were Easy.
export function levelLabel(entry){

  return levelLabels[entry.level] ?? 'Easy';

}
