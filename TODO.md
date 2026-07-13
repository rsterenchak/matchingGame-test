# TODO LIST

- [x] **[LOW]** Replace scale-on-hover with HomePage's rotating glow effect on PlayPage nav buttons — Completed: 2026-07-09
  - Type: feature
  - Description: PlayPage's `.musicBlock2`, `.musicBlock3`, and `.helpButton` currently use `transform: scale(1.09)` on hover as a stand-in for HomePage's glow effect (see comments at style.css:1240 and :2959). Replace this with the same `:before`/`:after` glow pattern used by HomePage's `.musicBlock`: a blurred, animated rotating yellow gradient `:before` (background-size 400%, `animation: glowing2 20s linear infinite`, `opacity: 0` to `1` on hover with `.2s ease-in-out` transition, `border-radius: 15px`) plus a black backing `:after` layer (`border-radius: 20px`), fully removing the `transform: scale(1.09)` hover rule so the glow entirely replaces the scale effect per the chosen mockup (Variant A). Reuse the existing `@keyframes glowing2` definition rather than duplicating it. Apply identically to all three selectors so PlayPage's nav visually matches HomePage's nav.
  - File: `toDoList_main/src/style.css`
  - Completed:
  <!-- id: f4f9d4d9-5d05-427a-b289-2702e276ac11 -->

