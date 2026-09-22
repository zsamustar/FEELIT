import * as THREE from "three";
import { state } from "../state.js";
import { createFeelItDevice } from "../objects/FeelItDevice.js";
import { createVendedorNPC } from "../objects/VendedorNPC.js";
import { FirstPersonControls } from "../utils/controls.js";
import { InstructivoScene } from "./InstructivoScene.js";

function createShelf(x, z, rotation = 0) {
  const shelf = new THREE.Group();
  const frame = new THREE.MeshStandardMaterial({ color: 0x9da3ae, metalness: 0.68, roughness: 0.26 });
  const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x4e5664, metalness: 0.22, roughness: 0.48 });
  for (let y = 0; y < 3; y += 1) {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.055, 0.33), frame);
    plank.position.y = 0.43 + y * 0.66;
    shelf.add(plank);
    for (let i = 0; i < 3; i += 1) {
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.38, 0.23), boxMaterial);
      box.position.set(-0.55 + i * 0.55, 0.65 + y * 0.66, 0);
      box.material = boxMaterial.clone();
      box.material.color.offsetHSL((i + y) * 0.025, 0.02, 0.05);
      shelf.add(box);
    }
  }
  shelf.position.set(x, 0, z); shelf.rotation.y = rotation;
  return shelf;
}

export class TiendaScene {
  constructor(manager) {
    this.manager = manager;
    this.scene = new THREE.Scene();
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.onCanvasClick = (event) => this.handleClick(event);
  }

