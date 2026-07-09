# TODO LIST

- [ ] **[LOW]** Replace scale-on-hover with HomePage's rotating glow effect on PlayPage nav buttons
  - Type: feature
  - Description: PlayPage's `.musicBlock2`, `.musicBlock3`, and `.helpButton` currently use `transform: scale(1.09)` on hover as a stand-in for HomePage's glow effect (see comments at style.css:1240 and :2959). Replace this with the same `:before`/`:after` glow pattern used by HomePage's `.musicBlock`: a blurred, animated rotating yellow gradient `:before` (background-size 400%, `animation: glowing2 20s linear infinite`, `opacity: 0` to `1` on hover with `.2s ease-in-out` transition, `border-radius: 15px`) plus a black backing `:after` layer (`border-radius: 20px`), fully removing the `transform: scale(1.09)` hover rule so the glow entirely replaces the scale effect per the chosen mockup (Variant A). Reuse the existing `@keyframes glowing2` definition rather than duplicating it. Apply identically to all three selectors so PlayPage's nav visually matches HomePage's nav.
  - File: `toDoList_main/src/style.css`
  - Completed:
  <!-- id: f4f9d4d9-5d05-427a-b289-2702e276ac11 -->
