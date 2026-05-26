# Dragon Ball Z Matching Game

A memory-matching card game with a Dragon Ball Z theme, built with React and Vite. Click cards without repeating any to climb your high score — each unique character picked earns a point, while picking the same card twice ends the run.

🎮 **[Play it here](https://matching-game-test-61nu2hvky-rsterenchaks-projects.vercel.app/)**

## Screenshots

**Home Page**

The landing page features the Dragon Ball Z logo over Kame House, with the iconic Goku running animation in the corner and looping theme music.

**Play Page**

8 of 16 character cards are displayed each turn. After every selection, the cards flip face-down, shuffle, and re-deal — your memory is the only thing keeping track of what's already been picked.

## How to Play

1. Press **Fight** on the home page to start.
2. Each turn, 8 randomly selected character cards are dealt face-up.
3. Click a card you haven't picked yet to score a point.
4. Cards flip and reshuffle after every pick — keep mental track of who you've already chosen.
5. Click a repeat → game over. Pick all 16 unique characters → you win.
6. Your high score persists across attempts within the session.

## Features

- **Two-page navigation** between an animated home screen and the game board, managed entirely in React state.
- **Looping background music** with separate themes for the home page (Dragon Ball Z opening) and play page (Namek theme), togglable via the music icon.
- **Card flip animation** — cards display face-down briefly between turns before revealing the new hand.
- **Live character data** pulled from the [Dragon Ball API](https://dragonball-api.com/), so cards always show official art and metadata.
- **Score tracking** for both current run and session high score.
- **Win/lose pop-up** that dims the board and offers a retry without a full page reload.
- **Responsive layout** with breakpoints for phones, tablets, and desktops down to 320px width.

## Tech Stack

- **React 18** — component-based UI with hooks (`useState`, `useEffect`) for all game state
- **Vite** — dev server and bundler with hot module replacement
- **CSS** — custom styling with media queries, keyframe animations, and a custom display font (Shojumaru)
- **Dragon Ball API** — `https://dragonball-api.com/api/characters` for character data and image URLs
- **Vercel** — deployment

## Getting Started

```bash
# Clone the repo
git clone https://github.com/rsterenchak/matchingGame-test.git
cd matchingGame-test

# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

Open `http://localhost:5173` (or whichever port Vite reports) to view the game.

## Project Structure

```
src/
├── index.jsx           # React entry point
├── MainSection.jsx     # Top-level component; handles routing between pages and audio
├── HomePage.jsx        # Landing screen with logo, Fight button, and music toggle
├── PlayPage.jsx        # Game board, shuffle logic, scoring, win/lose handling
├── Card.jsx            # Individual card; handles click logic and game-over checks
├── CardBack.jsx        # Face-down card shown during the shuffle animation
├── style.css           # All styling, including responsive breakpoints
└── assets/             # Images, audio, SVGs, and the Shojumaru font
```

## How the Game Logic Works

The shuffle and scoring flow lives mostly in `PlayPage.jsx` and `Card.jsx`. On each turn:

1. `shuffleArray()` generates 8 non-duplicate random indices from the 16-character pool, with a check that at least one index points to an unpicked card.
2. The 8 selected cards are split into top and bottom rows and rendered as `<Card>` components.
3. Clicking a card runs `handleCardClick()`, which checks whether the card is in the `pickedArray`:
   - If yes → game over, show the retry pop-up.
   - If no → push it to `pickedArray`, increment the score, and call `shuffleNow()` to re-deal.
4. The card-flip effect is driven by a `useEffect` that watches `activeShuffledArray` and toggles `isSide` after a 1-second interval, swapping `<CardBack>` placeholders for the real cards.

## Credits

- Character data and art: [Dragon Ball API](https://dragonball-api.com/)
- Background art, music, and character likenesses: © Toei Animation / Akira Toriyama / Shueisha — used here for non-commercial portfolio purposes.
- Font: [Shojumaru](https://fonts.google.com/specimen/Shojumaru) by Astigmatic

## Author

Built by [@rsterenchak](https://github.com/rsterenchak)
