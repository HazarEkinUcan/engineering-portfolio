#!/usr/bin/env node
/**
 * build-signature.mjs
 *
 * Produces the hero "signature" SVGs from the real FANUC writing-robot
 * generator, so the mark on the home page is genuine machine output rather
 * than a drawing of one.
 *
 * Pipeline
 *   1. run  source material/project 1/fanuc_writer_ls.py  into a temp dir
 *   2. read writing_preview.svg, drop the background rect and preview label
 *   3. rebuild the pen-up TRAVEL moves between consecutive strokes
 *   4. time every stroke from the generator's own feed rates
 *        writing 20 mm/sec   ·   travel 100 mm/sec
 *      then scale the whole run to SIGNATURE_TOTAL_MS so the cadence is
 *      mechanical rather than eased
 *   5. emit a clean SVG per variant into src/assets/hero/
 *
 * Output is committed, so neither Python nor the source material is needed
 * for a normal build. Re-run only when the hero text changes.
 *
 *   node scripts/build-signature.mjs
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const WEBSITE = resolve(HERE, '..');
const GENERATOR = resolve(
  WEBSITE,
  '..',
  'source material',
  'project 1',
  'fanuc_writer_ls.py',
);
const OUT_DIR = resolve(WEBSITE, 'src', 'assets', 'hero');

/** Generator defaults, mm/sec. These are what give the draw its cadence. */
const WRITING_SPEED = 20;
const TRAVEL_SPEED = 100;

/** design-spec.md §7.3 — the whole signature draws in about this long. */
const SIGNATURE_TOTAL_MS = 1200;

const VARIANTS = [
  {
    name: 'signature-wide',
    // Approved content: the name plus one secondary line. The secondary line
    // is wrapped onto two drawn lines purely for proportion — at one line the
    // block is 7.8:1, which reads as a ribbon rather than as a mark.
    text: 'Hazar Ekin Uçan\\nRobotics &\\nIntelligent Systems',
  },
  {
    name: 'signature-name',
    // Below 1024px: the name alone, wrapped so it stays legible when it has
    // only the viewport width to live in.
    text: 'Hazar\\nEkin Uçan',
  },
];

const round = (n) => Math.round(n * 100) / 100;
const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);

function polylineLength(points) {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) total += dist(points[i - 1], points[i]);
  return total;
}

function parseStrokes(svg) {
  const strokes = [];
  const re = /<polyline points="([^"]+)"\s*\/>/g;
  let match;
  while ((match = re.exec(svg)) !== null) {
    const points = match[1]
      .trim()
      .split(/\s+/)
      .map((pair) => pair.split(',').map(Number));
    if (points.length) strokes.push(points);
  }
  return strokes;
}

function generate(text, dir) {
  execFileSync(
    'python3',
    [GENERATOR, text, '--height', '30', '--output-dir', dir],
    { stdio: 'pipe' },
  );
  return readFileSync(join(dir, 'writing_preview.svg'), 'utf8');
}

function buildVariant({ name, text }) {
  const tmp = mkdtempSync(join(tmpdir(), 'signature-'));
  let strokes;
  try {
    strokes = parseStrokes(generate(text, tmp));
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }

  if (!strokes.length) throw new Error(`No strokes produced for ${name}`);

  // Tight bounding box of the drawn path only. The generator pads by 10 mm
  // and paints a white background rect; both are dropped here.
  const all = strokes.flat();
  const minX = Math.min(...all.map((p) => p[0]));
  const maxX = Math.max(...all.map((p) => p[0]));
  const minY = Math.min(...all.map((p) => p[1]));
  const maxY = Math.max(...all.map((p) => p[1]));

  // Padding leaves room for the round line caps and the pen-down nodes.
  const pad = Math.max((maxX - minX), (maxY - minY)) * 0.02;
  const vb = [minX - pad, minY - pad, maxX - minX + pad * 2, maxY - minY + pad * 2];

  // TRAVEL moves: pen up, straight line from the end of one stroke to the
  // start of the next. This is the same distinction the generator writes into
  // the .LS file as PEN_UP / TRAVEL / PEN_DOWN.
  const travels = [];
  for (let i = 1; i < strokes.length; i += 1) {
    const from = strokes[i - 1][strokes[i - 1].length - 1];
    const to = strokes[i][0];
    travels.push({ from, to, length: dist(from, to) });
  }

  // Walk the path in real robot time, then scale to the design budget.
  const timeline = [];
  let clock = 0;
  strokes.forEach((points, i) => {
    if (i > 0) {
      const travel = travels[i - 1];
      travel.start = clock;
      clock += travel.length / TRAVEL_SPEED;
    }
    const length = polylineLength(points);
    timeline.push({ start: clock, duration: length / WRITING_SPEED, length });
    clock += length / WRITING_SPEED;
  });

  const scale = clock > 0 ? SIGNATURE_TOTAL_MS / clock : 0;
  const ms = (seconds) => Math.round(seconds * scale);

  const nodeSize = Math.max(Math.max(vb[2], vb[3]) * 0.005, 0.7);

  const travelEls = travels
    .filter((t) => t.length > 0.01)
    .map((t) => {
      const points = `${round(t.from[0])},${round(t.from[1])} ${round(t.to[0])},${round(t.to[1])}`;
      return `    <polyline points="${points}" style="--d:${ms(t.start)}ms"/>`;
    })
    .join('\n');

  const drawEls = strokes
    .map((points, i) => {
      const d = points.map((p) => `${round(p[0])},${round(p[1])}`).join(' ');
      const t = timeline[i];
      return `    <polyline points="${d}" style="--len:${round(t.length)};--d:${ms(t.start)}ms;--t:${Math.max(ms(t.duration), 16)}ms"/>`;
    })
    .join('\n');

  const nodeEls = strokes
    .map((points, i) => {
      const [x, y] = points[0];
      return `    <rect x="${round(x - nodeSize / 2)}" y="${round(y - nodeSize / 2)}" width="${round(nodeSize)}" height="${round(nodeSize)}" style="--d:${ms(timeline[i].start)}ms"/>`;
    })
    .join('\n');

  // Presentation attributes rather than CSS alone, so the file is also
  // correct when opened on its own or rendered by a tool that ignores CSS.
  // The stylesheet still overrides colour, weight and the dash pattern.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.map(round).join(' ')}" class="signature" data-strokes="${strokes.length}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
  <g class="signature__travel" fill="none" stroke="currentColor" stroke-width="0.4" stroke-dasharray="1.4 1.6" stroke-linecap="butt" vector-effect="non-scaling-stroke">
${travelEls}
  </g>
  <g class="signature__draw" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke">
${drawEls}
  </g>
  <g class="signature__nodes" fill="currentColor" stroke="none">
${nodeEls}
  </g>
</svg>
`;

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, `${name}.svg`), svg, 'utf8');

  const ratio = (vb[2] / vb[3]).toFixed(2);
  console.log(
    `${name}.svg — ${strokes.length} strokes, ${travels.length} travel moves, ` +
      `${ratio}:1, ${(svg.length / 1024).toFixed(1)} KB`,
  );
}

VARIANTS.forEach(buildVariant);
