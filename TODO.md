# TODO LIST

- [x] **[LOW]** Add a placeholder test file to verify the test runner executes successfully
  - Type: feature
  - Description: Create a minimal test file with a single passing assertion (e.g., `expect(true).toBe(true)`) to confirm Vitest is configured and the test pipeline runs end-to-end. No component logic is tested. This is a run verification only.
  - File: `src/index.jsx`
  - Completed: 2026-06-24
  <!-- id: bd283f70-a545-4a54-ae75-cde5928e3932 -->

- [x] **[HIGH]** Set explicit min/max/step on the volume sliders so values map to the Audio 0–1 range
  - Type: bug
  - Description: The volume sliders have no explicit `min`/`max`/`step`, so they default to min=0, max=100, step=1 and emit integer values (0, 1, 2…). Since `audioRef.current.volume` expects 0.0–1.0 and clamps anything ≥1 to full volume, every non-zero slider step sets the Audio to maximum — which is why the music is loud at "almost all the way down" yet fully silent only at exactly zero, and why touching the slider overrides the low `0.005` default. Fix by adding `min="0" max="1" step="0.001"` to the range inputs in `HomePage.jsx` (~lines 116-125) and `MobileMenu.jsx` (~lines 68-74) so the slider emits fractional values across the full audible low end and values near the `0.005` default are reachable. Leave the existing wiring intact: `value={isVolume}`, `onChange` → `parseFloat` → `onVolumeChange` → `handleVolumeChange` → `setVolume` + localStorage persist, and the downstream `volumeLevel` sync to the Audio instances. Acceptance: dragging the slider produces a smooth volume ramp from silent to full; a low slider position sounds quiet (not full volume); slider-at-zero stays silent; the persisted/default `0.005` value lands at a correspondingly low slider position; existing volume tests still pass.
  - File: `src/HomePage.jsx`, `src/MobileMenu.jsx`
  - Completed: 2026-06-25
  <!-- id: a8ddfd17-9740-4ccb-9fa8-24ddda18bdef -->

- [x] **[MEDIUM]** Add 3D perspective tilt effect to cards on mouse hover based on cursor position
  - Type: feature
  - Description: When the mouse moves over a face-up card, the card should tilt in 3D toward the cursor — calculating the cursor's offset from the card's center and mapping it to `rotateX` and `rotateY` values via `transform: perspective(600px) rotateX(Xdeg) rotateY(Ydeg)`. Add `onMouseMove` and `onMouseLeave` handlers in `Card.jsx`: `onMouseMove` uses `e.currentTarget.getBoundingClientRect()` to compute normalized offset (-1 to 1 on each axis) and derives rotation (suggested max ±15deg); `onMouseLeave` resets transform to identity. Apply via inline `style` prop (dynamic computed value — permitted by CLAUDE.md). Add a smooth `transition: transform 0.1s ease-out` on the card element in `style.css` so the tilt follows the cursor fluidly and snaps back on leave. Disable the effect (or set transform to none) while the popup is active (`popUpStyle` cursor-disabled state) so the effect doesn't fire during end-game. At the smallest breakpoint (320px, 55×105px cards) the effect should still apply but can use a reduced max rotation (±8deg) to avoid clipping adjacent cards.
  - File: `src/Card.jsx`, `src/style.css`
  - Completed: 2026-06-25
  <!-- id: 61bbfa1a-66bb-44ba-8bed-54d8cdf48217 -->

- [x] **[LOW]** Shift nimbus cloud 10% to the right relative to the background on desktop only
  - Type: feature
  - Description: On the HomePage, the nimbus cloud should be repositioned 10% further right relative to its background container, but only at desktop breakpoints (≥961px) — all smaller breakpoints remain unchanged. Locate the nimbus cloud's current positioning rule in `style.css` (likely `left`, `right`, `transform: translateX`, or `background-position` on the cloud or its wrapper element) and increase its horizontal offset by 10% of the background container's width within the appropriate media query (≥961px breakpoint block). If no desktop-specific rule exists for the cloud, add one inside the existing `@media (min-width: 961px)` block rather than modifying the base rule. Do not adjust vertical position, size, or any other property.
  - File: `src/style.css`
  - Completed: 2026-06-25
  <!-- id: 55db3218-c1de-4550-aba6-cf8190984c25 -->

