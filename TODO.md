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

- [ ] **[MEDIUM]** Apply grow hover effect to all PlayPage `.navSection2` icons including help toggle
  - Type: feature
  - Description: The grow (scale-up on hover) effect used on the HomePage nav icons is not applied consistently to every icon in `.navSection2` on PlayPage — notably the help question-mark toggle is missing it. Apply the same grow transform to all `.navSection2` icons on PlayPage (audio toggle, help question-mark, and any others) so hover behavior is uniform. Preserve the existing glow and the black-mark hover fix already in place — the grow should layer cleanly with no black background box reintroduced. Likely in the shared grow selector in `style.css` and its application to the icon elements in `MobileMenu.jsx`.
  - File: `toDoList_main/src/style.css`, `toDoList_main/src/MobileMenu.jsx`
  <!-- id: bc5d6155-3b7b-469a-a429-aa7dd1057b88 -->
