# TODO List

- [x] **[LOW]** Fix Delete key not removing project or todo on Mac
  - Type: bug
  - Description: On Mac, pressing the Delete key (the one labeled "Delete" on a MacBook keyboard, which is actually Backspace) on a selected project or selected todo row does nothing ÃÂ¢ÃÂÃÂ the item isn't removed. The expected behavior matches the existing Windows/Linux flow: with a project or todo selected, hitting Delete removes it (with the existing confirmation step for destructive actions, per `CLAUDE.md`). Likely cause: the keyboard listener in `main.js` is checking `e.key === "Delete"` only, which corresponds to the forward-delete key (keyCode 46) ÃÂ¢ÃÂÃÂ that key doesn't exist on most Mac laptop keyboards. The "Delete" key on a MacBook fires `e.key === "Backspace"` (keyCode 8). Fix by accepting both keys in the handler: `if (e.key === "Delete" || e.key === "Backspace")`, while still guarding against firing the delete when an input/textarea/contenteditable has focus (so Backspace inside the rename input or a description textarea still just deletes a character). Grep `main.js` for `"Delete"` and `key ===` to find the relevant handlers ÃÂ¢ÃÂÃÂ there are likely two (one for project selection, one for todo row selection) and both need the same fix. Confirm the existing destructive-action confirmation still triggers from the Backspace path.
  - File: `toDoList_main/src/main.js`
  - Completed: 2026-05-26

- [ ] **[LOW]** Replace tab favicon with 1-star dragonball and rename tab to "DBZ Memory Game"
  - Type: feature
  - Description: Swap the default Vite favicon for a custom 1-star dragonball (orange sphere, single bold red star â chosen for legibility at 16px) and update the document title from `matchingGame-test` to `DBZ Memory Game`. Implement the favicon as an inline SVG data URI on the existing `<link rel="icon">` in `index.html` so no new asset file needs to be tracked â orange fill `#F59E2C` with a `#9A4A0E` 2px outline, single `#C92020` 5-point star centered on a 64Ã64 viewBox. Update the `<title>` in the same file. Delete the orphaned `public/vite.svg` (or the root-level `vite.svg` reference, wherever it currently resolves) as part of the same change so the old asset isn't left dangling. No new dependencies, no build-config changes â purely an `index.html` edit per `CLAUDE.md`'s "don't touch `vite.config.js`/`package.json`" rule.
  - File: `index.html`
  - Completed: YYYY-MM-DD (PR #<number>)

- [ ] **[LOW]** Halve default game audio volume
  - Type: feature
  - Description: Lower the default playback volume of both background tracks (home screen `DragonBallZ.mp3` and play screen `NamekTheme.mp3`) to roughly half their current level — change `audioElement.volume` from `0.07` to `0.035` in `HandleHomeAudio` and `HandlePauseAudio`, and `audioElement2.volume` from `0.07` to `0.035` in `HandlePlayAudio` and `HandlePausePlayAudio`. All four `Handle*Audio` components in `MainSection.jsx` set the volume on the locally constructed `Audio` instance, so all four sites need the same edit to keep the home/play tracks balanced. Note the existing audio gotcha (`CLAUDE.md`): `new Audio(...)` is currently instantiated in each component body, so a fresh instance is built on every re-render — this volume change rides along with that pattern and does not require the `useRef` refactor. No new dependencies, no volume control surfaced to the user as part of this task (scope is just the default).
  - File: `src/MainSection.jsx`
  - Completed: YYYY-MM-DD (PR #<number>)