- [x] **[LOW]** Shift nimbus cloud 5% to the left relative to the background on desktop only
  - Type: feature
  - Description: On the HomePage, the nimbus cloud should be repositioned 5% further left relative to its background container, but only at desktop breakpoints (≥961px) — all smaller breakpoints remain unchanged. Locate the nimbus cloud's current positioning rule in `style.css` (likely `left`, `right`, `transform: translateX`, or `background-position` on the cloud or its wrapper element) and decrease its horizontal offset by 5% of the background container's width within the appropriate media query (≥961px breakpoint block). If no desktop-specific rule exists for the cloud, add one inside the existing `@media (min-width: 961px)` block rather than modifying the base rule. Do not adjust vertical position, size, or any other property.
  - File: `src/style.css`
  - Completed: 2026-06-25
  <!-- id: 4341e4f8-0ff7-4d55-9009-5d88385a8e75 -->

- [x] **[LOW]** Add subtle floating animation to `#logoContainer2` on mobile viewports
  - Type: feature
  - Description: Define a CSS keyframe animation (`@keyframes floatCloud`) that translates `#logoContainer2` vertically between 0 and roughly -10px on a ~3s ease-in-out infinite loop, giving the element a gentle bobbing effect. Apply the animation inside the existing 320px–641px breakpoints so it only activates on mobile-sized viewports. Use `-webkit-` prefixed keyframes and animation properties alongside the standard ones to ensure the animation runs in Safari (WebKit). No JS changes needed.
  - File: `src/style.css`
  - Completed: 2026-06-25
  <!-- id: 6af9c583-5df5-47aa-b546-729c04a4f691 -->

- [x] **[LOW]** Add a build-trigger comment to index.jsx
  - Type: feature
  - Description: Insert a single inline comment (e.g., `// build trigger`) in `src/index.jsx` to force a fresh Vite build. No logic or behavior changes.
  - File: `src/index.jsx`
  - Completed: 2026-06-28
  <!-- id: de8e42fe-5a8a-4e28-a61f-fe2176fad191 -->

- [x] **[LOW]** Reduce default audio volume from 0.07 to 0.03 for both game tracks
  - Type: bug
  - Description: The current volume of 0.07 is too loud even at low levels. Lower the hardcoded volume constant to 0.03 on both Audio instances. Both tracks (DragonBallZ.mp3 and NamekTheme.mp3) are initialized in the Handle*Audio components inside `src/MainSection.jsx` — update the `.volume` assignment on each.
  - File: `src/MainSection.jsx`
  - Completed: 2026-06-30
  <!-- id: d768c20a-c02a-43b8-b4f7-6cec94578010 -->

