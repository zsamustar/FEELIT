import * as THREE from "three";
import { state, emotions } from "../state.js";

export class FeelItInterfaceScene {
  constructor(manager) { this.manager = manager; }

  enter() {
    this.scene = new THREE.Scene(); this.scene.background = new THREE.Color(0x080a0d);
    this.selected = null;
    this.manager.uiRoot.innerHTML = `
      <section class="full-layer" aria-label="Biblioteca musical Feel It">
        <div class="device-ui">
          <aside class="sidebar frosted">
            <div class="interface-brand"><i class="brand-orb"></i>Feel It</div>
            <nav class="nav-list" aria-label="Navegación decorativa">
              <div class="nav-item active">Inicio</div><div class="nav-item">Explorar</div><div class="nav-item">Tu biblioteca</div><div class="nav-item">Favoritos</div>
            </nav>
            <p class="sidebar-bottom">Seleccione una emoción.<br>El dispositivo hará el resto.</p>
          </aside>
          <section class="library frosted">
            <div class="topline"><span>Biblioteca personal</span><i class="avatar"></i></div>
            <p class="interface-eyebrow">Catálogo emocional · Vol. 01</p>
            <h1>¿Cómo quieres<br>sentirte?</h1>
            <p class="library-subtitle">Escoge una pista para iniciar la síntesis.</p>
            <div class="track-grid">
              <button class="track-card happy" type="button" data-emotion="felicidad"><span class="track-icon">✦</span><span class="track-title">Felicidad</span><span class="track-meta">Síntesis cálida · 10 s</span></button>
              <button class="track-card sad" type="button" data-emotion="tristeza"><span class="track-icon">◒</span><span class="track-title">Tristeza</span><span class="track-meta">Síntesis profunda · 10 s</span></button>
            </div>
            <div class="decorative-row" aria-label="Colecciones decorativas"><div class="decorative-chip"></div><div class="decorative-chip"></div><div class="decorative-chip"></div><div class="decorative-chip"></div></div>
          </section>
          <footer class="player frosted">
            <div class="now-playing"><i class="now-playing-art"></i><div><strong data-playing-title>Elige una emoción</strong><span data-playing-meta>Sin reproducción</span></div></div>
            <button class="play-big" type="button" data-play aria-label="Sintetizar emoción" disabled>▶</button><i class="volume"></i>
          </footer>
        </div>
        <p class="synthesis-note" data-synthesis>Preparando la síntesis…</p>
      </section>`;
    this.cards = [...this.manager.uiRoot.querySelectorAll("[data-emotion]")];
    this.play = this.manager.uiRoot.querySelector("[data-play]");
    this.title = this.manager.uiRoot.querySelector("[data-playing-title]");
    this.meta = this.manager.uiRoot.querySelector("[data-playing-meta]");
    this.note = this.manager.uiRoot.querySelector("[data-synthesis]");
    this.cards.forEach((card) => card.addEventListener("click", () => this.select(card.dataset.emotion)));
    this.play.addEventListener("click", () => this.playSelection());
  }

  select(emotion) {
    this.selected = emotion;
    const data = emotions[emotion];
    this.cards.forEach((card) => card.classList.toggle("selected", card.dataset.emotion === emotion));
    this.title.textContent = data.label;
    this.meta.textContent = "Lista para sintetizar";
    this.play.disabled = false; this.play.classList.add("ready"); this.play.style.setProperty("--play-color", data.css);
  }

  playSelection() {
    if (!this.selected || this.playing) return;
    this.playing = true; state.emocionElegida = this.selected;
    // Starting muted while this click is still a trusted gesture makes later
    // playback reliable in browsers with strict autoplay policies.
    const preparedAudio = new Audio(emotions[this.selected].audio);
    preparedAudio.preload = "auto";
    preparedAudio.muted = true;
    preparedAudio.play().then(() => {
      preparedAudio.pause();
      preparedAudio.currentTime = 0;
      preparedAudio.muted = false;
    }).catch(() => { preparedAudio.muted = false; });
    state.audioPlayer = preparedAudio;
    state.audioEmotion = this.selected;
    this.play.textContent = "✓"; this.play.classList.remove("ready"); this.play.disabled = true;
    this.note.classList.add("visible");
    this.timeout = window.setTimeout(() => this.manager.go("candy"), 1450);
  }

  update() {}
  exit() { window.clearTimeout(this.timeout); }
}
