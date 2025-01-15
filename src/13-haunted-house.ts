import * as dat from "lil-gui";
import * as THREE from "three";
import { Timer } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { startLoadingManager } from "./loadingManager";

const gui = new dat.GUI();

const scene = new THREE.Scene();

const loadingManger = startLoadingManager();

const textureLoader = new THREE.TextureLoader(loadingManger);
textureLoader.load("/shadow/bakedShadow.jpg");

const standardMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.1,
  roughness: 0.6,
});

const wallsMeasurements = {
  width: 4,
  height: 2.5,
  depth: 4,
};

const roofMeasurements = {
  height: 2,
  radius: 3,
};

const house = new THREE.Group();

const walls = new THREE.Mesh(
  new THREE.BoxGeometry(
    wallsMeasurements.width,
    wallsMeasurements.height,
    wallsMeasurements.depth
  ),
  standardMaterial
);
walls.position.y += wallsMeasurements.height * 0.5;

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(roofMeasurements.radius, roofMeasurements.height, 4),
  standardMaterial
);
roof.position.y += wallsMeasurements.height + roofMeasurements.height * 0.5;
roof.rotation.y += Math.PI * 0.25;

house.add(walls, roof);

scene.add(house);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), standardMaterial);
plane.rotation.x += -Math.PI * 0.5;
scene.add(plane);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xeeffff, 1.2);
directionalLight.position.set(2, 4, 0);
scene.add(directionalLight);

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
camera.position.y = 2;
camera.position.z = 5;
camera.lookAt(house.position);
scene.add(camera);

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

let timer = new Timer();

const tick = () => {
  timer.update();
  const elapsedTime = timer.getElapsed();

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();

// Add GUI folders
const positionFolder = gui.addFolder("Position Controls");

// Position controls
positionFolder
  .add(house.position, "x")
  .min(-3)
  .max(3)
  .step(0.1)
  .name("Position X");
positionFolder
  .add(house.position, "y")
  .min(-3)
  .max(3)
  .step(0.1)
  .name("Position Y");
positionFolder
  .add(house.position, "z")
  .min(-3)
  .max(3)
  .step(0.1)
  .name("Position Z");

// Add a reset button to the GUI
gui.add({ reset: () => gui.reset() }, "reset").name("Reset To Default");
