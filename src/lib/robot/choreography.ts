/**
 * choreography.ts — where the tool tip is at a given second, and what the two
 * big joints have to do to put it there.
 *
 * Ported from robot-arm-prototype/src/choreography.js, generalised over the
 * number of rows and retimed from the prototype's 12-second review pace to
 * the production sequence. The shape is unchanged:
 *
 *   neutral → travel to row 1 → draw row 1 → travel → draw → … → lift & settle
 *
 * The arm does NOT chase individual strokes. It places the tool at the start
 * of a row and advances steadily along it while the ink draws underneath, with
 * a small tapered wrist motion so the pose is alive rather than frozen. That
 * is how a real six-axis machine writes — the big axes hold station and the
 * wrist does the letters — and chasing strokes made the arm twitch.
 *
 * Travel is a separate state and reads that way: quintic ease, an arced lift
 * clear of the paper, and the tool tipped back off the work.
 */
import type { Signature } from './signature';
import type { RobotDimensions } from './dimensions';

export const clamp = (v: number, a = 0, b = 1): number => Math.max(a, Math.min(b, v));
const smooth = (t: number): number => {
  const p = clamp(t);
  return p * p * p * (p * (p * 6 - 15) + 10);
};
const mix = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Where the tool waits before and after the sequence. */
export const REST = { x: -1.5, y: 2.45, angle: -2.04 };
const WRITING_ANGLE = -2.04;

export interface Pose {
  x: number;
  y: number;
  /** World-space tool attitude, radians. */
  angle: number;
  /** Row being written, or -1 when the pen is up. */
  line: number;
  phase: string;
}

export interface JointAngles {
  shoulder: number;
  elbow: number;
  wrist: number;
  reachable: boolean;
}

type Point = { x: number; y: number; angle: number };

function drawPose(row: { x0: number; x1: number; y: number }, p: number, time: number): Point {
  // Tapered at both ends so the wrist settles into and out of contact.
  const envelope = Math.sin(Math.PI * p);
  return {
    x: mix(row.x0, row.x1, p),
    y: row.y + Math.sin(time * 15) * 0.026 * envelope,
    angle: WRITING_ANGLE + Math.sin(time * 9) * 0.023 * envelope,
  };
}

function travel(a: Point, b: Point, p: number, lift = 0.3): Point {
  const e = smooth(p);
  const arc = Math.sin(Math.PI * clamp(p));
  return {
    x: mix(a.x, b.x, e),
    y: mix(a.y, b.y, e) + arc * lift,
    angle: mix(a.angle, b.angle, e) - arc * 0.15,
  };
}

export function sampleSequence(time: number, signature: Signature): Pose {
  const { rows, timing } = signature;
  const t = clamp(time, 0, timing.duration);
  const start = (i: number): Point => ({ x: rows[i]!.x0, y: rows[i]!.y, angle: WRITING_ANGLE });
  const end = (i: number): Point => ({ x: rows[i]!.x1, y: rows[i]!.baseline, angle: WRITING_ANGLE });

  if (t < timing.neutralUntil) return { ...REST, phase: 'Neutral', line: -1 };

  if (t < timing.approach[1]) {
    const p = (t - timing.approach[0]) / (timing.approach[1] - timing.approach[0]);
    return { ...travel(REST, start(0), p), phase: 'Travel → line 1', line: -1 };
  }

  for (let i = 0; i < rows.length; i += 1) {
    const [a, b] = rows[i]!.window;
    if (t <= b) {
      return { ...drawPose(rows[i]!, clamp((t - a) / (b - a)), t), phase: `Draw / line ${i + 1}`, line: i };
    }
    const next = rows[i + 1];
    if (next && t < next.window[0]) {
      const p = (t - b) / (next.window[0] - b);
      return { ...travel(end(i), start(i + 1), p, 0.36), phase: `Travel → line ${i + 2}`, line: -1 };
    }
  }

  const [from, to] = timing.settle;
  return {
    ...travel(end(rows.length - 1), REST, (t - from) / (to - from), 0.22),
    phase: t < timing.duration ? 'Lift & settle' : 'Complete',
    line: -1,
  };
}

/**
 * Closed-form placement for the two principal joints. The wrist takes up
 * whatever is left over, which is what keeps the pen at a constant attitude
 * to the paper however the arm above it is posed.
 */
export function solvePose(pose: Pose, dimensions: RobotDimensions): JointAngles {
  const { baseX, shoulderY, upper, fore, tool } = dimensions;
  const x = pose.x - Math.cos(pose.angle) * tool - baseX;
  const y = pose.y - Math.sin(pose.angle) * tool - shoulderY;
  const rawCos = (x * x + y * y - upper * upper - fore * fore) / (2 * upper * fore);
  const elbow = Math.acos(clamp(rawCos, -0.9999, 0.9999));
  const shoulder =
    Math.atan2(y, x) - Math.atan2(fore * Math.sin(elbow), upper + fore * Math.cos(elbow));
  return { shoulder, elbow, wrist: pose.angle - shoulder - elbow, reachable: Math.abs(rawCos) <= 1 };
}
