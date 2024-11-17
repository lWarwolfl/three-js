import * as dat from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const gui = new dat.GUI();

const scene = new THREE.Scene();

const standardMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.2,
  roughness: 0.5,
  side: 2,
});

const mainMaterial = standardMaterial;

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 16),
  mainMaterial
);
sphere.position.y = 1;
scene.add(sphere);

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(6, 6).center(),
  mainMaterial
);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

const directionalLight = new THREE.DirectionalLight(0xffffdd, 2);
directionalLight.position.set(1, 2, 0);
scene.add(directionalLight);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  1
);
scene.add(directionalLightHelper);

const axesHelper = new THREE.AxesHelper(2);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);

camera.position.z = 5;

scene.add(camera, axesHelper);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
});

const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
const canvas = document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

let clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  sphere.rotation.x = 0.1 * elapsedTime;
  sphere.rotation.y = -0.15 * elapsedTime;

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();

// Add a folder for Position Controls
const positionFolder = gui.addFolder("Position Controls");

// Position controls
positionFolder
  .add(sphere.position, "x")
  .min(-3)
  .max(3)
  .step(0.1)
  .name("Position X");
positionFolder
  .add(sphere.position, "y")
  .min(-3)
  .max(3)
  .step(0.1)
  .name("Position Y");
positionFolder
  .add(sphere.position, "z")
  .min(-3)
  .max(3)
  .step(0.1)
  .name("Position Z");

// Helper toggle object
const helpers = {
  showDirectionalHelper: false,
};

// Function to update helper visibility
const updateHelpersVisibility = () => {
  directionalLightHelper.visible = helpers.showDirectionalHelper;
};

// Initialize helper visibility
updateHelpersVisibility();

// Add GUI folder for Light Helpers
const helpersFolder = gui.addFolder("Light Helpers");

// Add toggles for each light helper
helpersFolder
  .add(helpers, "showDirectionalHelper")
  .name("Directional Light Helper")
  .onChange(updateHelpersVisibility);

// Open the Light Helpers folder by default
helpersFolder.open();

// Add a reset button to the GUI
gui.add({ reset: () => gui.reset() }, "reset").name("Reset To Default");
