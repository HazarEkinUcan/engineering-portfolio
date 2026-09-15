/**
 * The typed boundary between the strict TypeScript in src/scripts and the
 * three untyped modules that talk to Three.js. three@0.180 ships no
 * declarations of its own, so this is where the types stop rather than
 * spreading `any` through the loader.
 */
export interface RobotHandle {
  /** Run the one-shot sequence. Safe to call once the canvas is revealed. */
  start(): void;
  dispose(): void;
}

export interface MountOptions {
  /** The poster SVG already in the page, whose strokes are re-used. */
  source: SVGSVGElement;
  /** Total sequence length, seconds. */
  duration: number;
}

export function mountRobot(container: HTMLElement, options: MountOptions): Promise<RobotHandle>;