  enter() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x191d25);
    this.scene.fog = new THREE.Fog(0x191d25, 10, 22);
    const { camera } = this.manager;
    camera.fov = 67; camera.near = 0.05; camera.far = 100;
    camera.position.set(0, 1.66, 5.15); camera.rotation.set(0, 0, 0, "YXZ"); camera.updateProjectionMatrix();
    this.controls = new FirstPersonControls(camera, this.manager.renderer.domElement);
    this.controls.enabled = true;
    this.controls.yaw = 0; this.controls.pitch = 0;

    const ambient = new THREE.HemisphereLight(0xdce7ff, 0x222126, 1.8);
    this.scene.add(ambient);
    const key = new THREE.DirectionalLight(0xfff2d6, 2.5);
    key.position.set(-3, 7, 3); key.castShadow = true; this.scene.add(key);
    const counterLight = new THREE.PointLight(0xbddaff, 23, 8, 2);
    counterLight.position.set(0, 2.8, -2.2); this.scene.add(counterLight);
    this.accent = new THREE.PointLight(0x9caeff, 0.8, 5, 2);
    this.accent.position.set(-3, 1.6, 1.5); this.scene.add(this.accent);

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), new THREE.MeshStandardMaterial({ color: 0x747b87, metalness: 0.6, roughness: 0.36 }));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; this.scene.add(floor);
    const back = new THREE.Mesh(new THREE.BoxGeometry(12, 5.2, 0.25), new THREE.MeshStandardMaterial({ color: 0x363d49, metalness: 0.35, roughness: 0.41 }));
    back.position.set(0, 2.55, -5.45); this.scene.add(back);
    const ceilingStrip = new THREE.Mesh(new THREE.BoxGeometry(7, 0.07, 0.34), new THREE.MeshBasicMaterial({ color: 0xdce7ff }));
    ceilingStrip.position.set(0, 4.45, -0.7); this.scene.add(ceilingStrip);

    const counter = new THREE.Group();
    const counterMat = new THREE.MeshStandardMaterial({ color: 0xc7cad0, metalness: 0.8, roughness: 0.2 });
    const base = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.15, 0.74), counterMat);
    base.position.y = 0.57; counter.add(base);
    const top = new THREE.Mesh(new THREE.BoxGeometry(3.94, 0.15, 0.94), new THREE.MeshStandardMaterial({ color: 0xf3f4f5, metalness: 0.78, roughness: 0.14 }));
    top.position.y = 1.2; counter.add(top);
    const frontGlow = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.04, 0.02), new THREE.MeshBasicMaterial({ color: 0xb9e6ff }));
    frontGlow.position.set(0, 0.65, 0.39); counter.add(frontGlow);
    counter.position.set(0, 0, -2.7); this.scene.add(counter);

    this.vendor = createVendedorNPC(); this.vendor.position.set(0, 1.23, -3.52); this.scene.add(this.vendor);
    this.scene.add(createShelf(-4.25, -1.55, Math.PI / 2), createShelf(4.25, -1.55, -Math.PI / 2), createShelf(-2.1, -5.07), createShelf(2.1, -5.07));
    const brand = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.42, 0.035), new THREE.MeshBasicMaterial({ color: 0xdfe3ec }));
    brand.position.set(0, 3.48, -5.29); this.scene.add(brand);

    this.setupHud();
    this.manager.renderer.domElement.addEventListener("click", this.onCanvasClick);
    this.purchased = false;
    this.purchaseProgress = 0;
    this.readyForManual = false;
  }

  setupHud() {
    this.manager.uiRoot.innerHTML = `
      <div class="hud">
        <div class="wordmark">FEEL IT · CONCEPT STORE</div>
        <div class="crosshair"></div>
        <div class="hud-bottom">
          <div class="hint" data-store-hint><strong>W A S D</strong> para moverte · mira con el mouse · acércate al vendedor</div>
          <button class="manual-button" type="button" data-manual-button><span class="manual-icon"></span>Ver instructivo</button>
        </div>
      </div>`;
    this.hint = this.manager.uiRoot.querySelector("[data-store-hint]");
    this.manualButton = this.manager.uiRoot.querySelector("[data-manual-button]");
    this.manualButton.addEventListener("click", () => this.openManual());
  }

  handleClick(event) {
    if (this.purchased) return;
    if (document.pointerLockElement !== this.manager.renderer.domElement) {
      this.controls.lock();
      return;
    }
    this.pointer.set(0, 0);
    this.raycaster.setFromCamera(this.pointer, this.manager.camera);
    const hits = this.raycaster.intersectObjects(this.vendor.userData.interactionMeshes, false);
    const distance = this.manager.camera.position.distanceTo(this.vendor.position);
    if (hits.length && distance < 5.3) this.purchase();
    else if (distance < 4.15) this.hint.innerHTML = "Apunta al <strong>vendedor</strong> y haz click para recibir tu dispositivo";
  }

  purchase() {
    this.purchased = true; state.purchased = true;
    this.controls.enabled = false; this.controls.unlock();
    this.hint.textContent = "Calibrando Feel It…";
    this.device = createFeelItDevice({ scale: 0.58 });
    this.device.position.set(0.72, -0.65, -1.18);
    this.device.rotation.set(-0.42, -0.55, -0.08);
    this.device.scale.setScalar(0.01);
    this.manager.camera.add(this.device);
    this.scene.add(this.manager.camera);
    this.purchaseProgress = 0.001;
  }

  openManual() {
    if (!this.purchased || this.manual) return;
    this.manual = new InstructivoScene(this.manager);
    this.manual.open();
  }

  update(delta, elapsed) {
    this.controls?.update(delta);
    this.accent.intensity = 0.65 + Math.sin(elapsed * 1.4) * 0.26;
    if (!this.purchased || !this.device) return;
    this.purchaseProgress = Math.min(1, this.purchaseProgress + delta * 1.2);
    const smooth = THREE.MathUtils.smootherstep(this.purchaseProgress, 0, 1);
    this.device.scale.setScalar(0.58 * smooth);
    this.device.rotation.y = -0.55 + Math.sin(elapsed * 4) * (1 - smooth) * 0.35;
    if (this.purchaseProgress >= 1 && !this.readyForManual) {
      this.readyForManual = true;
      this.hint.textContent = "Tu dispositivo está listo";
      this.manualButton.classList.add("visible");
    }
  }

  exit() {
    this.manual?.dispose(); this.manual = null;
    this.manager.renderer.domElement.removeEventListener("click", this.onCanvasClick);
    this.controls?.dispose(); this.controls = null;
    this.manager.camera.remove(this.device);
    this.scene.remove(this.manager.camera);
    this.device = null;
  }
}
