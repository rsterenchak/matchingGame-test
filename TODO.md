# TODO LIST

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
