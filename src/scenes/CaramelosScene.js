import * as THREE from "three";
import { selectedEmotion } from "../state.js";
import { createFeelItDevice } from "../objects/FeelItDevice.js";
import { createCaramelo } from "../objects/Caramelo.js";

function createHand() {
  const hand = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: 0xcf9b80, roughness: 0.72, metalness: 0.02 });
  const palm = new THREE.Mesh(new THREE.SphereGeometry(0.37, 22, 16), material);
  palm.scale.set(1.05, 0.46, 0.38); palm.rotation.z = -0.25; hand.add(palm);
  for (let i = 0; i < 4; i += 1) {
    const finger = new THREE.Mesh(new THREE.CapsuleGeometry(0.058, 0.23, 4, 12), material);
    finger.position.set(-0.19 + i * 0.115, 0.17 + Math.abs(i - 1.5) * 0.015, -0.02);
    finger.rotation.z = -0.25 + (i - 1.5) * 0.09;
    hand.add(finger);
  }
  const thumb = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.2, 4, 12), material);
  thumb.position.set(-0.29, -0.1, 0.03); thumb.rotation.z = 0.85; hand.add(thumb);
  return hand;
}

export class CaramelosScene {
  constructor(manager) {
    this.manager = manager;
    this.onKeyDown = (event) => { if (event.code === "KeyE") this.eat(); };
  }

  enter() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x080b10);
    this.scene.fog = new THREE.Fog(0x080b10, 3.5, 11);
    const { camera } = this.manager;
    camera.fov = 64; camera.near = 0.03; camera.far = 50; camera.position.set(0, 0, 0); camera.rotation.set(0, 0, 0); camera.updateProjectionMatrix();
    this.scene.add(camera);
    this.rig = new THREE.Group(); camera.add(this.rig);
    this.emotion = selectedEmotion();
    this.scene.add(new THREE.HemisphereLight(0xdbe8ff, 0x11131a, 1.5));
    const warm = new THREE.PointLight(this.emotion.color, 2.6, 6, 2); warm.position.set(0, 1.2, 0.8); this.scene.add(warm);
    const rim = new THREE.PointLight(0x8aa6db, 2, 7, 2); rim.position.set(-3, 1.5, -1); this.scene.add(rim);
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(16, 10), new THREE.MeshStandardMaterial({ color: 0x111620, metalness: 0.45, roughness: 0.55 }));
    panel.position.z = -4.5; this.scene.add(panel);
    const halo = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.006, 8, 80), new THREE.MeshBasicMaterial({ color: this.emotion.color, transparent: true, opacity: 0.36 }));
    halo.position.set(0.35, 0.23, -2.9); this.scene.add(halo); this.halo = halo;

    this.device = createFeelItDevice({ scale: 0.72 });
    this.device.position.set(0.52, -0.44, -1.38); this.device.rotation.set(-0.28, -0.45, -0.08); this.rig.add(this.device);
    this.hand = createHand(); this.hand.position.set(-0.27, -0.72, -1.08); this.hand.rotation.set(0.05, 0.12, -0.14); this.rig.add(this.hand);
    this.candy = createCaramelo(this.emotion.color); this.candy.position.set(0.99, -0.31, -1.22); this.candy.rotation.set(0.05, -0.36, 0.12); this.rig.add(this.candy);
    this.candyStart = this.candy.position.clone(); this.candyEnd = new THREE.Vector3(-0.18, -0.48, -0.88);
    this.elapsed = 0; this.ready = false; this.eating = false;
    this.manager.uiRoot.innerHTML = `<div class="hud"><div class="wordmark">FEEL IT · SÍNTESIS ACTIVA</div><div class="hud-bottom"><div class="hint" data-candy-hint>Generando caramelo emocional…</div></div></div>`;
    this.hint = this.manager.uiRoot.querySelector("[data-candy-hint]");
    window.addEventListener("keydown", this.onKeyDown);
  }

  eat() {
    if (!this.ready || this.eating) return;
    this.eating = true; this.eatElapsed = 0;
    this.hint.textContent = "Sintiendo la emoción…";
  }

  update(delta, elapsed) {
    this.elapsed += delta;
    this.halo.rotation.z += delta * 0.14;
    this.halo.scale.setScalar(1 + Math.sin(elapsed * 1.6) * 0.035);
    if (!this.ready) {
      const progress = THREE.MathUtils.smootherstep(Math.min(1, this.elapsed / 2.1), 0, 1);
      this.candy.position.lerpVectors(this.candyStart, this.candyEnd, progress);
      this.candy.rotation.y += delta * 1.6;
      this.candy.position.y += Math.sin(elapsed * 5) * 0.003;
      if (this.elapsed >= 2.1) { this.ready = true; this.hint.innerHTML = "Presiona <strong>E</strong> para comer"; }
      return;
    }
    if (!this.eating) {
      this.candy.rotation.y += delta * 0.6;
      this.candy.position.y = this.candyEnd.y + Math.sin(elapsed * 3.2) * 0.012;
      return;
    }
    this.eatElapsed += delta;
    const progress = THREE.MathUtils.smootherstep(Math.min(1, this.eatElapsed / 0.82), 0, 1);
    this.candy.position.lerpVectors(this.candyEnd, new THREE.Vector3(0.02, -0.05, -0.12), progress);
    this.candy.scale.setScalar(1 - progress * 0.65);
    this.device.position.y = -0.44 - progress * 0.25;
    if (this.eatElapsed > 1.02 && !this.changing) { this.changing = true; this.manager.go("neural", { effect: "zoom" }); }
  }

  exit() {
    window.removeEventListener("keydown", this.onKeyDown);
    this.manager.camera.remove(this.rig); this.scene.remove(this.manager.camera);
  }
}
