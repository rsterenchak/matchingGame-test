# CLAUDE.md

Guidance for Claude when writing or reviewing code in this repo. Rules here are enforced by automated review — keep them concrete and verifiable.

## Project overview

A single-page Dragon Ball Z–themed memory/matching game. The player sees a grid of 8 character cards drawn from a pool of 16, clicks one, the cards reshuffle (with the previously-clicked card guaranteed to be unpicked among the new 8), and the player tries to click each of the 16 unique characters exactly once without repeating. Clicking a card that has already been picked, or that wasn't shown in any previous round, ends the game. Reaching 16 wins. A high score persists across retries within the session. Character data (names, images) is pulled from the public Dragon Ball API.

Two pages: a `HomePage` title screen with a "Fight" button, and a `PlayPage` with the card grid, score, and high score. Background music differs per page and is toggleable via the music icon.

## Stack and constraints

- React (function components + hooks) bundled with Vite. Do not introduce Next.js, Remix, or any other framework on top.
- Plain CSS in a single `src/style.css` file. Do not introduce Tailwind, CSS-in-JS, CSS modules, or preprocessors.
- No state management library. State is local `useState` lifted to the nearest common parent (`MainSection` for cross-page state, `PlayPage` for game state). Do not introduce Redux, Zustand, Jotai, Context, or similar.
- No router. Page switching is a boolean (`isCurrentPage`) in `MainSection.jsx`. Do not introduce React Router.
- No new dependencies without an explicit task instruction to add one. This includes UI component libraries, animation libraries, icon packs, audio libraries, and HTTP clients (use `fetch`).
- Use native browser APIs wherever possible (`fetch`, `new Audio()`, `setInterval`, etc.).

## Repo layout

- Repo root — contains `package.json`, `vite.config.js`, `index.html`, `README.md`, and the `src/` folder.
- `src/` — all source code, assets, fonts, and icons.
- `src/assets/` — images (backgrounds, card back, GIFs, logos), icons (SVG), audio (`.mp3`), and the custom font (`Shojumaru-Regular.ttf`).
- `dist/` — Vite build output. **Never edit files here directly; they are regenerated on build.** Do not commit changes to `dist/` as part of a feature or bug task.
- `node_modules/` — dependencies. Never edit.

## Source file organization

All source lives in `src/`. Each file has a defined responsibility — stay within it:

- `src/index.jsx` — React entry point. Mounts `<MainSection />` into `#app` inside `<StrictMode>`. Owns nothing else.
- `src/MainSection.jsx` — Top-level component. Owns the page boolean (`isCurrentPage`), the audio-on/off boolean (`isCurrentAudio`), the API fetch for character data, and the four `Handle*Audio` helper components that play/pause the home and play tracks. Renders `HomePage` or `PlayPage`.
- `src/HomePage.jsx` — Title screen. Renders the logo, "Fight" button, music toggle, and the Goku gif. No game state.
- `src/PlayPage.jsx` — Game screen. Owns all game state: shown cards, picked cards, current score, high score, the popup, the card-flip interval, the position pool, and the shuffle logic. Renders two rows of `Card` (or `CardBack` while flipped). Renders the end-game popup.
- `src/Card.jsx` — One face-up card. Owns the click handler that decides whether the click was a hit (incrementing score, adding to picked) or a miss (ending the game). Calls `shuffleNow` from props to trigger the next round.
- `src/CardBack.jsx` — One face-down card. Purely presentational; takes no meaningful props.
- `src/style.css` — All styling. No inline `style` props in JSX unless computed dynamically (e.g., the background-image URL, the popup blur).

Do not move game logic out of `PlayPage.jsx` and `Card.jsx` into new "manager" or "service" files unless the task explicitly asks for a refactor. Do not lift game state up into `MainSection.jsx`.

## Game logic conventions

