# TODO LIST

- [x] **[MEDIUM]** Fix nimbus cloud overlapping DBZ logo letters at breakpoints
  - Type: bug
  - Description: On the home/title screen, the "Memory Game" nimbus cloud graphic overlaps and covers the Dragon Ball Z logo letters at the ~485px, ~641px, and ~1281px breakpoints, instead of tucking under the baseline of the letters as intended. The desired look keeps the cloud partially overlapping the lockup (not fully separated) but drops it low enough that it sits beneath the letters rather than across them. Adjust the nimbus positioning (top/margin/translate offset) within these breakpoint blocks in `style.css` so the cloud clears the letterforms; reuse the existing fixed breakpoints (320/481/641/961/1025/1281) rather than introducing new ones, and verify the lockup still holds at the adjacent breakpoints after the shift. The title lockup lives in `HomePage.jsx`; if the offset is driven by an inline computed value (`boxStyle`) rather than CSS, adjust it there instead.
  - File: `src/style.css`, `src/HomePage.jsx`
  - Completed: 2026-05-28

- [x] **[HIGH]** Fix home screen content overflowing below the fold at the 1281px breakpoint
  - Type: bug
  - Description: At the widest desktop breakpoint (`@media (min-width:1281px)`), the home screen no longer fits the viewport Ã¢ÂÂ the DBZ logo and the enlarged "Memory Game" nimbus title cloud push the lower content (Kame House, Goku, and the Fight button) below the fold, so on first load only the top of the title cloud is visible. This is a regression from the recent nimbus/title scale-up (the ~50% upsize that was applied at the 961 and 1281 breakpoints). At the next breakpoint down (`min-width:1025px`) the same elements still fit and show the intended layout (full title cloud, house, Goku, Fight button), so the fix is to bring the 1281px rules back in line with the working 1025px proportions, not to redesign. Investigate the `min-width:1281px` block in style.css and diff it against the `min-width:1025px` block: compare `.logoContainer` (DBZ logo) and `.logoContainer2` (Memory Game nimbus cloud) sizing plus the vertical margins/gaps and `.inputSection` (Fight button) spacing Ã¢ÂÂ the combined stacked height of the centered `.homeSection` column (which uses `min-height: 100dvh`) is exceeding the viewport. Reduce the oversized element sizing and/or inter-element spacing at 1281 so the full column fits within 100dvh, matching the 1025px result. Keep this CSS-only (markup unchanged), reuse the existing fixed breakpoints (no new ones), and regression-check that 961 and 1025 still fit since the same scale-up touched 961.
  - File: `src/style.css`
  - Completed: 2026-05-29

