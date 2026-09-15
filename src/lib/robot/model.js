/**
 * model.js — the industrial arm, built from geometry rather than loaded.
 *
 * Ported unchanged from robot-arm-prototype/src/robot.js, which is the
 * approved reference. Proportions, materials, joint hierarchy and mechanical
 * detail are exactly as reviewed; the only edits are the DIMENSIONS import
 * and this comment. Do not simplify it to save bytes.
 *
 * Beveled extrusions form the castings; cylinders, machined collars, socket
 * fasteners, cooling fins and instanced cable ribs supply the detail. There
 * are no maker's marks, logotype or model number anywhere on it.
 *
 * This file is JavaScript, not TypeScript, on purpose: three@0.180 ships no
 * type declarations of its own, and the alternative was either a dependency
 * on @types/three that could not be installed and verified here, or a page of
 * hand-written ambient declarations. The untyped surface is confined to the
 * three files that actually touch Three.js; all the logic — timing, row
 * detection, kinematics — is strict TypeScript next door.
 */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { DIMENSIONS } from './dimensions';

/** A small, deliberately authored casting model. All dimensions are scene units. */
export function createRobot() {
  const materials = {
    yellow: new THREE.MeshPhysicalMaterial({ color: '#efad00', metalness: .3, roughness: .29, clearcoat: .4, clearcoatRoughness: .23 }),
    edge: new THREE.MeshStandardMaterial({ color: '#aa7006', metalness: .4, roughness: .36 }),
    black: new THREE.MeshStandardMaterial({ color: '#15191c', metalness: .55, roughness: .32 }),
    rubber: new THREE.MeshStandardMaterial({ color: '#080a0c', metalness: .05, roughness: .65 }),
    steel: new THREE.MeshStandardMaterial({ color: '#b3bdc4', metalness: .94, roughness: .24 }),
    bolt: new THREE.MeshStandardMaterial({ color: '#626970', metalness: .9, roughness: .3 }),
  };
  const root = new THREE.Group(); root.name = 'industrial-arm'; root.position.x = DIMENSIONS.baseX;
  const mesh = (parent, geometry, material, x = 0, y = 0, z = 0) => {
    const object = new THREE.Mesh(geometry, material); object.position.set(x, y, z);
    object.castShadow = true; object.receiveShadow = true; parent.add(object); return object;
  };
  const box = (parent, size, at, mat = materials.yellow, radius = .055) => mesh(parent, new RoundedBoxGeometry(...size, 3, radius), mat, ...at);
  const cylinder = (parent, r, depth, at, mat = materials.yellow, axis = 'z', top = r, segments = 48) => {
    const object = mesh(parent, new THREE.CylinderGeometry(top, r, depth, segments), mat, ...at);
    if (axis === 'z') object.rotation.x = Math.PI / 2;
    if (axis === 'x') object.rotation.z = Math.PI / 2;
    return object;
  };
  const ring = (parent, radius, tube, at, mat = materials.black, axis = 'z') => {
    const object = mesh(parent, new THREE.TorusGeometry(radius, tube, 8, 48), mat, ...at);
    if (axis === 'y') object.rotation.x = Math.PI / 2;
    if (axis === 'x') object.rotation.y = Math.PI / 2;
    return object;
  };
  const boltGeo = new THREE.CylinderGeometry(.031, .031, .025, 6);
  function bolt(parent, at, axis = 'z') {
    const object = mesh(parent, boltGeo, materials.bolt, ...at);
    object.rotation.x = axis === 'z' ? Math.PI / 2 : 0;
    // Dark socket gives fasteners depth even in the close camera.
    cylinder(parent, .013, .027, at, materials.rubber, axis, .013, 6);
  }
  function boltCircle(parent, radius, z, count = 8, cx = 0, cy = 0) {
    for (let i = 0; i < count; i++) {
      const a = (i + .5) * Math.PI * 2 / count;
      bolt(parent, [cx + Math.cos(a) * radius, cy + Math.sin(a) * radius, z]);
    }
  }
  function joint(parent, radius, depth, x = 0, y = 0) {
    cylinder(parent, radius, depth, [x, y, 0]);
    for (const sign of [-1, 1]) {
      cylinder(parent, radius * 1.015, .075, [x, y, sign * (depth / 2 + .02)], materials.yellow, 'z', radius * 1.015, 8);
      cylinder(parent, radius * .7, .035, [x, y, sign * (depth / 2 + .065)], materials.edge);
      cylinder(parent, radius * .67, .055, [x, y, sign * (depth / 2 + .08)], materials.black);
      ring(parent, radius * .60, .014, [x, y, sign * (depth / 2 + .11)], materials.bolt);
      cylinder(parent, radius * .50, .064, [x, y, sign * (depth / 2 + .1)], materials.black);
      boltCircle(parent, radius * .84, sign * (depth / 2 + .065), 8, x, y);
      boltCircle(parent, radius * .39, sign * (depth / 2 + .14), 4, x, y);
    }
  }
  function casting(parent, length, rootWidth, tipWidth, depth, z = 0, material = materials.yellow) {
    const s = new THREE.Shape();
    s.moveTo(0, -rootWidth);
    s.bezierCurveTo(length * .2, -rootWidth, length * .72, -tipWidth, length, -tipWidth);
    s.quadraticCurveTo(length + tipWidth, -tipWidth, length + tipWidth, 0);
    s.quadraticCurveTo(length + tipWidth, tipWidth, length, tipWidth);
    s.bezierCurveTo(length * .65, tipWidth, length * .2, rootWidth, 0, rootWidth);
    s.quadraticCurveTo(-rootWidth, rootWidth, -rootWidth, 0);
    s.quadraticCurveTo(-rootWidth, -rootWidth, 0, -rootWidth);
    const geo = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: .045, bevelThickness: .045, curveSegments: 12 });
    return mesh(parent, geo, material, 0, 0, z - depth / 2);
  }
  function cable(parent, points, radius = .048, ribbed = true) {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
    mesh(parent, new THREE.TubeGeometry(curve, 48, radius, 8, false), materials.rubber);
    if (ribbed) {
      const geometry = new THREE.TorusGeometry(radius + .005, .011, 5, 12);
      const count = Math.ceil(curve.getLength() / .067);
      const ribs = new THREE.InstancedMesh(geometry, materials.black, count);
      const dummy = new THREE.Object3D(); const axis = new THREE.Vector3(0, 0, 1);
      for (let i = 0; i < count; i++) {
        const t = i / (count - 1); dummy.position.copy(curve.getPointAt(t));
        dummy.quaternion.setFromUnitVectors(axis, curve.getTangentAt(t)); dummy.updateMatrix(); ribs.setMatrixAt(i, dummy.matrix);
      }
      ribs.castShadow = true; parent.add(ribs);
    }
  }

  // Plinth, anchor screws, base casting and J1 turntable.
  box(root, [1.6, .12, 1.22], [0, .06, 0], materials.black, .03);
  box(root, [1.36, .1, 1.02], [0, .16, 0], materials.bolt, .025);
  for (const x of [-.64, .64]) for (const z of [-.46, .46]) {
    cylinder(root, .09, .024, [x, .14, z], materials.steel, 'y'); bolt(root, [x, .17, z], 'y');
  }
  cylinder(root, .62, .39, [0, .39, 0], materials.yellow, 'y', .54);
  cylinder(root, .63, .08, [0, .23, 0], materials.edge, 'y');
  ring(root, .56, .018, [0, .59, 0], materials.rubber, 'y');
  cylinder(root, .54, .09, [0, .65, 0], materials.black, 'y');
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4;
    const rib = box(root, [.08, .28, .13], [Math.cos(a) * .54, .4, Math.sin(a) * .54], materials.yellow, .018); rib.rotation.y = -a;
  }
  const turret = new THREE.Group(); root.add(turret); turret.name = 'J1-turret';
  cylinder(turret, .51, .16, [0, .76, 0], materials.yellow, 'y');
  box(turret, [.69, .58, .69], [0, 1.0, 0], materials.yellow, .1);
  box(turret, [.33, .47, .45], [.49, .98, -.1], materials.black, .045);
  for (let i = 0; i < 7; i++) box(turret, [.34, .024, .46], [.49, .8 + i * .055, -.1], materials.bolt, .005);
  joint(turret, .49, .81, 0, DIMENSIONS.shoulderY);

  const shoulder = new THREE.Group(); shoulder.position.y = DIMENSIONS.shoulderY; shoulder.name = 'J2-shoulder'; turret.add(shoulder);
  casting(shoulder, DIMENSIONS.upper, .39, .28, .67);
  // Raised cast face and a narrower service cover, separated by a gasket.
  const cover = new THREE.Group(); cover.position.set(.43, 0, .397); shoulder.add(cover);
  casting(cover, 2.14, .208, .143, .018, 0, materials.edge);
  casting(cover, 2.11, .175, .118, .024, .025, materials.yellow);
  for (const x of [.42, 1.05, 2.18, 2.63]) for (const y of [-.18, .18]) bolt(shoulder, [x, y, .45]);
  // Structural edge ribs and broad root bosses give the upper casting weight.
  for (const z of [-.29, .29]) {
    box(shoulder, [.62, .17, .13], [.53, -.3, z], materials.yellow, .04);
    box(shoulder, [.5, .17, .13], [2.64, -.22, z], materials.yellow, .04);
  }
  box(shoulder, [.5, .38, .12], [.75, 0, -.34], materials.black, .04);
  cable(shoulder, [[.1, -.45, -.22], [.48, -.53, -.3], [1.7, -.37, -.3], [2.8, -.4, -.18], [3.2, -.17, -.04]], .062);
  for (const x of [.65, 2.2]) box(shoulder, [.095, .12, .19], [x, -.38, -.3], materials.bolt, .014);

  const elbow = new THREE.Group(); elbow.position.x = DIMENSIONS.upper; elbow.name = 'J3-elbow'; shoulder.add(elbow);
  joint(elbow, .42, .76);
  casting(elbow, DIMENSIONS.fore, .285, .16, .49);
  const foreCover = new THREE.Group(); foreCover.position.set(.48, 0, .297); elbow.add(foreCover);
  casting(foreCover, 1.9, .145, .075, .028, 0, materials.edge);
  casting(foreCover, 1.86, .117, .057, .03, .026);
  for (const x of [.44, 1.3, 2.36]) for (const y of [-.12, .12]) bolt(elbow, [x, y, .35]);
  box(elbow, [.48, .53, .53], [.4, 0, 0], materials.yellow, .095);
  box(elbow, [.36, .37, .52], [2.54, 0, 0], materials.yellow, .065);
  cylinder(elbow, .26, .48, [.42, .14, -.37], materials.black, 'x');
  for (const x of [.24, .31, .38, .45, .52, .59]) ring(elbow, .26, .014, [x, .14, -.37], materials.bolt, 'x');
  cable(elbow, [[-.1, -.2, -.4], [.23, -.46, -.31], [1.3, -.29, -.27], [2.58, -.25, -.18], [3.08, -.04, -.12]], .048);

  const wrist = new THREE.Group(); wrist.position.x = DIMENSIONS.fore; wrist.name = 'J4-wrist-roll'; elbow.add(wrist);
  joint(wrist, .225, .44);
  const tool = new THREE.Group(); wrist.add(tool); tool.name = 'J5-pitch-J6-flange';
  // Tool axis is local +X. A three-stage wrist ends in a concentric flange.
  box(tool, [.28, .32, .38], [.11, 0, 0], materials.yellow, .065);
  cylinder(tool, .18, .24, [.14, 0, 0], materials.yellow, 'x', .155);
  for (const sign of [-1, 1]) bolt(tool, [.13, .09, sign * .2]);
  cylinder(tool, .17, .075, [.295, 0, 0], materials.black, 'x');
  cylinder(tool, .15, .06, [.35, 0, 0], materials.steel, 'x');
  ring(tool, .133, .012, [.384, 0, 0], materials.black, 'x');
  box(tool, [.14, .28, .26], [.44, 0, 0], materials.black, .028);
  cylinder(tool, .09, .25, [.57, 0, 0], materials.steel, 'x');
  for (let i = 0; i < 10; i++) ring(tool, .087, .011, [.49 + i * .019, 0, 0], materials.black, 'x');
  cylinder(tool, .07, .2, [.78, 0, 0], materials.black, 'x', .059);
  cylinder(tool, .055, .16, [.94, 0, 0], materials.steel, 'x', .02);
  cylinder(tool, .024, .08, [1.06, 0, 0], materials.black, 'x', .001);
  const tip = new THREE.Object3D(); tip.position.x = DIMENSIONS.tool; tip.name = 'tool-tip'; tool.add(tip);
  cable(turret, [[.46, .4, -.32], [.69, .75, -.37], [.61, 1.36, -.4], [.1, 1.59, -.36]], .052);

  // Bake static parts within each joint by material. Joint transforms and the
  // instanced cable ribs stay independent; hundreds of fasteners cost no extra draws.
  const originals = new Set();
  root.traverse(parent => {
    if (!parent.isGroup) return;
    const batches = new Map();
    for (const child of [...parent.children]) {
      if (!child.isMesh || child.isInstancedMesh) continue;
      child.updateMatrix();
      const geometry = child.geometry.index ? child.geometry.toNonIndexed() : child.geometry.clone();
      geometry.applyMatrix4(child.matrix);
      if (!batches.has(child.material)) batches.set(child.material, []);
      batches.get(child.material).push(geometry); originals.add(child.geometry); parent.remove(child);
    }
    for (const [material, geometries] of batches) {
      const geometry = mergeGeometries(geometries); geometries.forEach(g => g.dispose());
      if (geometry) mesh(parent, geometry, material);
    }
  });
  originals.forEach(geometry => geometry.dispose());
  return { root, joints: { turret, shoulder, elbow, wrist, tool }, tip, materials };
}
