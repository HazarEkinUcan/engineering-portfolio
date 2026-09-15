/**
 * mount.js — the scene the arm and the ink live in, scoped to one container.
 *
 * Ported from robot-arm-prototype/src/main.js. The renderer, lights, camera
 * character and lifecycle are the approved ones. What changed for production:
 *
 *   · the canvas is transparent instead of clearing to #101113, so the page's
 *     own background — paper or graphite — shows through and the hero works
 *     in both themes;
 *   · colours, exposure, environment intensity and shadow density come from
 *     the site's design tokens and follow the theme toggle;
 *   · three camera profiles replace the prototype's two review cameras;
 *   · every review-only control, the window hook and the import map are gone;
 *   · the whole thing is container-scoped and returns a disposer.
 *
 * Nothing about the robot itself changed. See model.js.
 *
 * JavaScript rather than TypeScript for the reason given in model.js; the
 * typed boundary is mount.d.ts.
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createRobot } from './model.js';
import { createInk } from './ink.js';
import { DIMENSIONS, INK_PLANE_Z } from './dimensions';
import { parseSignature } from './signature';
import { sampleSequence, solvePose } from './choreography';

/**
 * Framing per breakpoint. `halfWidth` is a minimum width in scene units; the
 * taller the container, the more of the machine comes into frame.
 *
 * The look-at x values are solved, not guessed. Sampling the choreography every
 * 20ms and projecting the joints through this camera gives the horizontal
 * extent the composition actually needs:
 *
 *   writing, left edge          screen x  -2.91
 *   elbow, furthest right       screen x  +5.58   (at t≈5.2s, finishing line 3)
 *
 * — a span of 8.49 units that has to sit inside ±halfWidth. Centring that span
 * is what the numbers below do. The earlier desktop value of 0.15 centred on
 * the writing instead, which pushed the writing a sixth of the way into the
 * frame and pushed the elbow 0.8 units off the right edge for about a second.
 *
 * Below 640px the span does not fit at a sensible scale, so the phone keeps the
 * writing whole and lets the arm run off the right edge — a machine continuing
 * past the frame, which is a composition rather than a clipping bug. It is back
 * inside the frame by the time it settles.
 */
const PROFILES = [
  { until: 640, halfWidth: 3.2, minHalfHeight: 2.15, look: [0.0, 2.6, 0] },
  { until: 1024, halfWidth: 4.1, minHalfHeight: 2.7, look: [0.75, 2.35, 0] },
  { until: Infinity, halfWidth: 4.7, minHalfHeight: 2.95, look: [1.45, 2.4, 0] },
];

/**
 * Camera position, as a fixed offset from whatever it is looking at. Panning
 * both together keeps the view DIRECTION constant, so every breakpoint sees the
 * machine from the prototype's approved angle and reframing never restyles it.
 */
const CAMERA_OFFSET = [7.1, 1.9, 20];

const THEMES = {
  dark: { exposure: 0.88, environment: 0.45, shadow: 0.25 },
  light: { exposure: 0.96, environment: 0.58, shadow: 0.16 },
};

function readTokens(element) {
  const style = getComputedStyle(element);
  const token = (name, fallback) => style.getPropertyValue(name).trim() || fallback;
  const dark = document.documentElement.dataset.theme
    ? document.documentElement.dataset.theme === 'dark'
    : matchMedia('(prefers-color-scheme: dark)').matches;
  return {
    dark,
    ink: token('--text-primary', dark ? '#eee9dd' : '#1a1a1a'),
    travel: token('--accent', '#d8aa38'),
    background: token('--bg', dark ? '#101113' : '#faf7f1'),
    ...THEMES[dark ? 'dark' : 'light'],
  };
}

/**
 * Builds the scene, renders one frame, and only then resolves — so the caller
 * never cross-fades onto an empty canvas.
 *
 * @param {HTMLElement} container
 * @param {{ source: SVGSVGElement, duration: number }} options
 * @returns {Promise<{ dispose(): void }>}
 */
