export class InstructivoScene {
  constructor(manager) {
    this.manager = manager;
    this.onKeyDown = (event) => { if (event.code === "Escape") this.close(); };
  }

  open() {
    this.manager.uiRoot.insertAdjacentHTML("beforeend", `
      <section class="modal-layer" data-manual>
        <article class="manual-card" role="dialog" aria-modal="true" aria-labelledby="manual-title">
          <p class="eyebrow">Manual de uso · 01</p>
          <h1 id="manual-title">Feel It</h1>
          <p>Feel It es un dispositivo que convierte música en emociones sintetizadas. Selecciona una canción, come el caramelo que genera y siente la emoción.</p>
          <button class="action-button" type="button" data-continue>Continuar</button>
          <p class="small-note">También puedes presionar ESC</p>
        </article>
      </section>
    `);
    this.element = this.manager.uiRoot.querySelector("[data-manual]");
    this.element.querySelector("[data-continue]").addEventListener("click", () => this.close());
    window.addEventListener("keydown", this.onKeyDown);
  }

  close() {
    if (!this.element) return;
    window.removeEventListener("keydown", this.onKeyDown);
    this.element.remove();
    this.element = null;
    this.manager.go("interface");
  }

  dispose() {
    window.removeEventListener("keydown", this.onKeyDown);
    this.element?.remove();
    this.element = null;
  }
}
