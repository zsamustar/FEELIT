import * as THREE from "three";
import { SceneManager } from "./SceneManager.js";
import { TiendaScene } from "./scenes/TiendaScene.js";
import { FeelItInterfaceScene } from "./scenes/FeelItInterfaceScene.js";
import { CaramelosScene } from "./scenes/CaramelosScene.js";
import { MinijuegoNeuronalScene } from "./scenes/MinijuegoNeuronalScene.js";
import { PropagacionScene } from "./scenes/PropagacionScene.js";
import { FinalScene } from "./scenes/FinalScene.js";

const canvas = document.querySelector("#experience");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.06;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const camera = new THREE.PerspectiveCamera(67, window.innerWidth / window.innerHeight, 0.05, 100);
const manager = new SceneManager({
  renderer,
  camera,
  uiRoot: document.querySelector("#ui-root"),
  fadeElement: document.querySelector("#fade"),
});

manager.register("store", new TiendaScene(manager));
manager.register("interface", new FeelItInterfaceScene(manager));
manager.register("candy", new CaramelosScene(manager));
manager.register("neural", new MinijuegoNeuronalScene(manager));
manager.register("propagation", new PropagacionScene(manager));
manager.register("final", new FinalScene(manager));

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();
function render() {
  const delta = Math.min(clock.getDelta(), 0.05);
  manager.update(delta, clock.elapsedTime);
  renderer.render(manager.renderScene, camera);
  requestAnimationFrame(render);
}

manager.go("store");
render();
