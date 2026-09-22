import * as THREE from "three";

/** A compact procedural homage to a translucent music device. */
export function createFeelItDevice({ scale = 1 } = {}) {
  const device = new THREE.Group();
  device.name = "Feel It device";
  const silver = new THREE.MeshPhysicalMaterial({
    color: 0xc8cbd1,
    metalness: 0.64,
    roughness: 0.24,
    transparent: true,
    opacity: 0.72,
    transmission: 0.12,
    thickness: 0.2,
  });
  const edge = new THREE.MeshStandardMaterial({ color: 0xf4f5f8, metalness: 0.78, roughness: 0.18 });
  const screenMat = new THREE.MeshStandardMaterial({ color: 0x071018, emissive: 0x10293a, emissiveIntensity: 0.55, metalness: 0.25, roughness: 0.35 });
  const textMat = new THREE.MeshBasicMaterial({ color: 0xa8e9ff, transparent: true, opacity: 0.9 });

  const shell = new THREE.Mesh(new THREE.BoxGeometry(0.84, 1.38, 0.16, 6, 6, 2), silver);
  shell.castShadow = true;
  device.add(shell);
  const rim = new THREE.Mesh(new THREE.BoxGeometry(0.88, 1.42, 0.08, 4, 4, 1), edge);
  rim.position.z = -0.055;
  device.add(rim);
  const screen = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.42, 0.024), screenMat);
  screen.position.set(0, 0.32, 0.11);
  device.add(screen);
  const equalizer = new THREE.Group();
  for (let i = 0; i < 5; i += 1) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.05 + (i % 3) * 0.035, 0.012), textMat);
    bar.position.set(-0.14 + i * 0.07, 0.32, 0.13);
    equalizer.add(bar);
  }
  device.add(equalizer);
  const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.235, 0.235, 0.025, 40), new THREE.MeshStandardMaterial({ color: 0xe8eaee, metalness: 0.35, roughness: 0.22 }));
  wheel.rotation.x = Math.PI / 2;
  wheel.position.set(0, -0.34, 0.11);
  device.add(wheel);
  const wheelCore = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.032, 32), edge);
  wheelCore.rotation.x = Math.PI / 2;
  wheelCore.position.z = 0.126;
  device.add(wheelCore);
  const lowerScreen = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.07, 0.017), textMat);
  lowerScreen.position.set(0, -0.68, 0.11);
  device.add(lowerScreen);

  device.scale.setScalar(scale);
  return device;
}
