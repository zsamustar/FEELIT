import * as THREE from "three";
import { state, selectedEmotion } from "../state.js";

export class FinalScene {
  constructor(manager) { this.manager = manager; }

  enter() {
    this.scene = new THREE.Scene(); this.scene.background = new THREE.Color(0xf3f4f6);
    const emotion = selectedEmotion();
    this.manager.uiRoot.innerHTML = `
      <section class="final-layer" style="--emotion:${emotion.css}">
        <div class="final-content"><p class="eyebrow">Feel It · sesión completada</p><h1>Gracias a los caramelos Feel It,<br>ahora te sientes más <span class="emotion-word">${emotion.name}</span></h1><p>La música se convirtió en algo que puedes sentir.</p><button type="button" class="restart-button" data-restart>Volver a empezar</button></div>
      </section>`;
    this.manager.uiRoot.querySelector("[data-restart]").addEventListener("click", () => {
      state.emocionElegida = null; state.purchased = false; this.manager.go("store");
    });
  }
  update() {}
  exit() {}
}