- [x] **[LOW]** Lower the default volume slider value from 0.005 to 0.003 — Completed: 2026-06-28
  - Type: bug
  - Description: The slider-driven volume system defaults to 0.005 (stored under `matchingGame_volume` in localStorage). This default is still perceived as too loud on some devices. Change the fallback value used when no localStorage entry exists from `0.005` to `0.003` in `src/MainSection.jsx` where `isVolume` state is initialized.
  - File: `src/MainSection.jsx`
  - Completed: YYYY-MM-DD (PR #<number>)
  <!-- id: 65785c1a-1b21-4614-87a4-4223e7822d2e -->

- [x] **[MEDIUM]** Apply a perceptual (exponential) curve to slider volume so low positions are actually quiet — Completed: 2026-06-28
  - Type: bug
  - Description: The volume slider maps its 0–1 value linearly into `audioRef.current.volume`, but perceived loudness is logarithmic, so the bottom portion of the slider still sounds loud even at a low position. Keep the slider's stored/displayed value linear (0–1) for persistence under `matchingGame_volume` and for slider position, but apply a perceptual taper when computing the gain passed to the Audio instances: set `audioRef.current.volume = volumeLevel ** 2` in each `Handle*Audio` helper in `src/MainSection.jsx` (replacing the direct `audioRef.current.volume = volumeLevel` assignment), so a mid/low slider position yields a much lower actual gain while the top still reaches full volume. Do not change the slider min/max/step, the `value={isVolume}` wiring, the `handleVolumeChange` persistence, or the four `volumeLevel={isVolume}` props. Acceptance: dragging the slider into its lower half produces clearly quiet audio; full-right still reaches full volume; slider-at-zero stays silent; existing volume tests in `src/test/MainSection.test.jsx` still pass (note the `audioRef.current.volume = volumeLevel` regex assertion will need updating to allow the `** 2` taper).
  - File: `src/MainSection.jsx`, `src/test/MainSection.test.jsx`
  - Completed: YYYY-MM-DD (PR #<number>)
  <!-- id: 218cbc16-d267-4c02-bb38-867e46ab4ec6 -->

- [x] **[MEDIUM]** Add music toggle and volume slider to PlayPage matching HomePage's layout and positioning — Completed: 2026-06-29
  - Type: feature
  - Description: Copy the `.musicIconWrapper` / `.musicBlock` / `.musicIcon` / `.speakerButton` / `.volumeSliderInput` markup and CSS from `HomePage.jsx` and `src/style.css` into `PlayPage.jsx` so the music controls appear in the same visual position on the play screen as they do on the home screen. Wire the toggle to the existing `forMusicIcon` prop (calls `setAudioPause`/`setAudioPlay`) and the slider to `isVolume`/`onVolumeChange`; apply `style={popUpStyle}` to both so they show a disabled cursor during the end-game popup. Once the controls are rendered directly on `PlayPage`, remove the duplicate music toggle and volume slider from `MobileMenu.jsx` so they are no longer accessible via the hamburger on any viewport width. CSS additions should mirror the existing `.musicIconWrapper` rules already in `style.css` for `HomePage` — reuse selectors where possible rather than duplicating declarations.
  - File: `src/PlayPage.jsx`, `src/MobileMenu.jsx`, `src/style.css`
  - Completed: YYYY-MM-DD (PR #<number>)
  <!-- id: facd783c-2d9d-4e79-87a0-d920727212a3 -->

- [x] **[LOW]** Shift nimbus cloud image up and left within logoContainer2 on mobile — Completed: 2026-07-01
  - Type: bug
  - Description: On mobile breakpoints, the nimbus cloud graphic nested under `.logoContainer2` on the home screen sits slightly off from its intended spot. Adjust its offset within the existing mobile media queries (320px/481px/641px breakpoints) so it sits about 12px further left and 12px further up relative to its current position, likely via `top`/`left` or `margin` on the nimbus cloud's rule inside those breakpoints. Do not change its positioning at desktop widths.
  - File: `src/style.css`, `src/HomePage.jsx`
  - Completed: YYYY-MM-DD (PR #<number>)
  <!-- id: e999eef2-e449-4c9d-96a7-1df9b00ca641 -->

- [x] **[LOW]** Shift the nimbus cloud image 12px up and to the left on mobile — Completed: 2026-07-01
  - Type: bug
  - Description: On mobile viewports, the nimbus cloud decorative image on the HomePage sits slightly off from its intended position. Adjust its CSS position (via `top`/`left` or `transform: translate`) within the existing mobile breakpoint(s) (320px/481px) to move it 12px up and 12px to the left, without affecting its position at desktop widths. Locate the current rule in the relevant media query block in style.css.
  - File: `src/style.css`, `src/HomePage.jsx`
  - Completed: YYYY-MM-DD (PR #<number>)
  <!-- id: dda3e9f6-ba99-418f-acfa-3abbc4ce4179 -->

- [x] **[LOW]** Add a CSS comment to `style.css` to trigger a redeploy — Completed: 2026-07-03
  - Type: feature
  - Description: Add a harmless top-of-file comment (e.g. a timestamp or note) to `src/style.css` with no functional CSS changes. Purpose is solely to force a new build/deploy of the site. No visual or behavioral change should result.
  - File: `src/style.css`
  - Completed: YYYY-MM-DD (PR #<number>)
  <!-- id: ce47021b-bc07-44e7-a810-ab64682d6af6 -->

- [x] **[LOW]** Shift .logoContainer2 image down at 641px–961px breakpoint
  - Type: bug
  - Description: On HomePage, the img.logoContainer2 element sits too high within the 641px–961px width range. Add or adjust a media query in style.css targeting that breakpoint so the element is pushed down by at least 20px (e.g. via margin-top or transform), without altering its position outside that range or affecting the position of any sibling elements (Fight button, music icon, Goku gif).
  - File: `toDoList_main/src/style.css`
  - Completed: 2026-07-08
  <!-- id: 9233bd0e-7389-4824-b9ea-d292b08ff084 -->

- [x] **[HIGH]** Fix music toggle hover animation shifting card rows down on PlayPage
  - Type: bug
  - Description: The `.musicBlock2:hover` rule animates `width`/`height` via the `change-color3` keyframes (60x55 → 65x60), which grows the element's box model. Since `.musicBlock2` sits in `.navSection2`, the first row of `.outerSection2`'s auto-sized grid (`grid-template-rows: 1fr 2fr 2fr 0.8fr`), the 5px growth increases that row's height and pushes `.logoSection3`/`.logoSection4` (the card rows) downward every time the mouse hovers the toggle. Replace the width/height animation with a non-layout-affecting hover effect (box-shadow ring per chosen Option C), keeping `width: 60px; height: 55px` fixed at all times so no box-model dimension changes on hover. Remove or repurpose the `change-color3` keyframes accordingly.
  - File: `matchingGame-test/src/style.css`, `matchingGame-test/src/PlayPage.jsx`
  - Completed: 2026-07-09
  <!-- id: f6669556-bf96-42a7-a6a2-4b8161bbd7e0 -->

- [x] **[HIGH]** Restore desktop PlayPage nav icon row and hide the hamburger at ≥961px
  - Type: bug
  - Description: On PlayPage the planet (`.musicBlock3`) and help (`.helpButton`) icons are hidden at every screen width and the mobile hamburger (`.mobileMenuWrapper`) shows at every width, so desktop and mobile both collapse to a music-icon + hamburger row and the intended desktop icon row never renders. Root cause is a specificity mismatch: the compound rule `.topColumn3 > .musicBlock3, .topColumn3 > .helpButton { display: none }` is declared in both the `@media (min-width:320px)` and `@media (min-width:641px)` blocks (0,0,2,0), while the desktop re-show is bare `.musicBlock3 { display: flex }` in the 961px/1025px blocks (0,0,1,0) — it loses the match, and `.helpButton` is never re-declared at desktop widths at all. Separately, `.mobileMenuWrapper` is set `display: block` at 320px and 641px and never reset, and `.topColumn3` is flipped from its base grid to `display: flex` at 320px/641px and never restored. Fix (Direction A — desktop icon row, mobile hamburger): in the `@media (min-width:961px)` block add compound `.topColumn3 > .musicBlock3` and `.topColumn3 > .helpButton { display: flex }` so they outrank the earlier hide, add `.mobileMenuWrapper { display: none }`, and reset `.topColumn3 { display: grid }` so the untouched base `grid-template-areas: 'musicBlock2 . musicBlock3 helpBlock .'` lays out the desktop row again. These are min-width rules, so they cascade up through the 1025px/1281px blocks (which only re-declare the harmless bare `.musicBlock3` and need no change). Scope: mobile (<961px) is untouched — still music + hamburger; CSS-only, no markup changes to `PlayPage.jsx` or `MobileMenu.jsx`.
  - File: `src/style.css`
  - Completed: 2026-07-09
  <!-- id: 3ff214d5-f85d-46b7-b9f9-bb932116c67b -->

- [x] **[LOW]** Equalize spacing and apply consistent glow to nav icons in `.navSection2` — Completed: 2026-07-09
  - Type: bug
  - Description: Icons inside `.navSection2` (in `MobileMenu.jsx`) are unevenly spaced and only some use the DBZ button glow effect. Update `.navSection2`'s layout (e.g. flexbox with `justify-content: space-between` or equal `gap`) so all icons are evenly distributed, and apply the existing glow pattern (`:before` pseudo-element + `glowing*` keyframe, matching `.fightButton`/`.musicBlock*`) to every icon in that row consistently. Do not change the layout/positioning of sibling nav sections or other page elements — scope the fix to `.navSection2` and its children only.
  - File: `toDoList_main/src/style.css`, `toDoList_main/src/MobileMenu.jsx`
  <!-- id: 4b061d52-b39d-4029-9597-3d34f6a040f0 -->

- [x] **[LOW]** Equalize spacing and apply HomePage's grow effect to nav icons in `.navSection2` — Completed: 2026-07-09
  - Type: bug
  - Description: Icons inside `.navSection2` on PlayPage (rendered via `MobileMenu.jsx`) are unevenly spaced and don't share a consistent hover/active effect. Update `.navSection2`'s layout (flexbox with equal `gap` or `justify-content: space-between`) so all icons are evenly distributed, and apply the same "grow" style already used on the HomePage nav icons (a scale-up transform on hover/active, not the glow-ring pattern) to every icon in this row for visual consistency. Scope the CSS/layout change to `.navSection2` and its icon children only — do not alter positioning or spacing of other nav sections or unrelated page elements.
  - File: `toDoList_main/src/style.css`, `toDoList_main/src/MobileMenu.jsx`
  <!-- id: 29f3f4d2-5683-452b-8bff-b210076f4c77 -->

- [ ] **[HIGH]** Fix black mark appearing over PlayPage nav icons on hover
  - Type: bug
  - Description: After applying the HomePage "grow" hover effect to `.navSection2` icons on PlayPage, hovering an icon now renders a solid black mark/box behind or over it instead of a clean scale-up. The grow style likely carries a `background`/`box-shadow`/`filter` rule from the HomePage context that doesn't render correctly against PlayPage's icon markup or background, or a transform is triggering an unintended fill/shadow layer. Fix the hover style so only the scale/grow transform applies, with no visible background box, matching the clean look on HomePage. Likely in the shared grow class/selector in `style.css` and its usage in `MobileMenu.jsx` on PlayPage.
  - File: `toDoList_main/src/style.css`, `toDoList_main/src/MobileMenu.jsx`
  <!-- id: fe4a35e7-b2f5-49f6-81f7-e63062eb45c2 -->
