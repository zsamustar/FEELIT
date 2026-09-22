import * as THREE from "three";

export function createVendedorNPC() {
  const npc = new THREE.Group();
  npc.name = "Vendedor Feel It";
  const coat = new THREE.MeshStandardMaterial({ color: 0xb5bac4, metalness: 0.52, roughness: 0.33 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x2f3541, metalness: 0.28, roughness: 0.45 });
  const skin = new THREE.MeshStandardMaterial({ color: 0xd6b6a1, roughness: 0.67 });
  const lit = new THREE.MeshStandardMaterial({ color: 0xe7ecf4, emissive: 0x223242, emissiveIntensity: 0.2, metalness: 0.3, roughness: 0.28 });
  const parts = [];
  const add = (mesh) => { npc.add(mesh); parts.push(mesh); return mesh; };

  const torso = add(new THREE.Mesh(new THREE.CapsuleGeometry(0.38, 0.68, 6, 16), coat));
  torso.position.y = 1.12;
  const neck = add(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.11, 0.16, 16), skin));
  neck.position.y = 1.62;
  const head = add(new THREE.Mesh(new THREE.SphereGeometry(0.25, 24, 18), skin));
  head.position.y = 1.86;
  const hair = add(new THREE.Mesh(new THREE.SphereGeometry(0.258, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.52), dark));
  hair.position.set(0, 1.95, 0.01);
  const leftArm = add(new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.52, 5, 10), coat));
  leftArm.position.set(-0.45, 1.08, 0.02); leftArm.rotation.z = 0.25;
  const rightArm = add(new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.52, 5, 10), coat));
  rightArm.position.set(0.45, 1.08, 0.02); rightArm.rotation.z = -0.25;
  const badge = add(new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.03), lit));
  badge.position.set(-0.14, 1.36, 0.31);
  parts.forEach((part) => { part.castShadow = true; part.receiveShadow = true; part.userData.interactable = "vendor"; });
  npc.userData.interactionMeshes = parts;
  return npc;
}
