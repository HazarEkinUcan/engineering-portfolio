/**
 * signature.ts — turns a generator SVG into scene-space geometry and a
 * timetable, with no Three.js involved.
 *
 * Everything here is arithmetic on the real output of fanuc_writer_ls.py:
 * the pen-down polylines, their `--d` start and `--t` duration in the
 * generator's own milliseconds, and the row structure implied by their
 * vertical extents. Keeping it separate from the renderer means the timing
 * can be reasoned about — and type-checked — without a GPU.
 *
 * ROW DETECTION
 * Merging overlapping stroke y-ranges recovers the text lines exactly: the
 * generator's descenders reach 1.30 em while its line pitch is 1.60 em, so
 * the bands provably cannot touch. Gap-based clustering on stroke centres
 * over-splits and was tried first.
 *
 * TIMETABLE
 * The sequence is a fixed shape — neutral, approach, then draw/travel/draw…,
 * then settle — but the share each row gets is proportional to how long the
 * generator itself spends writing it. Travel between rows is a fixed slice,
 * which lands close to the generator's real 100 mm/sec against 20 mm/sec
 * while writing, and keeps travel visibly quicker than the writing whatever
 * the signature says.
 */
import { toScene } from './dimensions';

/** Seconds. Held apart from the row budget so the shape is stable. */
const NEUTRAL = 0.22;
const APPROACH = 0.5;
const SETTLE = 0.78;
const TRAVEL = 0.3;

/** Longest segment allowed before a stroke is subdivided, in scene units. */
const DENSITY = 0.009;

export interface Row {
  /** First pen-down point of the row, in scene space. */
  x0: number;
  y: number;
  /** Far end of the row, on its baseline. */
  x1: number;
  baseline: number;
  /** Absolute seconds this row is being written. */
  window: [number, number];
}

export interface InkStroke {
  /** Densified scene positions, flat x,y,z — ready for a line geometry. */
  positions: number[];
  /** Segments in `positions`, for partial reveal. */
  segments: number;
  /** Absolute seconds the stroke starts and finishes. */
  a: number;
  b: number;
}

export interface InkTravel {
  positions: number[];
  /** Absolute seconds this pen-up move becomes visible. */
  at: number;
}

export interface Timing {
  duration: number;
  neutralUntil: number;
  approach: [number, number];
  settle: [number, number];
}

export interface Signature {
  rows: Row[];
  strokes: InkStroke[];
  travels: InkTravel[];
  timing: Timing;
}

interface RawStroke {
  points: [number, number][];
  start: number;
  duration: number;
  minY: number;
  maxY: number;
}

/**
 * The poster SVG is already in the page, so the strokes are read from the DOM
 * rather than re-parsed from a string. That costs nothing to ship, and it
 * guarantees the 3D signature is the same signature the visitor already saw.
 */
function readStrokes(svg: SVGSVGElement): RawStroke[] {
  const nodes = svg.querySelectorAll<SVGPolylineElement>('.signature__draw polyline');

  return [...nodes].map((node) => {
    const points = (node.getAttribute('points') ?? '')
      .trim()
      .split(/\s+/)
      .map((pair) => pair.split(',').map(Number) as [number, number]);
    const ms = (key: string): number => parseFloat(node.style.getPropertyValue(`--${key}`)) || 0;
    const ys = points.map((p) => p[1]!);
    return { points, start: ms('d'), duration: ms('t'), minY: Math.min(...ys), maxY: Math.max(...ys) };
  });
}

/** Overlapping vertical extents merge into one text line. */
function bandsOf(strokes: RawStroke[]): [number, number][] {
  const bands: [number, number][] = [];
  for (const stroke of [...strokes].sort((a, b) => a.minY - b.minY)) {
    const last = bands[bands.length - 1];
    if (last && stroke.minY <= last[1]) last[1] = Math.max(last[1], stroke.maxY);
    else bands.push([stroke.minY, stroke.maxY]);
  }
  return bands;
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)]!;
}

/** Subdivide so a wide line can be revealed smoothly rather than per vertex. */
function densify(points: [number, number][]): { positions: number[]; segments: number } {
  const positions: number[] = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    const a = toScene(...points[i]!);
    const b = toScene(...points[i + 1]!);
    const steps = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / DENSITY));
    for (let k = 0; k < steps; k += 1) {
      positions.push(a[0] + ((b[0] - a[0]) * k) / steps, a[1] + ((b[1] - a[1]) * k) / steps, a[2]);
    }
  }
  positions.push(...toScene(...points[points.length - 1]!));
  return { positions, segments: positions.length / 3 - 1 };
}

/**
 * @param svg       the poster SVG already rendered in the page
 * @param duration  total sequence length in seconds
 */
export function parseSignature(svg: SVGSVGElement, duration: number): Signature {
  const raw = readStrokes(svg);
  if (!raw.length) throw new Error('signature: no strokes');

  const bands = bandsOf(raw);
  const members = bands.map(([top, bottom]) =>
    raw.filter((s) => s.minY >= top && s.maxY <= bottom),
  );

  // Generator milliseconds spent writing each row, which is what the row
  // shares of the budget are proportional to.
  const spans = members.map((row) => {
    const t0 = Math.min(...row.map((s) => s.start));
    const t1 = Math.max(...row.map((s) => s.start + s.duration));
    return { t0, t1, length: t1 - t0 };
  });
  const total = spans.reduce((sum, s) => sum + s.length, 0);
  const budget = duration - NEUTRAL - APPROACH - SETTLE - TRAVEL * (members.length - 1);
  if (budget <= 0) throw new Error('signature: duration too short for this many lines');

  const rows: Row[] = [];
  const strokes: InkStroke[] = [];
  let cursor = NEUTRAL + APPROACH;

  members.forEach((row, index) => {
    const span = spans[index]!;
    const length = (budget * span.length) / total;
    const window: [number, number] = [cursor, cursor + length];

    for (const stroke of row) {
      const a = window[0] + ((stroke.start - span.t0) / span.length) * length;
      const b = a + (stroke.duration / span.length) * length;
      strokes.push({ ...densify(stroke.points), a, b });
    }

    // The pen starts at the row's first pen-down point and finishes at the
    // far end of the row, on the baseline — the median of the row's stroke
    // maxima, which for a line of type is exactly where the pen rides.
    const begin = toScene(...row[0]!.points[0]!);
    const xs = row.flatMap((s) => s.points.map((p) => p[0]));
    const finish = toScene(Math.max(...xs), median(row.map((s) => s.maxY)));
    rows.push({ x0: begin[0], y: begin[1], x1: finish[0], baseline: finish[1], window });

    cursor = window[1] + TRAVEL;
  });

  // Pen-up moves, drawn dashed. Ordered by the stroke they lead into so each
  // one appears exactly when the arm would have made it.
  const ordered = [...strokes].sort((a, b) => a.a - b.a);
  const sequence = [...raw].sort((a, b) => a.start - b.start);
  const travels: InkTravel[] = [];
  for (let i = 1; i < sequence.length; i += 1) {
    travels.push({
      positions: [
        ...toScene(...sequence[i - 1]!.points[sequence[i - 1]!.points.length - 1]!),
        ...toScene(...sequence[i]!.points[0]!),
      ],
      at: ordered[i]!.a,
    });
  }

  return {
    rows,
    strokes,
    travels,
    timing: {
      duration,
      neutralUntil: NEUTRAL,
      approach: [NEUTRAL, NEUTRAL + APPROACH],
      settle: [cursor - TRAVEL, duration],
    },
  };
}
