const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

export class FadeTransition {
  constructor(element) { this.element = element; }

  async toBlack(effect = "") {
    this.element.className = effect ? `active ${effect}` : "active";
    await wait(455);
  }

  async fromBlack() {
    this.element.className = "";
    await wait(455);
  }
}

export { wait };
