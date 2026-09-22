import * as THREE from "three";
import { state, selectedEmotion } from "../state.js";
import { RedNeuronal, createInternalParticles } from "../objects/RedNeuronal.js";

export class MinijuegoNeuronalScene {
  constructor(manager) {
    this.manager = manager;
    this.onKeyDown = (event) => {
      if (event.code !== "Space") return;
      event.preventDefault();
      this.inputProgress = Math.min(100, this.inputProgress + 8.5);
      this.pulses += 1;
    };
  }

  enter() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x05070b);
    this.emotion = selectedEmotion();
    const { camera } = this.manager;
    camera.fov = 58; camera.near = 0.05; camera.far = 60; camera.position.set(0, 0, 7.2); camera.lookAt(0, 0, 0); camera.updateProjectionMatrix();
    this.scene.add(new THREE.AmbientLight(0x7388a8, 0.65));
    const coreLight = new THREE.PointLight(this.emotion.color, 4.8, 12, 2); coreLight.position.set(0, 0, 2); this.scene.add(coreLight);
    const backLight = new THREE.PointLight(0x5b7597, 2.2, 16, 2); backLight.position.set(-3, 2, -2); this.scene.add(backLight);
    this.network = new RedNeuronal(); this.network.setProgress(0, this.emotion.color); this.scene.add(this.network.group);
    this.particles = createInternalParticles(); this.scene.add(this.particles);
    this.elapsed = 0; this.progress = 0; this.inputProgress = 0; this.pulses = 0; this.complete = false;
    this.manager.uiRoot.innerHTML = `<section class="neural-ui" style="--emotion:${this.emotion.css}"><p><b>MASTICA</b> · presiona ESPACIO repetidamente</p><div class="meter"><i data-meter></i></div><p data-neural-label>La emoción empieza a recorrer tu sistema.</p></section>`;
    this.meter = this.manager.uiRoot.querySelector("[data-meter]");
    this.label = this.manager.uiRoot.querySelector("[data-neural-label]");
    window.addEventListener("keydown", this.onKeyDown, { passive: false });
    this.startAudio();
  }

  startAudio() {
    const canReuse = state.audioPlayer && state.audioEmotion === state.emocionElegida;
    this.audio = canReuse ? state.audioPlayer : new Audio(this.emotion.audio);
    this.audio.volume = 0.72;
    this.audio.currentTime = 0;
    this.audio.play().catch(() => { /* Audio is optional while files are being added. */ });
  }

  update(delta, elapsed) {
    this.elapsed += delta;
    const gentleMomentum = Math.min(42, this.elapsed * 4.2);
    if (this.elapsed > 9.55) this.inputProgress = Math.max(this.inputProgress, ((this.elapsed - 9.55) / 0.45) * 100);
    this.progress = Math.min(100, Math.max(gentleMomentum, this.inputProgress));
    this.network.setProgress(this.progress, this.emotion.color); this.network.update(elapsed);
    this.particles.rotation.y = elapsed * 0.028; this.particles.rotation.z = Math.sin(elapsed * 0.15) * 0.05;
    this.meter.style.width = `${this.progress}%`;
    if (this.progress > 72) this.label.textContent = "La señal emocional está casi completa.";
    if (this.progress >= 100 && !this.complete) { this.complete = true; this.label.textContent = "Emoción procesada."; }
    if (this.elapsed > 10.15 && !this.changing) { this.changing = true; this.manager.go("propagation"); }
  }

  exit() {
    window.removeEventListener("keydown", this.onKeyDown);
    this.audio?.pause();
    if (state.audioPlayer === this.audio) state.audioPlayer = null;
  }
}
