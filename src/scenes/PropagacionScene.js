import * as THREE from "three";
import { selectedEmotion } from "../state.js";

function cylinderBetween(start, end, material, radius = 0.028) {
  const direction = new THREE.Vector3().subVectors(end, start);
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, direction.length(), 8), material);
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  return mesh;
}

function createBodyWithNerves(emotionColor) {
  const group = new THREE.Group();
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x2d3542, emissive: 0x151a21, emissiveIntensity: 0.25, transparent: true, opacity: 0.76, roughness: 0.46, metalness: 0.24 });
  const bodyParts = [];
  const addPart = (geometry, position, scale = null) => { const mesh = new THREE.Mesh(geometry, bodyMaterial); mesh.position.copy(position); if (scale) mesh.scale.copy(scale); group.add(mesh); bodyParts.push(mesh); };
  addPart(new THREE.SphereGeometry(0.44, 28, 20), new THREE.Vector3(0, 2.28, 0), new THREE.Vector3(0.9, 1.08, 0.86));
  addPart(new THREE.CapsuleGeometry(0.6, 1.45, 8, 18), new THREE.Vector3(0, 0.94, 0));
  addPart(new THREE.SphereGeometry(0.59, 24, 16), new THREE.Vector3(0, -0.02, 0), new THREE.Vector3(1.0, 0.56, 0.76));
  const limb = (x, y, length, rotate = 0) => { const part = new THREE.Mesh(new THREE.CapsuleGeometry(0.19, length, 6, 14), bodyMaterial); part.position.set(x, y, 0); part.rotation.z = rotate; group.add(part); bodyParts.push(part); };
  limb(-0.86, 1.1, 1.12, 0.29); limb(0.86, 1.1, 1.12, -0.29); limb(-0.35, -1.25, 1.45, 0.02); limb(0.35, -1.25, 1.45, -0.02);

  const nerves = new THREE.Group(); const nerveItems = [];
  const neutral = new THREE.Color(0x768291); const color = new THREE.Color(emotionColor);
  const points = [new THREE.Vector3(0, 2.23, 0.03), new THREE.Vector3(0, 1.76, 0.06), new THREE.Vector3(0, 1.24, 0.07), new THREE.Vector3(0, 0.66, 0.08), new THREE.Vector3(0, 0.06, 0.07), new THREE.Vector3(0, -0.55, 0.06), new THREE.Vector3(0, -1.16, 0.05), new THREE.Vector3(0, -1.8, 0.04)];
  const branchPairs = [];
  for (let i = 0; i < points.length - 1; i += 1) branchPairs.push([points[i], points[i + 1], i / 7]);
  const branches = [
    [points[2], new THREE.Vector3(-0.48, 1.23, 0.08), .26], [new THREE.Vector3(-0.48, 1.23, 0.08), new THREE.Vector3(-1.05, .83, 0.05), .4], [new THREE.Vector3(-1.05, .83, .05), new THREE.Vector3(-1.21, .23, .04), .54],
    [points[2], new THREE.Vector3(.48, 1.23, .08), .26], [new THREE.Vector3(.48, 1.23, .08), new THREE.Vector3(1.05, .83, .05), .4], [new THREE.Vector3(1.05, .83, .05), new THREE.Vector3(1.21, .23, .04), .54],
    [points[5], new THREE.Vector3(-.3, -.92, .06), .67], [new THREE.Vector3(-.3, -.92, .06), new THREE.Vector3(-.42, -1.78, .04), .82], [new THREE.Vector3(-.42, -1.78, .04), new THREE.Vector3(-.45, -2.15, .04), .96],
    [points[5], new THREE.Vector3(.3, -.92, .06), .67], [new THREE.Vector3(.3, -.92, .06), new THREE.Vector3(.42, -1.78, .04), .82], [new THREE.Vector3(.42, -1.78, .04), new THREE.Vector3(.45, -2.15, .04), .96],
  ];
  branchPairs.concat(branches).forEach(([a, b, depth]) => {
    const material = new THREE.MeshStandardMaterial({ color: neutral, emissive: neutral, emissiveIntensity: .28, roughness: .25, metalness: .16 });
    const nerve = cylinderBetween(a, b, material, depth < .2 ? .042 : .025); nerves.add(nerve); nerveItems.push({ nerve, depth });
  });
  points.forEach((point, index) => { const material = new THREE.MeshStandardMaterial({ color: neutral, emissive: neutral, emissiveIntensity: .4 }); const node = new THREE.Mesh(new THREE.SphereGeometry(index < 3 ? .065 : .04, 12, 10), material); node.position.copy(point); nerves.add(node); nerveItems.push({ nerve: node, depth: index / 8 }); });
  group.add(nerves);
  return { group, nerveItems, bodyParts, neutral, color, bodyMaterial };
}

export class PropagacionScene {
  constructor(manager) { this.manager = manager; }

  enter() {
    this.scene = new THREE.Scene(); this.scene.background = new THREE.Color(0x090b10);
    this.emotion = selectedEmotion();
    const { camera } = this.manager;
    camera.fov = 52; camera.near = .05; camera.far = 40; camera.position.set(0, .15, 7.8); camera.lookAt(0, .15, 0); camera.updateProjectionMatrix();
    this.scene.add(new THREE.HemisphereLight(0xbfd5ff, 0x0d1018, 1.55));
    const fill = new THREE.PointLight(0xd8e8ff, 1.7, 15); fill.position.set(-2.5, 3, 3); this.scene.add(fill);
    const pulse = new THREE.PointLight(this.emotion.color, 3.6, 9, 2); pulse.position.set(0, .2, 2); this.scene.add(pulse); this.pulse = pulse;
    const floor = new THREE.Mesh(new THREE.CircleGeometry(3.3, 64), new THREE.MeshBasicMaterial({ color: 0x253040, transparent: true, opacity: .35 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -2.3; this.scene.add(floor);
    const body = createBodyWithNerves(this.emotion.color); Object.assign(this, body); this.scene.add(this.group);
    this.elapsed = 0;
    this.manager.uiRoot.innerHTML = `<div class="hud"><div class="wordmark">FEEL IT · PROPAGACIÓN</div><div class="hud-bottom"><div class="hint">Observa cómo la emoción se extiende por tu sistema nervioso</div></div></div>`;
  }

  update(delta, elapsed) {
    this.elapsed += delta;
    const progress = THREE.MathUtils.clamp((this.elapsed - .55) / 6.5, 0, 1);
    this.nerveItems.forEach(({ nerve, depth }) => {
      const amount = THREE.MathUtils.smoothstep(depth - .18, depth + .1, progress);
      nerve.material.color.copy(this.neutral).lerp(this.color, amount);
      nerve.material.emissive.copy(this.neutral).lerp(this.color, amount);
      nerve.material.emissiveIntensity = .25 + amount * 2.0;
      nerve.scale.setScalar(1 + amount * .16);
    });
    this.bodyMaterial.emissive.copy(this.color); this.bodyMaterial.emissiveIntensity = .12 + progress * .33;
    this.pulse.intensity = 2.6 + Math.sin(elapsed * 4.2) * .62 + progress * 1.4;
    this.group.rotation.y = Math.sin(elapsed * .32) * .1;
    if (this.elapsed > 8.1 && !this.changing) { this.changing = true; this.manager.go("final"); }
  }
  exit() {}
}
