# TODO LIST

- [x] **[LOW]** Enlarge, recenter, and tuck the Memory Game nimbus cloud under the DBZ logo across mobile breakpoints (320/481/641)
  - Type: feature
  - Description: Apply a consistent enlarged, text-centered, tucked-under-the-logo treatment to `.logoContainer2` (the "Memory Game" nimbus cloud) across the three mobile breakpoints, and update the now-superseded nimbus position regression tests to match the new design. The cloud grows to 82vw, is shifted via `transform: translateX(12.3%)` so its baked-in "MEMORY GAME" text ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ anchored at x=225 in the 597-wide `MemoryGameTitle.svg`, ~12.3% left of the image's bounding-box center because of the rightward tail ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ lands on true horizontal center (percentage is relative to the element's own width, so it auto-scales even under the 641px max-width cap), and is pulled up so the cloud body nestles just beneath the DBZ logo. This intentionally reverses the earlier "keep the cloud below the letters" bug fixes: a slight bounding-box overlap with the logo is now the desired look, since the SVG's transparent padding means the puffy shape does not actually collide with the letterforms.
    - CSS changes (`src/style.css`), per breakpoint:
      - 320px: `width: 55vw ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ 82vw`; `left: 5vw ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ 0`; add `transform: translateX(12.3%)`; `top: -20vh ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ -33vh`; `height: 200px ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ min-height: 220px`. (Validated via mockup.)
      - 481px: `width: 55vw ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ 82vw`; `left: 2vw ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ 0`; add `transform: translateX(12.3%)`; `top: -10vh ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ -24vh`; keep `min-height: 200px` (bump to 220px only if clipped).
      - 641px: `width: 70vw ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ 82vw`, KEEP the existing `max-width: 540px` cap; `left` already `0`; add `transform: translateX(12.3%)`; `top: -5vh ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ -16vh`; keep `min-height: 220px`.
    - Test changes (`src/test/HomePage.test.jsx`) ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ these three assertions encode the OLD "below the letters" spec that this task deliberately supersedes; update each to assert the new tuck-under band instead of an upper ceiling, and rewrite its title/comment to describe the new intent:
      - The 481px assertion (currently "top offset is at most 12vh so the cloud sits below the DBZ title letters") ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ assert the 481px `.logoContainer2` `top` magnitude is in a tuck-under band of roughly 18ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ30vh (intended `-24vh`).
      - The 641px assertion in the "letterform overlap" group (currently "at most 6vh so the cloud clears the letter baseline") ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ assert the 641px `top` magnitude is in a band of roughly 10ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ22vh (intended `-16vh`).
      - The 641px assertion in the "641ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ960px position fix" group (currently "at most 12vh so the cloud does not push up into the DBZ title at tall viewport heights") ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ same 10ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ22vh band as above.
      - Do NOT touch the 1281px assertion (`ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ¤18vh`) or the 641px `left: 0` / `min-height` / grid-row assertions ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ desktop and those invariants are unchanged.
    - Implementation notes:
      - CSS is otherwise markup-free ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ `.logoContainer2` is already an `<img>`, `object-fit: contain` stays; the `nimbus-float` animation and golden drop-shadow are 961px+ only and are untouched.
      - Reuse the existing 320/481/641 breakpoints; leave the 961/1025/1281 rules untouched.
      - Per the routine's test-update rule, call out each rewritten assertion in the commit message and PR body, e.g. "test updated: 481px nimbus top ÃÂÃÂ¢ÃÂÃÂÃÂÃÂ supersedes prior below-the-letters spec per the new tuck-under design", and note in the PR body that this intentionally reverses the earlier letterform-overlap bug fixes.
  - File: `src/style.css`, `src/test/HomePage.test.jsx`
  - Completed: 2026-05-30

