// Build helper — writes the current source inventory to dist/src-manifest.json
// so the in-app Claude assistant's Worker can fetch an always-current file list
// instead of relying on a hand-maintained list baked into the Worker prompt.
//
// Run by deploy.yml AFTER the build (which wipes dist/, so this must run after)
// and BEFORE the Pages publish. The published JSON is served at
// https://<pages-host>/src-manifest.json and read by the Worker (short TTL
// cache) and by the dashboard's Structure tab.
//
// Pure Node, no dependencies. Lists JS / JSX / TS / TSX / CSS files under src/,
// sorted, with a generated-at timestamp and the commit SHA (from GITHUB_SHA
// when present). Also emits, for the Structure tab's UI lens, a `regions` map of
// the app's UI handles (id / data-region / className) scanned from the JSX, plus
// a `hasDom` flag. The widened extension list lets the same script work for
// vanilla-JS projects (toDoList_TOP) and React/Vite projects (matchingGame-test).

const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '..', 'src');
const distDir = path.resolve(__dirname, '..', 'dist');

const files = fs
  .readdirSync(srcDir)
  .filter((f) => /\.(?:jsx?|tsx?|css)$/.test(f))
  .sort();

// ── UI region scan ──────────────────────────────────────────────
// Pull UI handles out of the JSX so the Structure tab's UI lens can show a
// published map of this app's regions — it can't walk a live DOM for a repo
// that isn't the one currently running. This is a navigation aid, so the scan
// is deliberately approximate: it reads static attribute literals from the
// source text, not a parsed AST. React here is className-driven, so the class
// token is the primary handle, with id and data-region also picked up. `file`
// mirrors the basenames in `files` above so the tab can cross-link a region
// back to its file in the Code lens.

const JSX_RE = /\.(?:jsx?|tsx?)$/;

function isName(s) {
  return /^[A-Za-z_][\w-]*$/.test(s);
}

// '.main-section' -> 'Main section', '#app' -> 'App'. data-region values are
// author-written, so they are used verbatim.
function prettify(token) {
  const bare = token.replace(/^[.#]/, '').replace(/[-_]+/g, ' ').trim();
  return bare ? bare.charAt(0).toUpperCase() + bare.slice(1) : token;
}

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

function firstToken(value) {
  return String(value).trim().split(/\s+/)[0] || '';
}

// [regex, kind] — kind decides how the captured value becomes a selector.
const PATTERNS = [
  [/\bdata-region\s*=\s*["']([^"']+)["']/g, 'region'],
  [/\bid\s*=\s*["']([^"']+)["']/g, 'id'],
  [/\bclassName\s*=\s*["']([^"']+)["']/g, 'class'],
  [/\bclassName\s*=\s*\{\s*["'`]([^"'`]+)["'`]\s*\}/g, 'class'],
];

const bySelector = new Map();

files
  .filter((f) => JSX_RE.test(f))
  .forEach((name) => {
    const text = fs.readFileSync(path.join(srcDir, name), 'utf8');
    PATTERNS.forEach(([re, kind]) => {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(text)) !== null) {
        const raw = m[1];
        let selector;
        let label;
        if (kind === 'region') {
          const value = raw.trim();
          if (!value) continue;
          selector = '[data-region="' + value + '"]';
          label = value;
        } else if (kind === 'id') {
          if (!isName(raw)) continue;
          selector = '#' + raw;
          label = prettify(selector);
        } else {
          const tok = firstToken(raw);
          if (!isName(tok)) continue;
          selector = '.' + tok;
          label = prettify(selector);
        }
        if (!bySelector.has(selector)) {
          bySelector.set(selector, {
            selector,
            label,
            file: name,
            line: lineOf(text, m.index),
          });
        }
      }
    });
  });

const regions = Array.from(bySelector.values()).sort((a, b) =>
  a.selector.localeCompare(b.selector)
);

// hasDom: this repo renders a DOM if it ships any markup/style source, even
// when no named handles were found — that lets the Structure tab tell a
// DOM-less repo ("no UI surface") apart from a web repo with an empty map.
const hasDom = files.some((f) => /\.(?:jsx?|tsx?|css|html?)$/i.test(f));

fs.mkdirSync(distDir, { recursive: true });

const manifest = {
  generatedAt: new Date().toISOString(),
  sha: process.env.GITHUB_SHA || '',
  files,
  hasDom,
  regions,
};

fs.writeFileSync(
  path.join(distDir, 'src-manifest.json'),
  JSON.stringify(manifest, null, 2)
);

console.log(
  'src-manifest.json written:',
  files.length,
  'files,',
  regions.length,
  'regions'
);
