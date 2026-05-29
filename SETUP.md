# Claude run setup — rsterenchak/matchingGame-test

This is the per-project setup record. This is an **existing** repo with a working
`test.yml`, `deploy.yml`, a thorough `CLAUDE.md`, and a populated `TODO.md` — so
this setup only adds the three files the pipeline was missing and wires the repo
into the shared inject/run system. Check each box as you complete it.

## 1 — Drop the generated files into the repo

Only three files are new. Place each at the path shown (repo root).

- [ ] `.github/workflows/claude-run.yml`   ← NEW (was missing)
- [ ] `.claude/routine-base.md`            ← NEW (was missing)
- [ ] `.claude/routine.md`                 ← NEW (was missing)

**Already present — do NOT overwrite:**

- `.github/workflows/test.yml` — already correct: `npm run test:run`, Node 24,
  `paths-ignore: TODO.md`. Functionally identical to the template (plus a handy
  `workflow_dispatch`). Leave it.
- `.github/workflows/deploy.yml` — already correct: builds and publishes `./dist`
  to GitHub Pages via `peaceiris/actions-gh-pages@v4`. It uses a *newer* action
  version than the template would emit, so replacing it would be a downgrade.
  Leave it.
- `CLAUDE.md` — already comprehensive and passes the audit at the bottom of this
  file. Do NOT replace it. One small **addition** is recommended — see
  "CLAUDE.md addition" below — to make the visual-only focus explicit.
- `TODO.md` — already populated. Do NOT clobber; new tasks append to it.

## 2 — Repo secrets and settings (GitHub)

- [ ] Add the repo secret `CLAUDE_CODE_OAUTH_TOKEN` (your Claude Pro/Max OAuth
      token) under the repo's Settings → Secrets and variables → Actions. The
      `claude-run.yml` workflow authenticates with this — without it the run
      can't start. (This is subscription auth, NOT an API key. If an
      `ANTHROPIC_API_KEY` secret also exists it takes precedence and bills the
      API, so don't add one.)
- [ ] GitHub Pages: already in use via `deploy.yml` (the `gh-pages` branch from
      `peaceiris/actions-gh-pages`). Nothing to change unless Pages is disabled.
- [ ] If branch protection on `main` requires PR reviews or status checks, the
      routine's auto-merge will be blocked. Either relax it for the `claude/*`
      branches or accept that runs will open PRs you merge by hand. (Note: your
      `test.yml` runs on `pull_request`, so if you make the Tests check
      *required*, the routine's PR must wait for it to go green before
      auto-merge — that's fine, just expect a short delay, not a block.)

## 3 — Injection workflow (register this repo with the shared Worker)

The inject/run feature talks to a single shared `todo-injector-worker` that
already runs and serves all your projects. These steps REGISTER this repo with
that existing Worker — you are not standing up new infrastructure.

- [ ] **Install the Claude GitHub app on this repo.** Go to
      https://github.com/apps/claude and add `rsterenchak/matchingGame-test` to
      the repo access list (or confirm it's covered by an all-repos install).
- [ ] **Add this repo to the Worker's PAT.** Edit the fine-grained personal
      access token the Worker uses at
      https://github.com/settings/personal-access-tokens — add
      `rsterenchak/matchingGame-test` to the token's repository access list.
      Confirm the token's permissions on this repo include **Contents: read and
      write**, **Actions: read and write**, and **Metadata: read**. (Missing
      Actions:read+write is the classic cause of a 403 "Resource not accessible
      by personal access token" when dispatching a run.)
- [ ] **Add this repo to `ALLOWED_TARGETS`** in the Worker's `src/index.js`.
      Paste this exact line into the allowlist array:

      { repo: "rsterenchak/matchingGame-test", filePath: "TODO.md" },

- [ ] **Deploy the Worker** so the new allowlist entry goes live:

      npx wrangler deploy

      (Run from the worker repo. If wrangler complains about the Node version,
      it needs Node 22+ — `nvm install 22 && nvm use 22`.)
- [ ] **Add the matching target in the PWA's Inject settings modal.** In the app,
      open the inject/sync settings and add a target whose repo is
      `rsterenchak/matchingGame-test` and file path is `TODO.md`, pointing at the
      same Worker URL + shared secret your other projects already use.

## 4 — Verify end to end

- [ ] Push the three new files. Confirm `test.yml` still runs green.
- [ ] From the app (or via the Worker), dispatch a `backlog` run and confirm a
      "Claude run … backlog" appears in the repo's Actions tab.
- [ ] With your existing `TODO.md` entries in place, dispatch again and confirm
      the routine opens and auto-merges a PR for the first eligible task. Run one
      entry at a time until each PR merges — `src/changelog.js` is a shared file
      and concurrent runs can collide on it (the routine re-syncs before pushing,
      but serial runs are safest).

---

## CLAUDE.md addition (recommended — append, don't replace)

Your `CLAUDE.md` already covers scope discipline, the large-file concern, stack
constraints, the data-model boundary, and the testing expectation. To make the
"visual work only" intent explicit and machine-enforced on every run (both the
routine and automated review read CLAUDE.md), append this short section near the
top, just under "Project overview":

```markdown
## Project focus — visual work only

The game logic is complete and correct. All work on this repo is scoped to
visual / presentation concerns: layout, responsive breakpoints (320 / 481 /
641 / 961 / 1025 / 1281px — reuse these, do not add new ones), theming,
animation, typography, asset quality, and the yellow-on-black DBZ button/glow
aesthetic. Do NOT change game-logic behavior — the shuffle/`verifyArray` guard,
the `activeShown` / `activePickedArray` rules, scoring, win/loss conditions, or
the audio model — unless a TODO.md task's Type and description make a logic
change its explicit, primary subject. Prefer CSS/markup-only solutions; if a
visual task seems to need a logic change, file a new TODO.md entry for it rather
than making it inline.
```

## CLAUDE.md audit result (existing project)

Your existing `CLAUDE.md` was checked against what the routine and review rely
on. It already covers everything:

- [x] **Scope discipline** — "Scope discipline" section (no unrelated refactors;
      file new TODO entries; don't touch `vite.config.js` / `package.json` /
      lockfile unasked).
- [x] **Large-file rule** — covered implicitly; `src/style.css` is the only file
      likely to grow large. If it ever trips the Read tool, add an explicit
      "grep then read a range" note for it. (Optional, not blocking.)
- [x] **Stack constraints** — "Stack and constraints" section bans Next/Remix,
      Tailwind/CSS-in-JS/modules, state libs, router, and new deps.
- [x] **Data-model boundary** — "Source file organization" + "Game logic
      conventions" pin game state to `PlayPage`/`Card` and forbid lifting it
      into `MainSection`.
- [x] **Tests expected** — routine writes tests for bugs/features per
      `routine-base.md`; review won't flag missing coverage unless the task was
      to add tests, matching your "What not to flag" section.
