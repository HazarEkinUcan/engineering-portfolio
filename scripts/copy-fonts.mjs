#!/usr/bin/env node
/**
 * copy-fonts.mjs — copy the IBM Plex woff2 files this site uses out of the
 * @ibm/plex-* dev dependencies and into public/fonts/.
 *
 *   npm install     (once)
 *   npm run fonts
 *
 * Package layouts have changed between IBM Plex major versions, so this
 * searches rather than assuming a path, and reports what it found. Until it
 * has run, the @font-face rules in src/styles/fonts.css simply do not resolve
 * and the fallback stack renders — the site works either way.
 */

import { existsSync, mkdirSync, readdirSync, copyFileSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const OUT = join(ROOT, 'public', 'fonts');

/** target name → substrings that must all appear in the source filename */
const WANTED = [
  { out: 'ibm-plex-sans-regular.woff2', pkg: '@ibm/plex-sans', match: ['regular'] },
  { out: 'ibm-plex-sans-medium.woff2', pkg: '@ibm/plex-sans', match: ['medium'] },
  { out: 'ibm-plex-sans-semibold.woff2', pkg: '@ibm/plex-sans', match: ['semibold'] },
  { out: 'ibm-plex-mono-regular.woff2', pkg: '@ibm/plex-mono', match: ['regular'] },
  { out: 'ibm-plex-mono-medium.woff2', pkg: '@ibm/plex-mono', match: ['medium'] },
  { out: 'ibm-plex-serif-regular.woff2', pkg: '@ibm/plex-serif', match: ['regular'] },
  { out: 'ibm-plex-serif-italic.woff2', pkg: '@ibm/plex-serif', match: ['italic'] },
];

function walk(dir, hits = []) {
  if (!existsSync(dir)) return hits;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, hits);
    else if (entry.endsWith('.woff2')) hits.push(full);
  }
  return hits;
}

mkdirSync(OUT, { recursive: true });

let copied = 0;
let missing = 0;

for (const want of WANTED) {
  const pkgDir = join(ROOT, 'node_modules', want.pkg);
  const candidates = walk(pkgDir).filter((file) => {
    const name = file.toLowerCase();
    // Latin subsets only, and never the italic when we want upright.
    if (!want.match.every((needle) => name.includes(needle))) return false;
    if (!want.match.includes('italic') && name.includes('italic')) return false;
    return true;
  });

  // Prefer the shortest path: the complete/whole faces sit above the splits.
  candidates.sort((a, b) => a.length - b.length);
  const source = candidates[0];

  if (!source) {
    console.warn(`  ✗ ${want.out} — nothing matching ${want.match.join(' + ')} in ${want.pkg}`);
    missing += 1;
    continue;
  }

  copyFileSync(source, join(OUT, want.out));
  console.log(`  ✓ ${want.out}  ←  ${source.replace(ROOT + '/', '')}`);
  copied += 1;
}

console.log(`\n${copied} copied, ${missing} missing → public/fonts/`);
if (missing) {
  console.log(
    'If a face is missing, look in node_modules/@ibm/plex-*/fonts and adjust WANTED in this file.',
  );
}
