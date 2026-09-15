/**
 * heroRobot.ts — decides whether the hero gets a robot, and if so loads it.
 *
 * This is the only part of the 3D hero that ships in the main bundle, and it
 * is deliberately tiny: read one flag, wait for the right moment, dynamic
 * import, reveal. Three.js and everything that touches it live in a chunk that
 * most of the decision paths below never request.
 *
 * WHO DECIDES
 * Not this file. The inline gate in HeroScene.astro runs before the hero has
 * painted and checks the two things that can be known synchronously — reduced
 * motion and WebGL 2 — because it also has to decide, before first paint,
 * whether to show the completed static signature. If it hides that poster, the
 * hero is briefly empty and something has to arrive to fill it.
 *
 * So this module reads the gate's own flag rather than re-deriving the answer.
 * One decision, one place; the poster is hidden if and only if this runs.
 *
 * WHAT THE VISITOR SEES
 *   load           nothing in the mark area — no completed signature, no flash
 *   chunk ready    the canvas fades in on the robot's neutral pose, ink empty
 *   then           the robot writes the signature, once
 *   after          the finished writing and the settled pose stay, indefinitely
 *
 * Every failure after the gate — the import rejects, the renderer will not
 * start, the context is lost, or it is simply taking so long that an empty
 * hero is the worse outcome — sets `data-robot` on the scene, and the CSS puts
 * the completed poster back.
 */
import type { RobotHandle } from '../lib/robot/mount';

/**
 * Total sequence length in seconds. Slow enough that a machine of this weight
 * reads as deliberate; the generator's own 20 mm/sec writing against
 * 100 mm/sec travel sets the proportions inside it.
 */
const DURATION = 6;

/** How far ahead of the viewport to start loading. */
const ROOT_MARGIN = '200px';

/**
 * How long the mark area may stay empty before the poster is shown anyway.
 * This is the one case where the completed signature does appear first, and it
 * is the right trade: on a connection slow enough to hit it, an indefinitely
 * blank hero is worse than a mark that is later rewritten. If the robot does
 * arrive afterwards it cross-fades over the poster as normal.
 */
const PATIENCE_MS = 3000;

/** The variant CSS is currently showing — only one is ever in the layout. */
function visiblePoster(scene: HTMLElement): SVGSVGElement | null {
  for (const svg of scene.querySelectorAll<SVGSVGElement>('svg[data-variant]')) {
    const rect = svg.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) return svg;
  }
  return null;
}

function whenIdle(callback: () => void): void {
  if ('requestIdleCallback' in window) window.requestIdleCallback(callback, { timeout: 1200 });
  else setTimeout(callback, 200);
}

export function initHeroRobot(): void {
  // Set by the inline gate in HeroScene.astro, before first paint. Absent
  // means reduced motion, no WebGL 2, or no gate at all — in every one of
  // which the completed poster is already on screen and is the finished hero.
  if (document.documentElement.dataset.heroRobot !== 'pending') return;

  const scene = document.querySelector<HTMLElement>('[data-hero-scene]');
  const stage = scene?.querySelector<HTMLElement>('[data-robot-stage]');
  if (!scene || !stage) return;

  let handle: RobotHandle | null = null;
  let requested = false;
  let settled = false;
  let patience = 0;

  const fallBack = (state: 'unavailable' | 'slow'): void => {
    if (settled) return;
    scene.dataset.robot = state;
  };

  const start = async (): Promise<void> => {
    const poster = visiblePoster(scene);
    if (!poster) return;

    patience = window.setTimeout(() => fallBack('slow'), PATIENCE_MS);
    try {
      const { mountRobot } = await import('../lib/robot/mount.js');
      handle = await mountRobot(stage, { source: poster, duration: DURATION });
      // mountRobot resolves only after a frame has actually been painted, so
      // the reveal never lands on a blank canvas.
      settled = true;
      window.clearTimeout(patience);
      scene.dataset.robot = 'ready';
      // Started here, not inside mount: the sequence should begin in front of
      // the visitor, from an empty trajectory, not partway through behind a
      // fade. Nothing loops — it runs once and stays on its final frame.
      handle.start();
    } catch (error) {
      window.clearTimeout(patience);
      console.warn('Hero robot unavailable, showing the static signature.', error);
      fallBack('unavailable');
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting) || requested) return;
      requested = true;
      observer.disconnect();
      whenIdle(() => void start());
    },
    { rootMargin: ROOT_MARGIN },
  );
  observer.observe(scene);

  document.addEventListener(
    'astro:before-swap',
    () => {
      observer.disconnect();
      window.clearTimeout(patience);
      handle?.dispose();
      handle = null;
    },
    { once: true },
  );
}
