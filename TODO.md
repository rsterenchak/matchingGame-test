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

- [x] **[MEDIUM]** Fix bunched nav icons in .topColumn3 on mobile widths — Completed: 2026-07-13
  - Type: bug
  - Description: On mobile widths (320px/481px/641px) .topColumn3 switches from grid to flex but loses the grid's empty-track spacing, so .musicIconWrapper, .musicBlock3, and .helpButton render flush against each other instead of evenly spaced like the desktop grid layout. Fix by adding margin-left: 20px to .musicBlock3 and .helpButton within the 320px, 481px, and 641px media query blocks (matching the desktop grid's visual spacing) without adding a gap on .topColumn3 itself. Verify icon spacing looks even at all three mobile breakpoints and remains unchanged at 961px+ where .topColumn3 reverts to grid.
  - File: `src/style.css`, `src/PlayPage.jsx`
  - Completed: YYYY-MM-DD (PR #<number>)
  <!-- id: 98b5990b-efcd-40a3-9c2d-854fb29fe8b9 -->

- [x] **[MEDIUM]** Align PlayPage nav section2 buttons in a horizontal matched-pair row on mobile — Completed: 2026-07-13
  - Type: bug
  - Description: On the PlayPage nav section2, the nav buttons currently stack/misalign and render at different sizes on narrow (mobile) widths. Lay them out on a single horizontal row, centered as a matched pair, with identical button dimensions and a consistent gap between them. Scope the change to the mobile breakpoints (320px and 481px) only — do not alter the desktop layout. Acceptance criteria for behavior that must survive the realignment: (a) the music toggle button's onClick must still fire the `isCurrentAudio` toggle in `MainSection` that drives the `Handle*Audio` play/pause; (b) the home/back control must still flip `isCurrentPage` back to HomePage; (c) `popUpStyle` (blur + `cursor: auto`) must still thread through both buttons so they read as disabled behind the game-over/win popup.
  - File: `src/style.css`, `src/MobileMenu.jsx`, `src/PlayPage.jsx`
  - Completed: YYYY-MM-DD (PR #<number>)
  <!-- id: cf17bac0-8fca-4207-9c16-335ad93c75b0 -->

- [x] **[HIGH]** Fix missing hamburger menu button on mobile HomePage — Completed: 2026-07-14
  - Type: bug
  - Description: The hamburger/mobile menu button does not appear in the top-left corner of the HomePage at mobile breakpoints (320px–641px), even though `MobileMenu.jsx` exists and presumably renders correctly on PlayPage or desktop. Verify `HomePage.jsx` actually renders `MobileMenu`, and check `style.css` for a rule (media query or z-index/display issue) hiding it specifically at mobile widths on the home screen. Fix so the button is visible and clickable in the top-left corner on mobile, matching existing breakpoints (320px, 481px, 641px).
  - File: `toDoList_main/src/HomePage.jsx`, `toDoList_main/src/MobileMenu.jsx`, `toDoList_main/src/style.css`
  <!-- id: 2ac92eb7-98ee-40b0-86c6-19084d0c0447 -->

- [x] **[MEDIUM]** Fix inconsistent button sizes and relocate PlayPage buttons to a vertical stack in the upper-left corner — Completed: 2026-07-14
  - Type: bug
  - Description: The music toggle, second icon button, and "?" instructions button on `PlayPage` currently render at different sizes because they lack a shared class/dimensions. Restructure them into a single vertical stack anchored to the upper-left of the screen, all sharing identical width/height (e.g. 36px circular buttons) via one shared CSS class instead of per-button inline sizing. Preserve existing behavior: the music button must still toggle `isCurrentAudio` in `MainSection.jsx` correctly; the "?" button must still open the instructional popover, and the popover should continue opening centered on screen (not re-anchored beside the button) — only the trigger buttons move, not the popover's positioning logic. Verify no click listeners or mount-path-registered behavior (e.g. outside-click handlers for the popover) were dependent on the buttons' old DOM location.
  - File: `toDoList_main/src/PlayPage.jsx`, `toDoList_main/src/style.css`
  - Completed:
  <!-- id: da36920e-866c-463d-a296-8fd098ffee22 -->

- [x] **[LOW]** Shrink PlayPage stack buttons and hide the GitHub username/icon — Completed: 2026-07-14
  - Type: bug
  - Description: The three circular buttons (music, second icon, "?") in the upper-left vertical stack on PlayPage are slightly too large; reduce their shared size (e.g. from 36px to ~28-30px) via the shared button class introduced in the prior stacking change. Also hide the "@rsterenchak" text and GitHub icon link currently shown next to the button stack — remove it from the rendered layout (e.g. wrap in `display:none` or remove the element) without deleting the underlying markup/logic if it's reused elsewhere. Verify the button stack's vertical spacing still looks correct at the smaller size across existing breakpoints (320px, 481px, 641px).
  - File: `toDoList_main/src/PlayPage.jsx`, `toDoList_main/src/style.css`
  - Completed:
  <!-- id: d8d562a0-a523-4001-a25d-08f989bb0b74 -->

- [x] **[LOW]** Increase PlayPage stack button size to 34px and remove hover grow effect — Completed: 2026-07-14
  - Type: bug
  - Description: The three circular buttons (music, second icon, "?") in the upper-left vertical stack on PlayPage should be resized to 34x34px via their shared button class. Additionally remove any hover/active scale-up ("grow") transform currently applied to these buttons so they stay visually static on hover/tap. Verify the stack's spacing and alignment still look correct at 34px across existing breakpoints (320px, 481px, 641px).
  - File: `toDoList_main/src/PlayPage.jsx`, `toDoList_main/src/style.css`
  - Completed:
  <!-- id: 080d13e4-c517-4e68-90f9-acafe4295478 -->

- [x] **[LOW]** Match homepage hamburger button yellow to PlayPage nav button yellow — Completed: 2026-07-14
  - Type: bug
  - Description: The hamburger menu button on `HomePage` uses a slightly different shade of yellow than the `.musicBlock*`-family nav buttons on `PlayPage`. Update the hamburger button's background color in CSS to use the exact same yellow value as the PlayPage nav buttons so the two match. Likely a single color value change in the hamburger button's class rule.
  - File: `src/style.css`
  - Completed: 2026-07-14
  <!-- id: c93812cb-65e9-40cb-a54d-c047b99ccbae -->

- [x] **[LOW]** Match desktop nav icon button size to homepage nav button — Completed: 2026-07-15
  - Type: bug
  - Description: On desktop widths (≥1025px breakpoint), the music, settings, and help circular icon buttons in the top-left corner are too small. Resize them to match the dimensions of the existing desktop homepage nav button (e.g. the "Fight" button sizing on `HomePage.jsx`) so all top-level nav controls feel visually consistent, scaling icon glyphs proportionally. Apply this only at the 1025px desktop breakpoint so mobile/tablet sizing is unaffected. Likely defined in `HomePage.jsx`/`PlayPage.jsx`/`MobileMenu.jsx` markup with sizing rules in `style.css`.
  - File: `matchingGame-test/src/style.css`, `matchingGame-test/src/HomePage.jsx`, `matchingGame-test/src/PlayPage.jsx`
  - Completed: YYYY-MM-DD (PR #<number>)
  <!-- id: 7ff7db04-84f7-4e73-a828-2e572f51fd36 -->

- [x] **[LOW]** Match PlayPage nav button spacing and hover-grow effect to HomePage on desktop — Completed: 2026-07-15
  - Type: bug
  - Description: On desktop widths (≥1025px breakpoint), the music/settings/help nav buttons on `PlayPage` sit too close to the page edge compared to the homepage nav button, which has appropriate margin from the border. Update the desktop breakpoint spacing/margin rules so PlayPage nav buttons match HomePage's offset from the page border. Also add the same hover "grow" scale effect (transform: scale on :hover) that the homepage nav button has, applied only at desktop widths. Likely in `style.css` desktop breakpoint rules for nav buttons, with markup in `PlayPage.jsx` and `HomePage.jsx` for reference on existing classes.
  - File: `matchingGame-test/src/style.css`, `matchingGame-test/src/PlayPage.jsx`, `matchingGame-test/src/HomePage.jsx`
  - Completed: YYYY-MM-DD (PR #<number>)
  <!-- id: b507035f-3763-4a4d-bbb8-b3698f1ef39e -->

- [x] **[HIGH]** Fix nav icon buttons turning black on hover after grow-effect change — Completed: 2026-07-15
  - Type: bug
  - Description: After the recent hover-grow change on the desktop nav buttons, hovering a nav icon (music/settings/help) blackens the button — the yellow DBZ background disappears and the icon/circle renders dark instead of scaling cleanly (see the "?" button in the screenshot). The likely cause is the new `:hover` rule overriding `background`/`fill`/`color` (or the `:before` glow pseudo-element) instead of only applying `transform: scale`. Fix so hover applies only the grow (and existing glow) while preserving the yellow background and icon color. Check the nav-button `:hover` and `:before` rules in `style.css` added by the previous change.
  - File: `matchingGame-test/src/style.css`
  - Completed: YYYY-MM-DD (PR #<number>)
  <!-- id: d5e0cc36-ca14-420d-babf-d9b232785abd -->

- [x] **[LOW]** Increase help modal size by ~20% on desktop in PlayPage — Completed: 2026-07-19
  - Type: feature
  - Description: The help/instructions modal on PlayPage is too small on desktop breakpoints (1025px and up). Increase its width and height by roughly 20% at the desktop breakpoints only, leaving mobile sizing untouched. Likely lives in the `.endGame` or a dedicated help-modal class in style.css, scoped under the existing 1025px/1281px breakpoints; verify padding/font-size still read well at the larger size.
  - File: `toDoList_main/src/style.css`, `toDoList_main/src/PlayPage.jsx`
  <!-- id: f5728d4a-dfff-4006-84ea-b1d1b8d9b506 -->

- [x] **[MEDIUM]** Fix home page clipping the Fight button and Goku in short desktop windows — Completed: 2026-10-09
  - Type: bug
  - Description: On viewports ≥961px wide but under ~850px tall (a non-maximized browser window), the home page's bottom row is cut off — the Fight button and the Goku backdrop sit below the visible area with no way to scroll to them. Cause: `.outerSection` in both the `@media (min-width:961px)` and `@media (min-width:1281px)` blocks sets `grid-template-rows: 0.8fr 1.6fr 1fr 0.8fr` with `height: 100%`, but `.homeSection` only has `min-height: 100dvh` (no `height`), so `100%` resolves to auto and the `fr` rows size to content; that content has pixel floors (`.logoContainer { min-height: 220px }`, `.logoContainer2 { min-height: 315px }`, the 84px `.fightButton`, `.inputSection { padding-bottom: 7vh }`, the nav) that stack to roughly 850px, and `body { overflow: hidden }` clips the rest. Fix with scale-to-a-floor-then-scroll, CSS only, mobile breakpoints untouched: (1) in both desktop blocks set `.outerSection { height: 100dvh; min-height: 0 }` so the rows actually divide the viewport, and give `.logoSection` / `.logoSection2` / `.inputSection` `min-height: 0` so grid rows may shrink; (2) replace the pixel `min-height`s on `.logoContainer` and `.logoContainer2` with `height: 100%` of their row plus modest floors (`min-height: 160px` and `min-height: 200px`) — both already use `background-size: contain`, so the art scales with the row; keep `.logoContainer2`'s `top: -18vh` / `translate` nimbus lift and the `nimbus-float` animation as they are; (3) add one new rule, `@media (min-width:961px) and (max-height: 640px) { body { overflow: auto; } .outerSection { height: auto; min-height: 100dvh; } }`, so below the floor the page scrolls instead of shrinking the art further. Verify at 1300×900 (everything visible, no scrollbar), 1300×700 (smaller art, still no scrollbar) and 1300×560 (scrollbar, Fight reachable); confirm 480px and 800px mobile widths are unchanged. Reuse the existing 961/1281 breakpoints — no new width breakpoints.
  - File: `src/style.css`
  <!-- id: 4b386beb-f2ef-4fa9-866c-463afb118215 -->

- [x] **[MEDIUM]** Fix home page clipping the Fight button in short windows between 641 and 960px wide — Completed: 2026-10-09
  - Type: bug
  - Description: PR #124 fixed short-window clipping for viewports ≥961px wide, but the 641–960px band (a non-maximized desktop window, or a tablet in landscape) was left out: at 920×600 and 800×500 the home grid's content is ~775px tall, `body { overflow: hidden }` still applies, and the Fight button sits at ~770px — below the fold with no way to scroll. Mirror the desktop treatment in that band in `src/style.css`: add `@media (min-width:641px) and (max-width:960px) and (max-height: 800px) { body { overflow: auto; } .outerSection { height: auto; min-height: 100dvh; } }` so a short window scrolls to the button. Do not change the band's grid rows or the nimbus nudge (`margin-top: calc(-5vh + 24px)`) — only the overflow and the grid height. Reuse the existing 641/960 breakpoints; no new width breakpoints. At 920×600 and 800×500 the page must scroll and the Fight button be reachable; 920×900 shows everything with no scrollbar; 1300×560 and 390×844 are unchanged from today.
  - File: `src/style.css`
  - Verify: 920x600, 800x500, 920x900, 1300x560, 390x844 → /
  <!-- id: d81b968a-a61d-4e7a-8427-facf14593f21 -->

- [x] **[MEDIUM]** Fix home page clipping the Fight button in short windows between 641 and 960px wide — Completed: 2026-10-09
  - Type: bug
  - Description: PR #124 fixed short-window clipping for viewports ≥961px wide, but the 641–960px band (a non-maximized desktop window, or a tablet in landscape) was left out: at 920×600 and 800×500 the home grid's content is ~775px tall, `body { overflow: hidden }` still applies, and the Fight button sits at ~770px — below the fold with no way to scroll. Mirror the desktop treatment in that band in `src/style.css`: add `@media (min-width:641px) and (max-width:960px) and (max-height: 800px) { body { overflow: auto; } .outerSection { height: auto; min-height: 100dvh; } }` so a short window scrolls to the button. Do not change the band's grid rows or the nimbus nudge (`margin-top: calc(-5vh + 24px)`) — only the overflow and the grid height. Reuse the existing 641/960 breakpoints; no new width breakpoints. At 920×600 and 800×500 the page must scroll (manifest `scrollHeight` > `innerHeight` with `body` overflow-y `auto`) and the Fight button be reachable; after `click "Fight"` the play screen and its How-to-Play modal render fully at 920×600; 920×900 shows everything with no scrollbar; 1300×560 and 390×844 are unchanged from today.
  - File: `src/style.css`
  - Verify: 920x600, 800x500 → / ; click "Fight" ; wait 1500, 920x900, 1300x560, 390x844 → /
  <!-- id: 430915da-d25b-4841-bf42-06e9348fdd9b -->

- [x] **[HIGH]** Fix music playing at full volume on iOS by routing audio through a Web Audio GainNode — Completed: 2026-10-09
  - Type: bug
  - Description: On iOS Safari, HTMLMediaElement.volume is ignored (always 1.0), so the `a.volume = volumeLevel ** 2` assignments in the four Handle*Audio components (HandleHomeAudio, HandlePauseAudio, HandlePlayAudio, HandlePausePlayAudio) in MainSection.jsx have no effect and music is far too loud even with device volume low and the slider at minimum. Route each track through a shared AudioContext with a MediaElementAudioSourceNode -> GainNode -> destination chain, and set `gain.value = volumeLevel ** 2` in the existing volume useEffect, so the volume slider works on iOS. Keep desktop/Android behavior unchanged (same volume curve and default 0.003).
  - File: `src/MainSection.jsx`
  - Implementation notes: Use native Web Audio API only, no new dependencies. Create the AudioContext lazily (and resume() it inside the existing play() effect, which is triggered by the user gesture) and create the MediaElementSource once per Audio element (store it in the existing useRef). Keep the `.play()` `.then/.catch` handling and the cancelled-guard. Keep the `a.volume` assignment as a fallback for browsers without AudioContext.
  - Out of scope: Slider UI changes, other audio refactors, removing commented-out blocks.
  <!-- id: 0ddea085-8a86-479a-9ffc-306c645d8f62 -->

- [x] **[MEDIUM]** Enlarge PlayPage nav buttons to ~48px touch targets and reflow the button stack into a horizontal bottom bar on mobile
  - Type: feature
  - Description: On mobile widths (≤480px) the PlayPage nav controls — the music block (`.musicBlock2`), the page-switch/planet block (`.musicBlock3`), and the help button (`.helpButton`), all grouped under `.topColumn3` inside `.navSection2` — are currently squeezed to `min(7vw,24px)` (~24px) by the per-breakpoint override, well under the 44px minimum touch target. Enlarge `.topColumn3 .navStackButton` to 48px (keeping the 3px black border and yellow DBZ-button fill) and change `.topColumn3` from a vertical `flex-direction: column` stack with `align-items: flex-start` into a horizontal `flex-direction: row` row with `justify-content: space-around` and `align-items: center` inside a rounded pill container (`border-radius: 36px`, `bg-raised`, `border-mid`, `padding: 10px 16px`), positioned below the card grid so it no longer crowds the cards or the score panel. Keep the volume slider inline next to the music button via `.musicIconWrapper` (row + `gap: 10px`) rather than stacked under it. Scope the new row layout, the 48px size, and the override removal to the existing ≤480px breakpoints only — the desktop/tablet vertical stack (≥481px) must render exactly as it does today. Every button keeps its existing handler (`handleMusicClick`, `setupPage()`, `setActiveInstructionsModal(true)`) and continues to receive `popUpStyle` so the popup blur/disabled cursor still applies; `MobileMenu` stays in the same row and remains reachable.
  - File: `src/style.css`, `src/PlayPage.jsx`
  - Completed: 2026-10-09
  <!-- id: 06ec4e60-9990-4c2b-b447-6152d7759356 -->

- [x] **[MEDIUM]** Restyle HomePage nav buttons to match PlayPage's .navStackButton aesthetic and sizing
  - Type: feature
  - Description: Give the HomePage nav controls in `.topColumn1` — the music toggle (`.musicBlock`), the speaker/volume button (`.speakerButton`), and the MobileMenu toggle — the same DBZ button treatment as PlayPage's `.navStackButton` group (`.musicBlock2` / `.musicBlock3` / `.helpButton`): 60×55px, `border-radius: 50%`, `3px solid black` border, `background-color: yellow`, and 26px black SVG glyphs, with a 10px gap between the music/speaker pair. Mirror PlayPage's `@media (max-width: 480px)` rule so these buttons shrink to 48×48px at that breakpoint instead of holding desktop size, and add the shared `.navStackButton` class to the HomePage buttons rather than duplicating the rule. The Fight button is explicitly out of scope — keep it at 273×84px with its existing radius and font — and keep every current `onClick` handler intact (`forMusicIcon()` on the music toggle, `setSliderOpen(o => !o)` on the speaker button, and the MobileMenu open toggle) so audio toggling, the volume slider, and the menu still behave exactly as before. Preserve the existing `glowing*` keyframe glow family on these buttons and do not introduce breakpoints outside the documented set (320 / 481 / 641 / 961 / 1025 / 1281); the buttons must still fit at 320px.
  - File: `src/HomePage.jsx`, `src/style.css`, `src/MobileMenu.jsx`
  - Completed: 2026-10-09
  <!-- id: 984c92df-67ca-44a0-8183-c91c7cf7d31d -->
