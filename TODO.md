# TODO LIST

- [x] **[MEDIUM]** Fix nimbus cloud overlapping DBZ logo letters at breakpoints
  - Type: bug
  - Description: On the home/title screen, the "Memory Game" nimbus cloud graphic overlaps and covers the Dragon Ball Z logo letters at the ~485px, ~641px, and ~1281px breakpoints, instead of tucking under the baseline of the letters as intended. The desired look keeps the cloud partially overlapping the lockup (not fully separated) but drops it low enough that it sits beneath the letters rather than across them. Adjust the nimbus positioning (top/margin/translate offset) within these breakpoint blocks in `style.css` so the cloud clears the letterforms; reuse the existing fixed breakpoints (320/481/641/961/1025/1281) rather than introducing new ones, and verify the lockup still holds at the adjacent breakpoints after the shift. The title lockup lives in `HomePage.jsx`; if the offset is driven by an inline computed value (`boxStyle`) rather than CSS, adjust it there instead.
  - File: `src/style.css`, `src/HomePage.jsx`
  - Completed: 2026-05-28
