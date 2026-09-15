/**
 * ink.js — the signature, drawn in the same scene as the arm.
 *
 * Ported from robot-arm-prototype/src/trajectory.js. The parsing, row
 * detection, densification and timetable now live in signature.ts, where they
 * can be type-checked; what is left here is the part that needs Three.js.
 *
 * The ink is scene geometry, not DOM SVG. That is the point: arm and ink share
 * one renderer, one camera and one clock, so they cannot drift apart, and the
 * pen tip meets the line it is drawing in the same space rather than in two
 * spaces that happen to be lined up.
 *
 * Solid lines are pen-down DRAW moves; the faint dashed lines are pen-up
 * TRAVEL, the same distinction the generator writes into the .LS program.
 * Both render above the machine so the mark stays the most legible thing on
 * the page, which is a deliberate cheat — a real pen would be occluded.
 *
 * JavaScript rather than TypeScript for the reason given in model.js.
 */
import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { clamp } from './choreography';

/**
 * @param {import('./signature').Signature} signature
 */
export function createInk(signature) {
  const root = new THREE.Group();
  root.name = 'signature-ink';

  const drawMaterial = new LineMaterial({
    color: '#eee9dd',
    linewidth: 1.65,
    depthTest: false,
    depthWrite: false,
    transparent: true,
    opacity: 0.93,
  });
  const travelMaterial = new THREE.LineDashedMaterial({
    color: '#d8aa38',
    dashSize: 0.026,
    gapSize: 0.045,
    transparent: true,
    opacity: 0.23,
    depthTest: false,
    depthWrite: false,
  });

  const strokes = signature.strokes.map((stroke) => {
    const geometry = new LineGeometry();
    geometry.setPositions(stroke.positions);
    const mesh = new Line2(geometry, drawMaterial);
    mesh.renderOrder = 10;
    mesh.frustumCulled = false;
    root.add(mesh);
    return { mesh, a: stroke.a, b: stroke.b, segments: stroke.segments };
  });

  const travels = signature.travels.map((travel) => {
    const points = [];
    for (let i = 0; i < travel.positions.length; i += 3) {
      points.push(new THREE.Vector3(travel.positions[i], travel.positions[i + 1], travel.positions[i + 2]));
    }
    const mesh = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), travelMaterial);
    mesh.computeLineDistances();
    mesh.renderOrder = 9;
    root.add(mesh);
    return { mesh, at: travel.at };
  });

  return {
    root,
    /** Line2 needs pixel dimensions to keep a constant screen-space width. */
    resize(width, height) {
      drawMaterial.resolution.set(width, height);
    },
    /** @param {{ ink: string, travel: string }} colors */
    theme(colors) {
      drawMaterial.color.set(colors.ink);
      travelMaterial.color.set(colors.travel);
    },
    update(time) {
      for (const stroke of strokes) {
        const p = clamp((time - stroke.a) / (stroke.b - stroke.a));
        stroke.mesh.visible = p > 0;
        stroke.mesh.geometry.instanceCount = Math.ceil(stroke.segments * p);
      }
      for (const travel of travels) travel.mesh.visible = time >= travel.at;
    },
  };
}
