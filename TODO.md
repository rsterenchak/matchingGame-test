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

- [ ] **[LOW]** Reduce default audio volume from 0.07 to 0.03 for both game tracks
  - Type: bug
  - Description: The current volume of 0.07 is too loud even at low levels. Lower the hardcoded volume constant to 0.03 on both Audio instances. Both tracks (DragonBallZ.mp3 and NamekTheme.mp3) are initialized in the Handle*Audio components inside `src/MainSection.jsx` — update the `.volume` assignment on each.
  - File: `src/MainSection.jsx`
  - Completed: YYYY-MM-DD (PR #<number>)
  <!-- id: d768c20a-c02a-43b8-b4f7-6cec94578010 -->

- [x] **[LOW]** Lower the default volume slider value from 0.005 to 0.003 — Completed: 2026-06-28
  - Type: bug
  - Description: The slider-driven volume system defaults to 0.005 (stored under `matchingGame_volume` in localStorage). This default is still perceived as too loud on some devices. Change the fallback value used when no localStorage entry exists from `0.005` to `0.003` in `src/MainSection.jsx` where `isVolume` state is initialized.
  - File: `src/MainSection.jsx`
  - Completed: YYYY-MM-DD (PR #<number>)
  <!-- id: 65785c1a-1b21-4614-87a4-4223e7822d2e -->

- [ ] **[MEDIUM]** Apply a perceptual (exponential) curve to slider volume so low positions are actually quiet
  - Type: bug
  - Description: The volume slider maps its 0–1 value linearly into `audioRef.current.volume`, but perceived loudness is logarithmic, so the bottom portion of the slider still sounds loud even at a low position. Keep the slider's stored/displayed value linear (0–1) for persistence under `matchingGame_volume` and for slider position, but apply a perceptual taper when computing the gain passed to the Audio instances: set `audioRef.current.volume = volumeLevel ** 2` in each `Handle*Audio` helper in `src/MainSection.jsx` (replacing the direct `audioRef.current.volume = volumeLevel` assignment), so a mid/low slider position yields a much lower actual gain while the top still reaches full volume. Do not change the slider min/max/step, the `value={isVolume}` wiring, the `handleVolumeChange` persistence, or the four `volumeLevel={isVolume}` props. Acceptance: dragging the slider into its lower half produces clearly quiet audio; full-right still reaches full volume; slider-at-zero stays silent; existing volume tests in `src/test/MainSection.test.jsx` still pass (note the `audioRef.current.volume = volumeLevel` regex assertion will need updating to allow the `** 2` taper).
  - File: `src/MainSection.jsx`, `src/test/MainSection.test.jsx`
  - Completed: YYYY-MM-DD (PR #<number>)
  <!-- id: 218cbc16-d267-4c02-bb38-867e46ab4ec6 -->