- [x] **[HIGH]** Fix mobile nimbus cloud overflow pushing the Fight button off-screen (use margin-top, not top)
  - Type: bug
  - Description: After the "enlarge/recenter/tuck" change (PR #58), the home screen overflows on mobile: the "Memory Game" nimbus cloud detaches and sits low on the screen and the Fight button is pushed off the bottom (clipped by `body { overflow: hidden }`), so the primary call-to-action is unreachable on portrait phones. Root cause: `.logoContainer2` is pulled up with `position: relative; top: -Nvh`, but a relative `top` offset shifts the element only visually and does NOT collapse the space it leaves behind ÃÂ¢ÃÂÃÂ the grid still reserves the cloud's full slot lower in the column. At the new larger magnitudes (`-33vh`/`-24vh`/`-16vh`) plus the 82vw box, the reserved gap makes the stacked column taller than the viewport and the bottom row (`.inputSection` / Fight button) gets clipped. The earlier small offsets (`-20/-10/-5vh`) stayed under that threshold, which is why this only appeared after the upsize. Fix by pulling the cloud up with a NEGATIVE `margin-top` instead of `top` ÃÂ¢ÃÂÃÂ negative margin both shifts the cloud up and collapses the reserved space, so the column no longer overflows and the Fight button stays on screen. Preserve the intended look (82vw, text-centered via `transform: translateX(12.3%)`, tucked just under the DBZ logo).
    - CSS changes (`src/style.css`), per mobile breakpoint ÃÂ¢ÃÂÃÂ replace the `top` offset with `margin-top`, keep everything else:
      - 320px: remove `top: -33vh`; add `margin-top: -33vh`. (Keep width 82vw, translateX(12.3%), min-height 220px, left: 0.)
      - 481px: remove `top: -24vh`; add `margin-top: -24vh`. (Keep width 82vw, translateX(12.3%), min-height 200px, left: 0.)
      - 641px: remove `top: -16vh`; add `margin-top: -16vh`. (Keep width 82vw, max-width 540px, translateX(12.3%), min-height 220px, left: 0.)
      - `position: relative` may be left in place or removed (it's inert without `top`/`left`); do not change `left: 0`, width, transform, or min-height.
      - These vh magnitudes are a starting point carried over from the `top` values; because `margin-top` also pulls the following content up, the effective tuck may differ slightly ÃÂ¢ÃÂÃÂ verify on a real device that (a) the cloud nestles under the logo and (b) the Fight button is fully visible above the browser chrome, and nudge the magnitudes if needed. Do not reintroduce a large negative `top`.
      - Leave the 961/1025/1281 desktop rules untouched.
    - Test changes (`src/test/HomePage.test.jsx`):
      - Regression test FIRST (write it, confirm it fails on current main, then fix): for each mobile breakpoint (320/481/641), assert `.logoContainer2` does NOT use a `top:` offset and DOES use a negative `margin-top`, encoding the root-cause fix so a future relative-`top` offset can't silently reintroduce the overflow.
      - The three existing nimbus-position band assertions added in PR #58 currently match `top:\s*-(\d+)vh`; this task supersedes them ÃÂ¢ÃÂÃÂ update each to match `margin-top:\s*-(\d+)vh` instead (same magnitude bands: ~18ÃÂ¢ÃÂÃÂ30vh at 320/481, ~10ÃÂ¢ÃÂÃÂ22vh at 641), and update their titles/comments to say `margin-top`. Call out each updated assertion in the commit message and PR body per the routine's test-update rule.
      - Do not touch the 1281px assertion or the 641px `left: 0` / `min-height` / grid-row assertions.
  - File: `src/style.css`, `src/test/HomePage.test.jsx`
  - Completed: 2026-05-30

- [x] **[HIGH]** Reduce mobile nimbus cloud margin-top so it sits just below the DBZ logo instead of overlapping it
  - Type: bug
  - Description: After the margin-top overflow fix (PR #59), the mobile nimbus cloud overshoots upward and overlaps the center of the DBZ logo (covers "DRAGON BALL Z" between the "D" and the "Z") on the 320px breakpoint. Cause: switching from `top` to negative `margin-top` both shifts the cloud up and collapses the reserved space, so the same `-33vh` magnitude that previously left the cloud too low now pulls it up onto the logo. The Fight button is correctly on screen now (do not regress that). Fix by reducing the negative `margin-top` magnitude so the cloud's top edge sits just beneath the DBZ logo's baseline, keeping the partial-overlap-with-padding look but off the letterforms. Keep margin-top (not top); keep width 82vw, transform translateX(12.3%), min-height, left: 0.
    - CSS changes (`src/style.css`), starting estimates Ã¢ÂÂ confirm each on a real device:
      - 320px: `margin-top: -33vh Ã¢ÂÂ -15vh` (verified-broken breakpoint; drop the cloud ~13Ã¢ÂÂ18vh so its top clears the logo baseline).
      - 481px and 641px were NOT verified on-device this round Ã¢ÂÂ do not blindly scale. Render each and reduce its margin-top to whatever lands the cloud just under the logo (rough starting points: 481px ~-11vh, 641px ~-7vh), then set the committed value to the confirmed one.
      - Because vh-based pull is viewport-height-sensitive, sanity-check at both a short and a tall phone height that (a) the cloud clears the logo letters and (b) the Fight button stays fully visible above the browser chrome.
    - Test changes (`src/test/HomePage.test.jsx`): the three nimbus `margin-top` band assertions from PR #59 currently expect ~18Ã¢ÂÂ30vh (320/481) and ~10Ã¢ÂÂ22vh (641); the new smaller magnitudes fall below those bands, so widen each band's lower bound to admit the final committed values (e.g. 320/481 Ã¢ÂÂ ~10Ã¢ÂÂ30vh, 641 Ã¢ÂÂ ~4Ã¢ÂÂ22vh) and keep asserting `margin-top:` (not `top:`). Preserve the PR #59 structural assertion that each mobile breakpoint uses negative `margin-top` and no `top` offset. Call out the band changes in the commit message and PR body.
  - File: `src/style.css`, `src/test/HomePage.test.jsx`
  - Completed: 2026-05-30

- [x] **[HIGH]** Revert mobile nimbus cloud changes (PRs #58/#59/#60) to restore the working home screen
  - Type: bug
  - Description: The mobile nimbus cloud rework shipped across PRs #58 (enlarge/recenter/tuck), #59 (margin-top overflow fix), and #60 (reduce margin-top) never converged on a usable layout: depending on the magnitude the cloud either overlaps the DBZ logo letters or sits too low while the Fight button gets clipped behind the browser chrome. Restore the last known-good home screen by reverting all three. Specifically, restore the three mobile `.logoContainer2` rules in `src/style.css` (320/481/641 breakpoints) to their pre-#58 values: `320px` â `height: 200px; width: 55vw; position: relative; top: -20vh; left: 5vw; object-fit: contain` (no margin-top, no transform); `481px` â `min-height: 200px; width: 55vw; position: relative; top: -10vh; left: 2vw; object-fit: contain`; `641px` â `min-height: 220px; width: 70vw; max-width: 540px; position: relative; top: -5vh; left: 0; object-fit: contain`. Leave the 961/1025/1281 desktop rules as they are (they were never touched by #58â#60). Also revert the nimbus-position assertions in `src/test/HomePage.test.jsx` that #58â#60 introduced/rewrote (the margin-top band and "uses margin-top not top" assertions for 320/481/641) back to their pre-#58 form (the `top`-based â¤12vh/â¤6vh letterform-overlap and tall-viewport regression assertions), so the test suite again guards the original below-the-letters behavior. Easiest path: `git revert` the three merge commits (#58 `1e57c9f`, #59 `767060a`, #60 `9d07676`) in reverse order onto a branch, or hand-restore the rules above and diff against commit `1cb43e8` to confirm the home-screen CSS/tests match that known-good state exactly. Do not revert anything unrelated to the nimbus cloud.
  - File: `src/style.css`, `src/test/HomePage.test.jsx`
  - Completed: 2026-05-30

- [x] **[MEDIUM]** Re-do mobile nimbus cloud tuck structurally (tighten grid rows, no large negative margin) — preview before merge
  - Type: feature
  - Description: Re-attempt the "enlarge the Memory Game nimbus cloud, center its text, and tuck it just under the DBZ logo" treatment on mobile (320/481/641), but solve it at the layout level instead of dragging the cloud across an empty grid row with a viewport-relative offset. The prior attempts failed because both `top: -Nvh` (leaves reserved space → column overflows, Fight button clipped) and `margin-top: -Nvh` (height-sensitive; the window where the cloud clears the logo AND the Fight button stays visible was too narrow) are fragile. Instead: tighten the home grid so the logo row and the cloud row sit adjacent and the full four-row column (nav / logo / cloud / Fight) is guaranteed to fit within 100dvh with the cloud naturally resting just below the logo, using little or no negative offset.
    - Approach (CSS-only, `src/style.css`, per mobile breakpoint):
      1. Keep the visual target from before: cloud `width: 82vw` (641px keeps `max-width: 540px`), `transform: translateX(12.3%)` to center the baked-in "MEMORY GAME" text, `left: 0`, `object-fit: contain`.
      2. Reduce the empty gap between logo and cloud by adjusting `.outerSection` `grid-template-rows` (the logo `logoSection` and cloud `logoSection2` fractions) so the cloud sits near the logo by placement, rather than by a big negative margin. Use a small negative `margin-top` (single-digit vh) only for final nudge, not as the primary mechanism.
      3. Constrain the cloud's reserved height so the column fits: the cloud row should not force the stacked total above 100dvh. Verify logo min-height + cloud box + Fight `inputSection` (with its `env(safe-area-inset-bottom)` padding) all fit.
      4. Do not use a large (>~10vh) negative `top` or `margin-top`; do not set `position` offsets that leave reserved space behind.
      5. Leave 961/1025/1281 desktop rules untouched; reuse existing breakpoints.
    - Verification (required before merge): this must be checked on an actual render — a Vercel/branch preview or a device — at both a short and a tall phone height, confirming (a) the cloud sits just under the DBZ logo without covering the letters, (b) the cloud text reads centered, and (c) the Fight button is fully visible above the browser chrome. Do NOT rely on the jsdom text-matching tests alone to judge this — they cannot see layout.
    - Test changes (`src/test/HomePage.test.jsx`): add a structural guard that the four home grid areas remain nav/logo/logoSection2/input in order and that `.logoContainer2` does not use a large negative `top`/`margin-top` (assert any negative offset magnitude is single-digit vh or absent), so a future regression can't silently reintroduce the overflow/overlap. Keep these assertions structural, not pixel-based.
  - File: `src/style.css`, `src/test/HomePage.test.jsx`
  - Completed: 2026-05-31

- [x] **[MEDIUM]** Lower default audio volume by half — Completed: 2026-06-22
  - Type: bug
  - Description: The background music plays roughly 2x louder than intended. The volume is hardcoded to 0.07 on each `new Audio(...)` instance inside the `Handle*Audio` components in `MainSection.jsx`. Reduce it to about 0.035 (half) so both the home and play tracks start at a comfortable level.
  - Behavior: Both `DragonBallZ.mp3` (home) and `NamekTheme.mp3` (play) play at roughly half their current loudness on load, with the music toggle still working as before.
  - File: src/MainSection.jsx
  <!-- id: 8bc63ab7-a6c2-4242-9f17-d2c9edae768e -->

- [x] **[MEDIUM]** Enlarge hamburger menu to a bold tap target on the home and play pages — Completed: 2026-06-22
  - Type: feature
  - Description: The hamburger menu toggle is currently small and easy to overlook on both the HomePage title screen and the PlayPage game screen. Roughly double the hamburger icon and its tap-target box (Option B — ~44x36px button with thicker bars) so it's an unmistakable, thumb-friendly control on both pages. Scale it down gracefully at the existing responsive breakpoints (320px, 481px, 641px, 961px, 1025px, 1281px) so it stays usable at the 320px width without overlapping the logo, score, or music toggle.
  - File: `src/MobileMenu.jsx`, `src/style.css`
  - Completed: 2026-06-22
  <!-- id: 64f75b4a-23a6-4b93-81ae-ade584fb31aa -->

- [x] **[MEDIUM]** Move the Goku nimbus gif to sit directly under the DBZ title on mobile
  - Type: feature
  - Description: On mobile widths only, relocate the Goku-on-nimbus gif on `HomePage` so it sits directly beneath the Dragon Ball Z title/logo, with a clear gap before the Fight button (Option A layout — full-size nimbus, Fight button drops below it). Desktop layout must remain unchanged: the gif keeps its current position at widths above the mobile breakpoints. Implement via the existing responsive breakpoints (320px / 481px / 641px) in `style.css` — prefer CSS ordering/positioning over a JSX reorder so non-mobile widths are untouched. Acceptance: the Fight button and music toggle must stay fully visible and tappable with no overlap with the relocated gif; the logo's sizing must not change; the gif remains decorative (no new click behavior added).
  - File: `src/style.css`, `src/HomePage.jsx`
  - Completed: 2026-06-22
  <!-- id: fb17d723-a58d-483c-92f6-6bc267b7fb08 -->

- [ ] **[MEDIUM]** Reposition home page Fight button above Safari chrome and move Nimbus GIF directly under the title
  - Type: bug
  - Description: On mobile, the Fight button on the home page is overlaid by Safari's bottom browser chrome, making it hard or impossible to tap. Lift the Fight button up so it clears the bottom unsafe area using `padding-bottom`/`margin-bottom` with `env(safe-area-inset-bottom)` on its container so it adapts across iPhone/Safari devices. Separately, move the Goku-on-Nimbus GIF `<img>` so it sits just below and nearly touching the Dragon Ball Z title (roughly a 4px gap), keeping the existing Title → Nimbus → Fight visual order. The button's existing behavior must be preserved: its `onClick` still toggles `isCurrentPage` in `MainSection.jsx` to switch to PlayPage, the home→play audio handoff still fires, and the `.fightButton` glow `:before` pseudo-element/`glowing*` keyframe animation still renders correctly in the new position.
  - File: `src/HomePage.jsx`, `src/style.css`
  - Completed: YYYY-MM-DD (PR #<number>)
  <!-- id: 7ea43c56-5b08-4782-bf12-aa02e0372127 -->
