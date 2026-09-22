import * as THREE from "three";

export function createCaramelo(color) {
  const candy = new THREE.Group();
  candy.name = "Caramelo musical";
  const material = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.45, metalness: 0.1, roughness: 0.27 });
  const translucent = new THREE.MeshPhysicalMaterial({ color, emissive: color, emissiveIntensity: 0.75, roughness: 0.16, transmission: 0.16, transparent: true, opacity: 0.88 });
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 14), material);
  head.position.set(-0.12, -0.19, 0);
  candy.add(head);
  const stem = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.47, 0.1), translucent);
  stem.position.set(0.04, 0.03, 0);
  candy.add(stem);
  const beam = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.075, 0.1), material);
  beam.position.set(0.19, 0.26, 0);
  candy.add(beam);
  const secondStem = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.26, 0.1), translucent);
  secondStem.position.set(0.35, 0.13, 0);
  candy.add(secondStem);
  const secondHead = new THREE.Mesh(new THREE.SphereGeometry(0.12, 20, 14), material);
  secondHead.position.set(0.25, -0.02, 0);
  candy.add(secondHead);
  const glow = new THREE.PointLight(color, 2.1, 2.2, 2);
  glow.position.set(0.08, 0.04, 0.24);
  candy.add(glow);
  candy.traverse((child) => { if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; } });
  return candy;
}
