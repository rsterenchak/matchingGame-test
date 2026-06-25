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

- [ ] **[MEDIUM]** Add 3D perspective tilt effect to cards on mouse hover based on cursor position
  - Type: feature
  - Description: When the mouse moves over a face-up card, the card should tilt in 3D toward the cursor — calculating the cursor's offset from the card's center and mapping it to `rotateX` and `rotateY` values via `transform: perspective(600px) rotateX(Xdeg) rotateY(Ydeg)`. Add `onMouseMove` and `onMouseLeave` handlers in `Card.jsx`: `onMouseMove` uses `e.currentTarget.getBoundingClientRect()` to compute normalized offset (-1 to 1 on each axis) and derives rotation (suggested max ±15deg); `onMouseLeave` resets transform to identity. Apply via inline `style` prop (dynamic computed value — permitted by CLAUDE.md). Add a smooth `transition: transform 0.1s ease-out` on the card element in `style.css` so the tilt follows the cursor fluidly and snaps back on leave. Disable the effect (or set transform to none) while the popup is active (`popUpStyle` cursor-disabled state) so the effect doesn't fire during end-game. At the smallest breakpoint (320px, 55×105px cards) the effect should still apply but can use a reduced max rotation (±8deg) to avoid clipping adjacent cards.
  - File: `src/Card.jsx`, `src/style.css`
  - Completed: YYYY-MM-DD (PR #<number>)
  <!-- id: 33039b79-977d-474e-8ca3-a3e12b0376a1 -->
