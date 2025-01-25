import * as dat from "lil-gui";
import * as THREE from "three";
import { Timer } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { startLoadingManager } from "./loadingManager";

const gui = new dat.GUI();

const scene = new THREE.Scene();

const loadingManger = startLoadingManager();

const textureLoader = new THREE.TextureLoader(loadingManger);
const floorTextures = {
  alpha: textureLoader.load("/textures/haunted-house/floor/alpha.jpg"),
};

const wallsMeasurements = {
  width: 4,
  height: 2.5,
  depth: 4,
};

const roofMeasurements = {
  height: 2,
  radius: 3,
};

const doorMeasurements = {
  width: 2.2,
  height: 2.2,
};

const house = new THREE.Group();

const walls = new THREE.Mesh(
  new THREE.BoxGeometry(
    wallsMeasurements.width,
    wallsMeasurements.height,
    wallsMeasurements.depth
  ),
  new THREE.MeshStandardMaterial()
);
walls.position.y += wallsMeasurements.height * 0.5;

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(roofMeasurements.radius, roofMeasurements.height, 4),
  new THREE.MeshStandardMaterial()
);
roof.position.y += wallsMeasurements.height + roofMeasurements.height * 0.5;
roof.rotation.y += Math.PI * 0.25;

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(doorMeasurements.width, roofMeasurements.height),
  new THREE.MeshStandardMaterial({ color: "red" })
);
door.position.y = roofMeasurements.height * 0.5;
door.position.z = wallsMeasurements.width * 0.5 + 0.01;

const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial();

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(walls, roof, door, bush1, bush2, bush3, bush4);

scene.add(house);

const graveGeometry = new THREE.BoxGeometry(0.9, 1.2, 0.25);
const graveMaterial = new THREE.MeshStandardMaterial();

const graves = new THREE.Group();

scene.add(graves);

for (let i = 0; i <= 20; i++) {
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);

  const angle = Math.random() * Math.PI * 2;
  const radius = 3.5 + Math.random() * 4.3;
  const positionX = Math.sin(angle) * radius;
  const positionY = Math.random() * 0.6;
  const positionZ = Math.cos(angle) * radius;

  grave.position.set(positionX, positionY, positionZ);

  const rotationX = (Math.random() - 0.5) * 0.5;
  const rotationY = (Math.random() - 0.5) * 0.5;
  const rotationZ = (Math.random() - 0.5) * 0.5;

  grave.rotation.set(rotationX, rotationY, rotationZ);

  graves.add(grave);
}

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(24, 24),
  new THREE.MeshStandardMaterial({
    alphaMap: floorTextures.alpha,
    transparent: true,
  })
);
floor.rotation.x += -Math.PI * 0.5;
scene.add(floor);

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