- [x] **[LOW]** Add hover grow animation to PlayPage's musicBlock2 and musicBlock3 alongside existing glow — Completed: 2026-07-09
  - Type: feature
  - Description: PlayPage's .musicBlock2 and .musicBlock3 nav icons currently only have the rotating-glow :before hover effect from PR #107; add HomePage's size-grow hover feedback (60x55px → 65x60px, 0.5s ease) so both effects fire together on hover, matching HomePage's .musicBlock behavior. Implement the grow via a width/height transition (or the change-color2 keyframes) on :hover for both classes, layered with the existing glowing2 :before opacity fade rather than replacing it. Background-color stays yellow throughout, unchanged.
  - File: `src/style.css`
  - Completed: 2025-06-01 (PR #108)
  <!-- id: 50de06dd-6782-46ed-88fb-7ead039d15e3 -->

- [x] **[MEDIUM]** Apply grow hover effect to all PlayPage `.navSection2` icons including help toggle — Completed: 2026-07-09
  - Type: feature
  - Description: The grow (scale-up on hover) effect used on the HomePage nav icons is not applied consistently to every icon in `.navSection2` on PlayPage — notably the help question-mark toggle is missing it. Apply the same grow transform to all `.navSection2` icons on PlayPage (audio toggle, help question-mark, and any others) so hover behavior is uniform. Preserve the existing glow and the black-mark hover fix already in place — the grow should layer cleanly with no black background box reintroduced. Likely in the shared grow selector in `style.css` and its application to the icon elements in `MobileMenu.jsx`.
  - File: `toDoList_main/src/style.css`, `toDoList_main/src/MobileMenu.jsx`
  <!-- id: bc5d6155-3b7b-469a-a429-aa7dd1057b88 -->

- [x] **[MEDIUM]** Reduce mobile PlayPage nav to 3 icons matching desktop (music, background, help) — Completed: 2026-07-13

- Type: feature
- Description: On PlayPage below 641px, replace the current mobile nav (musicIconWrapper with musicBlock2 + separate speakerButton, hamburgerButton opening MobileMenu) with exactly 3 icons matching desktop's set: a merged music toggle (musicBlock2, tap toggles play/pause via forMusicIcon) that reveals the existing volumeSliderWrapper via long-press instead of the separate speakerButton, the background/planet toggle (musicBlock3, setupPage), and the help icon (helpButton, opens instructions modal). Remove the hamburgerButton/MobileMenu rendering from the mobile breakpoints (<641px and 641-960px) so mobileMenuWrapper stays hidden until it's no longer needed; keep the GitHub link accessible via the existing portfolioIcon2/portfolioBlock2 in the footer row (currently hidden below 641px — make it visible on mobile so GitHub isn't lost). Update media queries so `.topColumn3 > .musicBlock3, .topColumn3 > .helpButton` are shown (not hidden) below 641px, `.musicIconWrapper`'s speakerButton element is removed or repurposed for the long-press interaction, and `.mobileMenuWrapper`/MobileMenu usage is removed from PlayPage's mobile render path. Likely code: the `<div className='topColumn3'>` markup and its CSS breakpoints in `src/PlayPage.jsx` and `src/style.css`.
- File: `src/PlayPage.jsx`, `src/style.css`
- Completed: 2025-06-01 (PR #1)
  <!-- id: 2c6305a3-fa29-4c65-a9fc-307871fb2e45 -->

- [x] **[MEDIUM]** Reduce mobile PlayPage nav to 3 icons matching desktop (music, background, help) — Completed: 2026-07-13
  - Type: feature
  - Description: On PlayPage below 641px, replace the current mobile nav (musicIconWrapper with musicBlock2 + separate speakerButton, plus hamburgerButton/MobileMenu) with exactly 3 icons matching desktop's set: a merged music toggle (tap toggles music via forMusicIcon, long-press/hold reveals the volume slider inline instead of a separate speakerButton icon), the musicBlock3 planet/background button (setupPage), and the helpButton ('?', opens instructions modal). Remove the hamburgerButton and MobileMenu rendering from PlayPage's mobile breakpoints entirely (desktop already doesn't render it); the GitHub link stays only in portfolioBlock2/portfolioIcon2. Update the media queries so musicBlock3 and helpButton are shown (not hidden) below 641px, and mobileMenuWrapper/hamburgerButton are hidden at all mobile widths. Add a long-press/hold handler on musicBlock2 (touch/mouse hold, e.g. via onTouchStart/onMouseDown + timer) to open the existing volumeSliderWrapper in place of the removed speakerButton.
  - File: `src/PlayPage.jsx`, `src/style.css`, `src/MobileMenu.jsx`
  - Completed: YYYY-MM-DD (PR #<number>)
  <!-- id: e14cd8b4-e755-4ed0-914a-93fd1f22030f -->

- [x] **[MEDIUM]** Scope the 641px+ volumeSliderWrapper override to .sliderOpen so nav icons stay equal-sized — Completed: 2026-07-13
  - Type: bug
  - Description: At viewports ≥641px, the media-query rule for `.volumeSliderWrapper` (style.css:2334) applies `display:flex` and `position:relative` unconditionally instead of only when the wrapper has the `sliderOpen` class, unlike the base rule it's meant to override. This makes the 28x76px volume slider render permanently in-flow beneath the music icon, stretching `.musicIconWrapper` and breaking the 3-icon nav row (music, planet, help) out of visual alignment even when the slider is closed. Fix by changing the selector at style.css:2334 to `.volumeSliderWrapper.sliderOpen` so it only takes flow space when toggled open, matching the base rule's scoping; verify the three nav circles (`.musicBlock2`, `.musicBlock3`, `.helpButton`) render as equal 60x55px circles in a horizontal row at ≥641px with the slider closed, and confirm the slider still opens in-flow correctly beneath the music icon when `sliderOpen` is active.
  - File: `src/style.css`, `src/PlayPage.jsx`
  - Completed: YYYY-MM-DD (PR #<number>)
  <!-- id: 864cec7b-a042-4cea-b86f-66da6456dc93 -->

- [ ] **[MEDIUM]** Fix bunched nav icons in .topColumn3 on mobile widths
  - Type: bug
  - Description: On mobile widths (320px/481px/641px) .topColumn3 switches from grid to flex but loses the grid's empty-track spacing, so .musicIconWrapper, .musicBlock3, and .helpButton render flush against each other instead of evenly spaced like the desktop grid layout. Fix by adding margin-left: 20px to .musicBlock3 and .helpButton within the 320px, 481px, and 641px media query blocks (matching the desktop grid's visual spacing) without adding a gap on .topColumn3 itself. Verify icon spacing looks even at all three mobile breakpoints and remains unchanged at 961px+ where .topColumn3 reverts to grid.
  - File: `src/style.css`, `src/PlayPage.jsx`
  - Completed: YYYY-MM-DD (PR #<number>)
  <!-- id: 98b5990b-efcd-40a3-9c2d-854fb29fe8b9 -->
