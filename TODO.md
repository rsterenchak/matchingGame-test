# TODO List

- [x] **[LOW]** Fix Delete key not removing project or todo on Mac
  - Type: bug
  - Description: On Mac, pressing the Delete key (the one labeled "Delete" on a MacBook keyboard, which is actually Backspace) on a selected project or selected todo row does nothing Ã¢ÂÂ the item isn't removed. The expected behavior matches the existing Windows/Linux flow: with a project or todo selected, hitting Delete removes it (with the existing confirmation step for destructive actions, per `CLAUDE.md`). Likely cause: the keyboard listener in `main.js` is checking `e.key === "Delete"` only, which corresponds to the forward-delete key (keyCode 46) Ã¢ÂÂ that key doesn't exist on most Mac laptop keyboards. The "Delete" key on a MacBook fires `e.key === "Backspace"` (keyCode 8). Fix by accepting both keys in the handler: `if (e.key === "Delete" || e.key === "Backspace")`, while still guarding against firing the delete when an input/textarea/contenteditable has focus (so Backspace inside the rename input or a description textarea still just deletes a character). Grep `main.js` for `"Delete"` and `key ===` to find the relevant handlers Ã¢ÂÂ there are likely two (one for project selection, one for todo row selection) and both need the same fix. Confirm the existing destructive-action confirmation still triggers from the Backspace path.
  - File: `toDoList_main/src/main.js`
  - Completed: 2026-05-26

- [ ] **[LOW]** Replace tab favicon with 1-star dragonball and rename tab to "DBZ Memory Game"
  - Type: feature
  - Description: Swap the default Vite favicon for a custom 1-star dragonball (orange sphere, single bold red star — chosen for legibility at 16px) and update the document title from `matchingGame-test` to `DBZ Memory Game`. Implement the favicon as an inline SVG data URI on the existing `<link rel="icon">` in `index.html` so no new asset file needs to be tracked — orange fill `#F59E2C` with a `#9A4A0E` 2px outline, single `#C92020` 5-point star centered on a 64×64 viewBox. Update the `<title>` in the same file. Delete the orphaned `public/vite.svg` (or the root-level `vite.svg` reference, wherever it currently resolves) as part of the same change so the old asset isn't left dangling. No new dependencies, no build-config changes — purely an `index.html` edit per `CLAUDE.md`'s "don't touch `vite.config.js`/`package.json`" rule.
  - File: `index.html`
  - Completed: YYYY-MM-DD (PR #<number>)
