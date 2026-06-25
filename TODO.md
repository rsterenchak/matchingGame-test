# TODO LIST

- [x] **[LOW]** Add a placeholder test file to verify the test runner executes successfully
  - Type: feature
  - Description: Create a minimal test file with a single passing assertion (e.g., `expect(true).toBe(true)`) to confirm Vitest is configured and the test pipeline runs end-to-end. No component logic is tested. This is a run verification only.
  - File: `src/index.jsx`
  - Completed: 2026-06-24
  <!-- id: bd283f70-a545-4a54-ae75-cde5928e3932 -->

- [ ] **[HIGH]** Set explicit min/max/step on the volume sliders so values map to the Audio 0–1 range
  - Type: bug
  - Description: The volume sliders have no explicit `min`/`max`/`step`, so they default to min=0, max=100, step=1 and emit integer values (0, 1, 2…). Since `audioRef.current.volume` expects 0.0–1.0 and clamps anything ≥1 to full volume, every non-zero slider step sets the Audio to maximum — which is why the music is loud at "almost all the way down" yet fully silent only at exactly zero, and why touching the slider overrides the low `0.005` default. Fix by adding `min="0" max="1" step="0.001"` to the range inputs in `HomePage.jsx` (~lines 116-125) and `MobileMenu.jsx` (~lines 68-74) so the slider emits fractional values across the full audible low end and values near the `0.005` default are reachable. Leave the existing wiring intact: `value={isVolume}`, `onChange` → `parseFloat` → `onVolumeChange` → `handleVolumeChange` → `setVolume` + localStorage persist, and the downstream `volumeLevel` sync to the Audio instances. Acceptance: dragging the slider produces a smooth volume ramp from silent to full; a low slider position sounds quiet (not full volume); slider-at-zero stays silent; the persisted/default `0.005` value lands at a correspondingly low slider position; existing volume tests still pass.
  - File: `src/HomePage.jsx`, `src/MobileMenu.jsx`
  - Completed: YYYY-MM-DD (PR #<number>)
  <!-- id: a8ddfd17-9740-4ccb-9fa8-24ddda18bdef -->
