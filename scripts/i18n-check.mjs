/**
 * Translation completeness.
 *
 * The site does not fall back to English. A Turkish page shows Turkish or it
 * shows nothing, which means the one thing that can go wrong quietly is a
 * translation that was never written. This script is what stops that being
 * quiet: it fails while anything is still untranslated, and names what.
 *
 * Three kinds of gap, all reported together:
 *
 *   1. UI strings still wrapped in TODO_EN in a locale dictionary.
 *   2. Case studies whose MDX body still carries the UNTRANSLATED marker.
 *   3. Slugs that exist in English and do not exist in another locale at all.
 *      These produce no route, so the language menu has nothing to point at.
 *
 * Run it directly, or as `npm run i18n:check`.
 */
import fs from 'node:fs';
import path from 'node:path';

const LOCALES = ['en', 'tr', 'de'];
const DEFAULT_LOCALE = 'en';
const TRANSLATED = LOCALES.filter((l) => l !== DEFAULT_LOCALE);
const DICTS = ['src/i18n', 'src/i18n/diagrams'];
const COLLECTIONS = ['src/content/projects', 'src/content/ongoing'];
const MARKER = 'UNTRANSLATED';

const read = (file) => (fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null);
const slugs = (dir) =>
  fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter((name) => name.endsWith('.mdx'))
        .map((name) => name.replace(/\.mdx$/, ''))
        .sort()
    : [];

const problems = [];
const lines = [];

// 1 — UI strings still wrapped in TODO_EN.
for (const dir of DICTS) {
  for (const locale of TRANSLATED) {
    const file = path.join(dir, `${locale}.ts`);
    const source = read(file);
    if (source === null) {
      problems.push(`${file} is missing. Every locale needs a dictionary.`);
      continue;
    }
    const pending = (source.match(/TODO_EN\(/g) ?? []).length;
    const total = (source.match(/^\s*(?:[A-Za-z_$][\w$]*|'[^']*'):/gm) ?? []).length;
    lines.push(`  ${file.padEnd(28)} ${String(pending).padStart(4)} untranslated`);
    if (pending > 0) {
      problems.push(`${file}: ${pending} string${pending === 1 ? '' : 's'} still English.`);
    }
    void total;
  }
}

// 2 and 3 — content: markers, and slugs that do not exist at all.
for (const base of COLLECTIONS) {
  const english = slugs(path.join(base, DEFAULT_LOCALE));
  if (english.length === 0) {
    problems.push(`${base}/${DEFAULT_LOCALE} has no entries. Content must live under a locale folder.`);
  }
  for (const locale of TRANSLATED) {
    const dir = path.join(base, locale);
    const have = new Set(slugs(dir));
    const missing = english.filter((slug) => !have.has(slug));
    const marked = [...have].filter((slug) => (read(path.join(dir, `${slug}.mdx`)) ?? '').includes(MARKER));

    lines.push(
      `  ${dir.padEnd(28)} ${String(marked.length).padStart(4)} untranslated, ${missing.length} missing`,
    );
    if (missing.length) {
      problems.push(`${dir}: no entry for ${missing.join(', ')}. That page will not exist in ${locale}.`);
    }
    if (marked.length) {
      problems.push(`${dir}: ${marked.join(', ')} still carry the ${MARKER} marker.`);
    }

    // A slug that exists only in a translation has nothing to be a translation of.
    const extra = [...have].filter((slug) => !english.includes(slug));
    if (extra.length) {
      problems.push(`${dir}: ${extra.join(', ')} exist${extra.length === 1 ? 's' : ''} in ${locale} but not in English.`);
    }
  }
}

console.log('\ni18n completeness\n');
console.log(lines.join('\n'));

if (problems.length === 0) {
  console.log('\nAll locales complete.\n');
  process.exit(0);
}

console.error(`\n${problems.length} thing${problems.length === 1 ? '' : 's'} still to do:\n`);
for (const problem of problems) console.error(`  · ${problem}`);
console.error(
  '\nTranslation runs in batches, so this is expected until the last one\n' +
    'lands. It must pass before the Turkish or German pages are published.\n',
);
process.exit(1);