export async function mountRobot(container, options) {
  const signature = parseSignature(options.source, options.duration);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.setClearAlpha(0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.append(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-6, 6, 4, -4, 0.1, 80);
  // Keep world-X writing baselines level on screen with a 1.81° roll.
  // Position, view direction and scale stay fixed; arm and ink rotate together.
  camera.up.set(0, 1, -CAMERA_OFFSET[1] / CAMERA_OFFSET[2]);

  const environment = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environmentMap = pmrem.fromScene(environment, 0.04);
  scene.environment = environmentMap.texture;
  environment.dispose();
  pmrem.dispose();

  scene.add(new THREE.HemisphereLight('#eef3ff', '#483819', 0.65));
  const key = new THREE.DirectionalLight('#fff0cf', 2.8);
  key.position.set(-3, 8, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8 });
  key.shadow.bias = -0.0003;
  key.shadow.normalBias = 0.025;
  key.shadow.radius = 3;
  scene.add(key);
  const rim = new THREE.DirectionalLight('#c9daee', 2.6);
  rim.position.set(4, 5, -4);
  scene.add(rim);
  const fill = new THREE.DirectionalLight('#ffffff', 0.55);
  fill.position.set(4, 2, 7);
  scene.add(fill);

  const shadowMaterial = new THREE.ShadowMaterial({ opacity: 0.25 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), shadowMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.04;
  floor.receiveShadow = true;
  scene.add(floor);

  const robot = createRobot();
  robot.root.position.z = INK_PLANE_Z;
  scene.add(robot.root);
  const ink = createInk(signature);
  scene.add(ink.root);

  let current = 0;
  let playing = false;
  let started = false;
  /** The caller has revealed the canvas and wants the sequence to run. */
  let armed = false;
  let frameId = 0;
  let previous = 0;
  let visible = false;
  let disposed = false;
  const cleanups = [];
  const listen = (target, name, callback) => {
    target.addEventListener(name, callback);
    cleanups.push(() => target.removeEventListener(name, callback));
  };

  function applyTheme() {
    const tokens = readTokens(container);
    renderer.toneMappingExposure = tokens.exposure;
    scene.environmentIntensity = tokens.environment;
    shadowMaterial.opacity = tokens.shadow;
    ink.theme({ ink: tokens.ink, travel: tokens.travel });
    if (!playing) draw();
  }

  function draw() {
    if (disposed) return;
    const pose = sampleSequence(current, signature);
    const angles = solvePose(pose, DIMENSIONS);
    robot.joints.shoulder.rotation.z = angles.shoulder;
    robot.joints.elbow.rotation.z = angles.elbow;
    robot.joints.wrist.rotation.z = angles.wrist;
    robot.joints.tool.rotation.x = pose.line >= 0 ? Math.sin(current * 4) * 0.025 : 0;
    ink.update(current);
    renderer.render(scene, camera);
  }

  function frame(now) {
    frameId = 0;
    if (!playing || !visible || document.hidden || disposed) return;
    // Accumulated deltas rather than wall clock, so a stall does not teleport
    // the arm through the writing. The cap only bites below about 4fps, where
    // the sequence stretches instead of skipping — the better failure.
    if (previous) {
      current = Math.min(signature.timing.duration, current + Math.min((now - previous) / 1000, 0.25));
    }
    previous = now;
    if (current >= signature.timing.duration) playing = false;
    draw();
    if (playing) frameId = requestAnimationFrame(frame);
  }

  function wake() {
    previous = 0;
    if (playing && visible && !document.hidden && !frameId && !disposed) {
      frameId = requestAnimationFrame(frame);
    }
  }

  function stop() {
    cancelAnimationFrame(frameId);
    frameId = 0;
    previous = 0;
  }

  function resize() {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    ink.resize(width, height);
    const profile = PROFILES.find((p) => width < p.until);
    const aspect = width / height;
    const halfHeight = Math.max(profile.minHalfHeight, profile.halfWidth / aspect);
    camera.left = -halfHeight * aspect;
    camera.right = halfHeight * aspect;
    camera.top = halfHeight;
    camera.bottom = -halfHeight;
    camera.position.set(
      profile.look[0] + CAMERA_OFFSET[0],
      profile.look[1] + CAMERA_OFFSET[1],
      profile.look[2] + CAMERA_OFFSET[2],
    );
    camera.lookAt(...profile.look);
    camera.updateProjectionMatrix();
    draw();
  }

  /**
   * One pass, the first time the hero is both on screen and revealed. It never
   * loops and never restarts: `started` latches, so after the sequence ends the
   * completed writing and the settled pose simply stay on screen.
   */
  function maybeStart() {
    if (!armed || !visible || started || disposed) return;
    started = true;
    playing = true;
    wake();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  const intersection = new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      if (visible) {
        maybeStart();
        wake();
      } else {
        stop();
      }
    },
    { threshold: 0.01 },
  );
  intersection.observe(container);

  listen(document, 'visibilitychange', () => (document.hidden ? stop() : wake()));
  const themeQuery = matchMedia('(prefers-color-scheme: dark)');
  listen(themeQuery, 'change', applyTheme);
  const themeObserver = new MutationObserver(applyTheme);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  listen(renderer.domElement, 'webglcontextlost', (event) => {
    event.preventDefault();
    playing = false;
    stop();
    // Hand the hero back to the static signature rather than showing a hole.
    container.dataset.robot = 'lost';
  });

  applyTheme();
  resize();
  // Guarantee a painted frame before the caller reveals the canvas.
  await new Promise((resolve) => requestAnimationFrame(resolve));
  draw();

  return {
    /**
     * Begin the sequence. Held back until the caller has faded the canvas in,
     * so the writing starts from an empty trajectory in front of the visitor
     * rather than partway through behind a fade.
     */
    start() {
      armed = true;
      maybeStart();
    },
    dispose() {
      disposed = true;
      stop();
      resizeObserver.disconnect();
      intersection.disconnect();
      themeObserver.disconnect();
      cleanups.forEach((fn) => fn());
      const geometries = new Set();
      const materials = new Set();
      scene.traverse((object) => {
        if (object.geometry) geometries.add(object.geometry);
        if (object.material) {
          for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
            materials.add(material);
          }
        }
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      environmentMap.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