- A "turn" is one card click. The shuffle that follows produces a new 8-card subset of the 16-card pool, and that subset is guaranteed to include at least one not-yet-picked card. The `verifyArray` + `randomArrayPositions` loop in `PlayPage.shuffleArray` enforces this — do not remove that guard.
- The `activeShown` array is cumulative: once a card has appeared in any round, it stays in `activeShown` for the rest of the game. Clicking a card that is *not* in `activeShown` is a loss (the user couldn't have known about it). Preserve this rule.
- `activePickedArray` is the win-tracking set. Length 16 = win; clicking a card already in this set = loss.
- High score updates only at game end (win or loss), not on every click. Keep it that way — updating mid-game would let an in-progress run set a high score that the player hasn't actually completed.
- The popup (`activePopUp`) blurs the game board behind it via the `boxStyle` filter. Keep destructive popups (game over, win) using the same `.endGame` container so styling stays consistent.

## Persistence

There is currently no persistence — high score, picked cards, and music state all reset on reload. If a task adds persistence, use `localStorage` with the prefix `matchingGame_` (e.g., `matchingGame_highScore`). Do not introduce IndexedDB, cookies, or a backend.

## API and external data

- Character data is fetched from `https://dragonball-api.com/api/characters?page=1&limit=16` in `MainSection.fetchData` on mount and passed down via props (`isActiveData` → `activeStandardArray`). Do not fetch from `Card.jsx` or `PlayPage.jsx` directly.
- The hardcoded `pulledData` array in `MainSection.jsx` and the hardcoded `dataArray` in `PlayPage.jsx` are dev-time scaffolding kept for reference. Do not delete them as part of an unrelated task, but also do not start reading from them — the live source of truth is the API response.
- If the API call fails, the game currently renders an empty board. Do not add a hard crash; if a task requires improved error handling, surface it in the UI rather than throwing.

## UI conventions

- The custom font is `customFont1` (Shojumaru), declared in `style.css` via `@font-face`. Use it for game-chrome text (buttons, score, popup) — not for body copy.
- The yellow + black "DBZ button" aesthetic (used on `.fightButton`, `.musicBlock*`, `.retryButton`) has a glow effect via the `:before` pseudo-element and a `glowing*` keyframe animation. When adding a new button in this family, reuse the same pattern — don't invent a new glow.
- Responsive breakpoints: 320px, 481px, 641px, 961px, 1025px, 1281px. The card grid wraps differently at each. Match the existing breakpoints rather than introducing new ones.
- The blur-on-popup effect (`filter: blur(5px)` on the background, `cursor: auto` on interactive children) must apply consistently — when adding new interactive elements on `PlayPage`, thread `popUpStyle` through so they get disabled-looking cursors during the popup.

## Mobile and touch

- Card sizes shrink at narrow widths (down to 55×105px at 320px). When adding card content, make sure it still fits the smallest size — don't assume desktop dimensions.
- Cards use `onClick`, which fires on touch via the browser's synthetic click. Do not add separate `onTouchStart` handlers unless a task explicitly requires it (they tend to double-fire with `onClick`).

## Audio

- Two tracks: `DragonBallZ.mp3` (home) and `NamekTheme.mp3` (play). Volume is hardcoded to 0.07. Both loop.
- The current implementation creates a `new Audio(...)` instance inside the body of each `Handle*Audio` component, which means every re-render of `MainSection` constructs a fresh `Audio` object. The `useEffect` cleanup pauses *that* instance, but a stale instance from a previous render can keep playing. If a task touches audio, prefer moving the `Audio` construction into a `useRef` so the same instance survives re-renders — but do not undertake that refactor unless the task is about audio.
- Autoplay is gated by the browser. The `.play()` promise is wrapped in `.then/.catch` for that reason — keep the catch so a rejected autoplay doesn't unhandled-reject in the console.

## Scope discipline

- Keep changes scoped to the task described. Do not refactor, reformat, or fix unrelated issues in the same PR — file a new entry in `TODO.md` instead.
- Do not delete or rename files unless the task explicitly requires it.
- Do not modify `vite.config.js`, `package.json`, or `package-lock.json` unless the task explicitly requires a build or dependency change.
- The commented-out blocks at the bottom of `MainSection.jsx` and `PlayPage.jsx` (old shuffle logic, old audio switch logic, the unused `pullCharacters` function) are intentionally preserved as scratch references. Do not delete them as cleanup; only remove them if the task is specifically about removing dead code.
- The `console.log` calls scattered through the components are debugging aids. Don't strip them as part of an unrelated task — they're load-bearing for the author's mental model right now.

## What not to flag in review

- Linter, formatter, or type-checker concerns (handled separately).
- Missing test coverage unless the task was to add tests.
- The `console.log` debug statements (see above).
- The commented-out reference blocks at the bottom of `MainSection.jsx` and `PlayPage.jsx`.
- The duplicated hardcoded character arrays (`pulledData`, `dataArray`) — they're scaffolding.
- Stylistic preferences not documented in this file.
- Pre-existing issues on lines the PR did not modify.
- Files in `dist/` or `node_modules/`.

## Known gotchas

- `MainSection.jsx` re-instantiates `new Audio(...)` on every render of each `Handle*Audio` component. Be careful when touching the audio code — the cleanup-on-unmount pattern relies on `useEffect` capturing the fresh instance each render. See the "Audio" section above before changing it.
- `activePickedArray` and `activePositions` are mutated in place inside `Card.handleCardClick` (via `.push` / `.splice`) before being passed to setters. React still re-renders because the setter is called, but the array reference doesn't change — meaning any future `useEffect` that depends on `activePickedArray` or `activePositions` will NOT fire. If a task needs to add such an effect, switch the mutation to a new-array pattern (`[...isPickedArray, item]`) at the same time.
- `dataArray` items in `PlayPage.jsx` use `Math.random()` as `id`, which violates React's stable-key rule. The live API data uses real numeric ids, so the keys are fine in production — but if a task wires `dataArray` back in for any reason, swap to stable ids first.
- The initial card flip on entering `PlayPage` is driven by a `setInterval` that fires once after 1s and a state pair (`isSide`, `isEffect`). Don't replace that with `setTimeout` without verifying the StrictMode double-mount still cleans up correctly.
