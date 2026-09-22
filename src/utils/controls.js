import * as THREE from "three";

export class FirstPersonControls {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.keys = new Set();
    this.enabled = false;
    this.speed = 3.15;
    this.yaw = 0;
    this.pitch = 0;
    this.bounds = { minX: -5.2, maxX: 5.2, minZ: -5.5, maxZ: 5.6 };
    this.onKeyDown = (event) => this.keys.add(event.code);
    this.onKeyUp = (event) => this.keys.delete(event.code);
    this.onMouseMove = (event) => {
      if (!this.enabled || document.pointerLockElement !== this.domElement) return;
      this.yaw -= event.movementX * 0.002;
      this.pitch = THREE.MathUtils.clamp(this.pitch - event.movementY * 0.002, -1.25, 1.25);
      this.applyRotation();
    };
    this.onPointerChange = () => { this.locked = document.pointerLockElement === this.domElement; };
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("pointerlockchange", this.onPointerChange);
  }

  applyRotation() { this.camera.rotation.set(this.pitch, this.yaw, 0, "YXZ"); }
  lock() { if (this.enabled && document.pointerLockElement !== this.domElement) this.domElement.requestPointerLock(); }
  unlock() { if (document.pointerLockElement === this.domElement) document.exitPointerLock(); }

  update(delta) {
    if (!this.enabled || !this.locked) return;
    const forward = (this.keys.has("KeyW") ? 1 : 0) - (this.keys.has("KeyS") ? 1 : 0);
    const strafe = (this.keys.has("KeyD") ? 1 : 0) - (this.keys.has("KeyA") ? 1 : 0);
    if (!forward && !strafe) return;
    const direction = new THREE.Vector3();
    direction.x = -Math.sin(this.yaw) * forward + Math.cos(this.yaw) * strafe;
    direction.z = -Math.cos(this.yaw) * forward - Math.sin(this.yaw) * strafe;
    direction.normalize().multiplyScalar(this.speed * delta);
    this.camera.position.add(direction);
    this.camera.position.x = THREE.MathUtils.clamp(this.camera.position.x, this.bounds.minX, this.bounds.maxX);
    this.camera.position.z = THREE.MathUtils.clamp(this.camera.position.z, this.bounds.minZ, this.bounds.maxZ);
  }

  dispose() {
    this.unlock();
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("pointerlockchange", this.onPointerChange);
  }
}
