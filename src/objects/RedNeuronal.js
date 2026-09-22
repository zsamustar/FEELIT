import * as THREE from "three";

function pseudoRandom(seed) {
  const value = Math.sin(seed * 1643.91) * 45871.77;
  return value - Math.floor(value);
}

export class RedNeuronal {
  constructor() {
    this.group = new THREE.Group();
    this.nodes = [];
    this.connections = [];
    this.neutral = new THREE.Color(0x48505d);
    this.emotion = new THREE.Color(0xffd34d);
    const locations = [];
    for (let i = 0; i < 68; i += 1) {
      const angle = pseudoRandom(i) * Math.PI * 2;
      const radius = Math.pow(pseudoRandom(i + 30), 0.65) * 3.0;
      locations.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.67,
        (pseudoRandom(i + 80) - 0.5) * 2.5,
      ));
    }
    locations.forEach((position, index) => {
      const material = new THREE.MeshStandardMaterial({ color: this.neutral, emissive: this.neutral, emissiveIntensity: 0.25, roughness: 0.3, metalness: 0.25 });
      const node = new THREE.Mesh(new THREE.SphereGeometry(0.045 + pseudoRandom(index + 50) * 0.052, 12, 10), material);
      node.position.copy(position);
      this.group.add(node);
      this.nodes.push({ node, position, radius: position.length() });
    });
    for (let a = 0; a < locations.length; a += 1) {
      let links = 0;
      for (let b = a + 1; b < locations.length && links < 3; b += 1) {
        const distance = locations[a].distanceTo(locations[b]);
        if (distance > 1.38) continue;
        const geometry = new THREE.BufferGeometry().setFromPoints([locations[a], locations[b]]);
        const material = new THREE.LineBasicMaterial({ color: this.neutral, transparent: true, opacity: 0.44 });
        const line = new THREE.Line(geometry, material);
        this.group.add(line);
        this.connections.push({ line, midpoint: locations[a].clone().add(locations[b]).multiplyScalar(0.5).length() });
        links += 1;
      }
    }
  }

  setProgress(progress, color) {
    this.emotion.setHex(color);
    const frontier = 0.26 + (progress / 100) * 3.3;
    this.nodes.forEach(({ node, radius }) => {
      const amount = THREE.MathUtils.smoothstep(frontier - 0.76, frontier + 0.05, radius);
      node.material.color.copy(this.neutral).lerp(this.emotion, amount);
      node.material.emissive.copy(this.neutral).lerp(this.emotion, amount);
      node.material.emissiveIntensity = 0.18 + amount * 1.7;
      node.scale.setScalar(0.9 + amount * 0.45);
    });
    this.connections.forEach(({ line, midpoint }) => {
      const amount = THREE.MathUtils.smoothstep(frontier - 0.88, frontier, midpoint);
      line.material.color.copy(this.neutral).lerp(this.emotion, amount);
      line.material.opacity = 0.26 + amount * 0.69;
    });
  }

  update(elapsed) {
    this.group.rotation.y = Math.sin(elapsed * 0.17) * 0.13;
    this.group.rotation.x = Math.cos(elapsed * 0.13) * 0.05;
  }
}

export function createInternalParticles() {
  const count = 420;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (pseudoRandom(i + 200) - 0.5) * 12;
    positions[i * 3 + 1] = (pseudoRandom(i + 500) - 0.5) * 8;
    positions[i * 3 + 2] = (pseudoRandom(i + 700) - 0.5) * 7;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0x8392a8, size: 0.025, transparent: true, opacity: 0.55, sizeAttenuation: true });
  return new THREE.Points(geometry, material);
}
