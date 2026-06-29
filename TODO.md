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

- [x] **[MEDIUM]** Apply a perceptual (exponential) curve to slider volume so low positions are actually quiet — Completed: 2026-06-28
  - Type: bug
  - Description: The volume slider maps its 0–1 value linearly into `audioRef.current.volume`, but perceived loudness is logarithmic, so the bottom portion of the slider still sounds loud even at a low position. Keep the slider's stored/displayed value linear (0–1) for persistence under `matchingGame_volume` and for slider position, but apply a perceptual taper when computing the gain passed to the Audio instances: set `audioRef.current.volume = volumeLevel ** 2` in each `Handle*Audio` helper in `src/MainSection.jsx` (replacing the direct `audioRef.current.volume = volumeLevel` assignment), so a mid/low slider position yields a much lower actual gain while the top still reaches full volume. Do not change the slider min/max/step, the `value={isVolume}` wiring, the `handleVolumeChange` persistence, or the four `volumeLevel={isVolume}` props. Acceptance: dragging the slider into its lower half produces clearly quiet audio; full-right still reaches full volume; slider-at-zero stays silent; existing volume tests in `src/test/MainSection.test.jsx` still pass (note the `audioRef.current.volume = volumeLevel` regex assertion will need updating to allow the `** 2` taper).
  - File: `src/MainSection.jsx`, `src/test/MainSection.test.jsx`
  - Completed: YYYY-MM-DD (PR #<number>)
  <!-- id: 218cbc16-d267-4c02-bb38-867e46ab4ec6 -->

- [ ] **[MEDIUM]** Add music toggle button and volume slider to PlayPage nav on desktop
  - Type: feature
  - Description: The music toggle icon and a volume slider are currently absent from `PlayPage` on desktop. Add both to the `.navSection` on `PlayPage` so the player can toggle audio and adjust volume without leaving the game. In `MainSection.jsx`, lift volume into a new `useState` (default `0.07`) and pass it down to the `Handle*Audio` components, applying it to the `Audio` instance inside each effect so the slider has real effect. Pass `isCurrentAudio`, the toggle handler, and the volume state + setter to `PlayPage` via props (mirroring how `HomePage` already receives them). The toggle button should reuse the existing music icon and `.musicBlock*` yellow-glow pattern; the volume slider is a native `<input type="range">` styled to match. Both controls must be hidden at ≤640px breakpoints (using existing breakpoint values in `style.css`) and must respect `popUpStyle` so they appear disabled-cursor during the end-game popup.
  - File: `src/MainSection.jsx`, `src/PlayPage.jsx`, `src/style.css`
  - Completed: YYYY-MM-DD (PR #<number>)
  <!-- id: 79a26cdf-cbd4-400b-8f4f-b5b2bd89d6bc -->

- [ ] **[MEDIUM]** Add music toggle button and volume slider to PlayPage nav on desktop
  - Type: feature
  - Repo: rsterenchak/matchingGame-test
  - Description: The music toggle button (`.musicBlock2`) and volume slider (`<input type="range">`) are absent from `PlayPage`'s `.navSection` on desktop — both exist on `HomePage` but were never added to `PlayPage`. Add the toggle button reusing the `.musicBlock*` yellow-glow pattern and wire it to the existing `setAudioPause`/`setAudioPlay` props. Add the native range slider with the same `.volumeSliderWrapper` structure already present on `HomePage`, bound to `isVolume`/`onVolumeChange` props from `MainSection`. Both controls must be hidden at ≤640px (matching the existing `display: none` breakpoint in `style.css`) and must have `style={popUpStyle}` applied so they show a disabled cursor during the end-game popup. Verify `MainSection` is passing `activeCurrentAudio`, `setAudioPause`, `setAudioPlay`, `isVolume`, and `onVolumeChange` to `PlayPage`; add any missing props.
  - File: `src/PlayPage.jsx`, `src/MainSection.jsx`, `src/style.css`
  - Completed: YYYY-MM-DD (PR #<number>)
  <!-- id: 426acfc2-a3a5-4024-9b10-6b0ab634ee45 -->

- [ ] **[MEDIUM]** Add music toggle button with vertical volume slider to PlayPage nav, left of the hamburger menu
  - Type: feature
  - Repo: rsterenchak/matchingGame-test
  - Description: The music toggle button (`.musicBlock2`) and a volume slider are absent from `PlayPage`'s `.navSection` — both exist on `HomePage` but were never added to `PlayPage`. Add the toggle button immediately to the LEFT of the `MobileMenu` hamburger trigger, reusing the `.musicBlock*` yellow-glow pattern, and wire it to the existing `setAudioPause`/`setAudioPlay` props. Render a native `<input type="range">` as a VERTICAL slider positioned directly below the toggle button (use the existing `.volumeSliderWrapper` structure plus a vertical orientation in CSS via `writing-mode: vertical-lr` / `appearance: slider-vertical`); it stays always-visible (no popover/open state), hanging below the toggle. Bind it to the `isVolume`/`onVolumeChange` props. Apply `style={popUpStyle}` to both controls so they show a disabled cursor during the end-game popup, and keep them hidden at ≤640px matching the existing `display: none` breakpoint in `style.css`. Acceptance: tapping the toggle still calls `setAudioPause`/`setAudioPlay` and reflects play/pause state; dragging the slider fires `onVolumeChange` and updates `isVolume`; the toggle does not overlap or block the hamburger's click target; verify `MainSection` passes `activeCurrentAudio`, `setAudioPause`, `setAudioPlay`, `isVolume`, and `onVolumeChange` to `PlayPage` and add any missing prop.
  - File: `src/PlayPage.jsx`, `src/MainSection.jsx`, `src/style.css`
  - Completed: YYYY-MM-DD (PR #<number>)
  <!-- id: 96bbb771-c95c-498d-9370-3ebab43609ab -->

- [ ] **[MEDIUM]** Expose music toggle and vertical volume slider on desktop in PlayPage nav, left of hamburger
  - Type: feature
  - Description: On desktop (≥641px), `.musicIconWrapper` (containing the `.musicBlock2` toggle and `.volumeSliderInput` vertical slider) is currently hidden and its controls are only accessible inside the `MobileMenu` hamburger. Invert the CSS breakpoint so that at ≥641px `.musicIconWrapper` is visible (displayed left of the `.mobileMenuWrapper` hamburger trigger) and the music toggle + volume slider are removed from `MobileMenu`'s rendered output at that width. The toggle must remain wired to `forMusicIcon` → `setAudioPause`/`setAudioPlay` and reflect play/pause state; the slider must remain bound to `isVolume`/`onVolumeChange`; both must have `style={popUpStyle}` applied so they show a disabled cursor during the end-game popup. The vertical slider hangs below the toggle (outside the nav bar height), pushing the card grid down slightly — this is the intended layout. At ≤640px the existing behavior is unchanged: `.musicIconWrapper` stays hidden and the controls remain inside `MobileMenu`. Update the assertions in `PlayPage.test.jsx` lines 348–378 to match the new contract (`.musicIconWrapper` visible at ≥641px, music controls absent from hamburger at ≥641px) — do not delete the tests, invert them.
  - File: `src/PlayPage.jsx`, `src/MobileMenu.jsx`, `src/style.css`
  - Completed: YYYY-MM-DD (PR #<number>)
  <!-- id: 959d5700-26d0-43e9-8e07-0aa4092f5684 -->

- [ ] **[MEDIUM]** Expose music toggle and vertical volume slider on desktop in PlayPage nav, left of hamburger
  - Type: feature
  - Description: On desktop (≥641px), `.musicIconWrapper` (containing the `.musicBlock2` toggle and `.volumeSliderInput` vertical slider) is currently hidden and its controls are only accessible inside the `MobileMenu` hamburger. Invert the CSS breakpoint so that at ≥641px `.musicIconWrapper` is visible (displayed left of the `.mobileMenuWrapper` hamburger trigger) and the music toggle + volume slider are removed from `MobileMenu`'s rendered output at that width. The toggle must remain wired to `forMusicIcon` → `setAudioPause`/`setAudioPlay` and reflect play/pause state; the slider must remain bound to `isVolume`/`onVolumeChange`; both must have `style={popUpStyle}` applied so they show a disabled cursor during the end-game popup. At ≤640px the existing behavior is unchanged: `.musicIconWrapper` stays hidden and the controls remain inside `MobileMenu`. Update the assertions in `PlayPage.test.jsx` lines 348–378 to match the new contract (`.musicIconWrapper` visible at ≥641px, music controls absent from hamburger at ≥641px) — do not delete the tests, invert them.
  - File: `src/PlayPage.jsx`, `src/MobileMenu.jsx`, `src/style.css`
  - Completed: YYYY-MM-DD (PR #<number>)
  <!-- id: 9f63b6ef-fad6-43dc-8e2d-14d71d928402 -->

- [ ] **[MEDIUM]** Expose music toggle and vertical volume slider on desktop in PlayPage nav, left of hamburger
  - Type: feature
  - Description: On desktop (≥641px), `.musicIconWrapper` (containing the `.musicBlock2` toggle and `.volumeSliderInput` vertical slider) is currently hidden and its controls are only accessible inside the `MobileMenu` hamburger. Invert the CSS breakpoint so that at ≥641px `.musicIconWrapper` is visible (displayed left of the `.mobileMenuWrapper` hamburger trigger) and the music toggle + volume slider are removed from `MobileMenu`'s rendered output at that width. The toggle must remain wired to `forMusicIcon` → `setAudioPause`/`setAudioPlay` and reflect play/pause state; the slider must remain bound to `isVolume`/`onVolumeChange`; both must have `style={popUpStyle}` applied so they show a disabled cursor during the end-game popup. At ≤640px the existing behavior is unchanged: `.musicIconWrapper` stays hidden and the controls remain inside `MobileMenu`.
  - File: `src/PlayPage.jsx`, `src/MobileMenu.jsx`, `src/style.css`
  - Completed: YYYY-MM-DD (PR #<number>)
  <!-- id: 36680c5a-d66f-454d-b886-0ce6209c078f -->

- [ ] **[MEDIUM]** Add music toggle and volume slider to PlayPage matching HomePage's layout and positioning
  - Type: feature
  - Description: Copy the `.musicIconWrapper` / `.musicBlock` / `.musicIcon` / `.speakerButton` / `.volumeSliderInput` markup and CSS from `HomePage.jsx` and `src/style.css` into `PlayPage.jsx` so the music controls appear in the same visual position on the play screen as they do on the home screen. Wire the toggle to the existing `forMusicIcon` prop (calls `setAudioPause`/`setAudioPlay`) and the slider to `isVolume`/`onVolumeChange`; apply `style={popUpStyle}` to both so they show a disabled cursor during the end-game popup. Once the controls are rendered directly on `PlayPage`, remove the duplicate music toggle and volume slider from `MobileMenu.jsx` so they are no longer accessible via the hamburger on any viewport width. CSS additions should mirror the existing `.musicIconWrapper` rules already in `style.css` for `HomePage` — reuse selectors where possible rather than duplicating declarations.
  - File: `src/PlayPage.jsx`, `src/MobileMenu.jsx`, `src/style.css`
  - Completed: YYYY-MM-DD (PR #<number>)
  <!-- id: facd783c-2d9d-4e79-87a0-d920727212a3 -->
