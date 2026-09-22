import * as THREE from "three";
import { FadeTransition } from "./utils/transitions.js";

export class SceneManager {
  constructor({ renderer, camera, uiRoot, fadeElement }) {
    this.renderer = renderer;
    this.camera = camera;
    this.uiRoot = uiRoot;
    this.fade = new FadeTransition(fadeElement);
    this.scenes = new Map();
    this.current = null;
    this.transitioning = false;
    this.emptyScene = new THREE.Scene();
    this.emptyScene.background = new THREE.Color(0x050609);
  }

  register(name, scene) { this.scenes.set(name, scene); }

  async go(name, { effect = "" } = {}) {
    if (this.transitioning || !this.scenes.has(name)) return;
    this.transitioning = true;
    await this.fade.toBlack(effect);
    if (this.current) this.current.exit?.();
    this.uiRoot.replaceChildren();
    this.current = this.scenes.get(name);
    this.current.enter?.();
    await this.fade.fromBlack();
    this.transitioning = false;
  }

  update(delta, elapsed) { this.current?.update?.(delta, elapsed); }
  get renderScene() { return this.current?.scene || this.emptyScene; }
}