- [ ] **[LOW]** Enlarge, recenter, and tuck the Memory Game nimbus cloud under the DBZ logo across mobile breakpoints (320/481/641)
  - Type: feature
  - Description: Apply a consistent enlarged, text-centered, tucked-under-the-logo treatment to `.logoContainer2` (the "Memory Game" nimbus cloud) across the three mobile breakpoints. The cloud grows to 82vw, is shifted so its baked-in "MEMORY GAME" text â anchored at x=225 in the 597-wide `MemoryGameTitle.svg`, i.e. ~12.3% left of the image's bounding-box center because of the cloud's rightward tail â sits on true horizontal center via `transform: translateX(12.3%)` (the percentage is relative to the element's own rendered width, so it auto-scales and keeps centering the text even when a max-width cap applies), and is pulled up so the cloud body nestles just beneath the DBZ logo ("Closer" placement; slight bounding-box overlap is fine since the SVG has transparent padding around the puffy shape).
    - Per breakpoint:
      - 320px: `width: 55vw â 82vw`; `left: 5vw â 0`; add `transform: translateX(12.3%)`; `top: -20vh â -33vh`; `height: 200px â min-height: 220px`. (Validated via mockup.)
      - 481px: `width: 55vw â 82vw`; `left: 2vw â 0`; add `transform: translateX(12.3%)`; `top: -10vh â ~-24vh`; keep `min-height: 200px` (bump to 220px only if clipped).
      - 641px: `width: 70vw â 82vw` but KEEP the existing `max-width: 540px` cap so it stays modest on tablets (effective size â540px); `left` already `0`; add `transform: translateX(12.3%)`; `top: -5vh â ~-16vh`; keep `min-height: 220px`.
    - Implementation notes:
      - CSS-only â `.logoContainer2` is already an `<img>`, so no JSX change; `object-fit: contain` stays.
      - Reuse the existing 320/481/641 breakpoints (do not introduce new ones); leave the desktop 961/1025/1281 rules untouched.
      - The `-24vh` (481) and `-16vh` (641) `top` values are starting estimates for the "Closer" tuck and may need a small in-browser nudge, since each breakpoint's grid rows differ (`0.8fr 1.4fr 1fr 0.8fr` at 481, `0.8fr 1.5fr 1fr 0.8fr` at 641); 320px's `-33vh` is the confirmed reference.
  - File: `src/style.css`
  - Completed: YYYY-MM-DD (PR #<number>)

- [ ] **[LOW]** Enlarge, recenter, and tuck the Memory Game nimbus cloud under the DBZ logo across mobile breakpoints (320/481/641)
  - Type: feature
  - Description: Apply a consistent enlarged, text-centered, tucked-under-the-logo treatment to `.logoContainer2` (the "Memory Game" nimbus cloud) across the three mobile breakpoints, and update the now-superseded nimbus position regression tests to match the new design. The cloud grows to 82vw, is shifted via `transform: translateX(12.3%)` so its baked-in "MEMORY GAME" text — anchored at x=225 in the 597-wide `MemoryGameTitle.svg`, ~12.3% left of the image's bounding-box center because of the rightward tail — lands on true horizontal center (percentage is relative to the element's own width, so it auto-scales even under the 641px max-width cap), and is pulled up so the cloud body nestles just beneath the DBZ logo. This intentionally reverses the earlier "keep the cloud below the letters" bug fixes: a slight bounding-box overlap with the logo is now the desired look, since the SVG's transparent padding means the puffy shape does not actually collide with the letterforms.
    - CSS changes (`src/style.css`), per breakpoint:
      - 320px: `width: 55vw → 82vw`; `left: 5vw → 0`; add `transform: translateX(12.3%)`; `top: -20vh → -33vh`; `height: 200px → min-height: 220px`. (Validated via mockup.)
      - 481px: `width: 55vw → 82vw`; `left: 2vw → 0`; add `transform: translateX(12.3%)`; `top: -10vh → -24vh`; keep `min-height: 200px` (bump to 220px only if clipped).
      - 641px: `width: 70vw → 82vw`, KEEP the existing `max-width: 540px` cap; `left` already `0`; add `transform: translateX(12.3%)`; `top: -5vh → -16vh`; keep `min-height: 220px`.
    - Test changes (`src/test/HomePage.test.jsx`) — these three assertions encode the OLD "below the letters" spec that this task deliberately supersedes; update each to assert the new tuck-under band instead of an upper ceiling, and rewrite its title/comment to describe the new intent:
      - The 481px assertion (currently "top offset is at most 12vh so the cloud sits below the DBZ title letters") → assert the 481px `.logoContainer2` `top` magnitude is in a tuck-under band of roughly 18–30vh (intended `-24vh`).
      - The 641px assertion in the "letterform overlap" group (currently "at most 6vh so the cloud clears the letter baseline") → assert the 641px `top` magnitude is in a band of roughly 10–22vh (intended `-16vh`).
      - The 641px assertion in the "641–960px position fix" group (currently "at most 12vh so the cloud does not push up into the DBZ title at tall viewport heights") → same 10–22vh band as above.
      - Do NOT touch the 1281px assertion (`≤18vh`) or the 641px `left: 0` / `min-height` / grid-row assertions — desktop and those invariants are unchanged.
    - Implementation notes:
      - CSS is otherwise markup-free — `.logoContainer2` is already an `<img>`, `object-fit: contain` stays; the `nimbus-float` animation and golden drop-shadow are 961px+ only and are untouched.
      - Reuse the existing 320/481/641 breakpoints; leave the 961/1025/1281 rules untouched.
      - Per the routine's test-update rule, call out each rewritten assertion in the commit message and PR body, e.g. "test updated: 481px nimbus top — supersedes prior below-the-letters spec per the new tuck-under design", and note in the PR body that this intentionally reverses the earlier letterform-overlap bug fixes.
  - File: `src/style.css`, `src/test/HomePage.test.jsx`
  - Completed: YYYY-MM-DD (PR #<number>)
