/**
 * dimensions.ts — the numbers the robot, the ink and the camera all agree on.
 *
 * Ported unchanged from robot-arm-prototype/src/robot.js and trajectory.js.
 * They live here rather than inside the model because the choreography solves
 * against them and the ink plane has to sit at the same depth the tool tip
 * reaches. One definition, so the arm cannot write on a plane it misses.
 *
 * Scene units throughout; the arm is roughly 7.3 units of reach.
 */

export interface RobotDimensions {
  /** Distance of the base from the scene origin along +x. */
  baseX: number;
  /** Height of the J2 axis above the floor. */
  shoulderY: number;
  /** J2 → J3. */
  upper: number;
  /** J3 → wrist. */
  fore: number;
  /** Wrist → pen tip. */
  tool: number;
}

export const DIMENSIONS: RobotDimensions = {
  baseX: 3.1,
  shoulderY: 1.22,
  upper: 3.15,
  fore: 3.05,
  tool: 1.1,
};

/** Depth of the writing plane. The robot root sits on it too. */
export const INK_PLANE_Z = 0.56;

/**
 * Signature space → scene space.
 *
 * The generator's SVGs start their first line at (20, 20), so that point is
 * the anchor. One SVG unit is INK_SCALE scene units, and y flips because SVG
 * counts downwards. Both variants use the SAME mapping: the compact signature
 * is simply a smaller object in the same world, and the camera profiles do
 * the reframing. That keeps one robot, one scale and one set of reach limits.
 */
export const INK_SCALE = 0.018;
const ORIGIN = { x: -2.9, y: 3.05 };

export function toScene(x: number, y: number): [number, number, number] {
  return [(x - 20) * INK_SCALE + ORIGIN.x, ORIGIN.y - (y - 20) * INK_SCALE, INK_PLANE_Z];
}
