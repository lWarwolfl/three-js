import gsap from "gsap";
import * as dat from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const gui = new dat.GUI();

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: 0x333333,
});

const element = new THREE.Mesh(geometry, material);

const group = new THREE.Group();
group.add(element);

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

scene.add(camera, axesHelper, group);

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

const tick = () => {
  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();

const parameters = {
  spin: () => {
    gsap.to(group.rotation, { duration: 1, y: group.rotation.y + Math.PI * 2 });
  },
};

// Folders for GUI
const positionFolder = gui.addFolder("Position Controls");
const scaleFolder = gui.addFolder("Scale Controls");
const rotationFolder = gui.addFolder("Rotation Controls");
const propertiesFolder = gui.addFolder("Box Properties");

// Position controls
positionFolder
  .add(element.position, "x")
  .min(-3)
  .max(3)
  .step(0.1)
  .name("Position X");
positionFolder
  .add(element.position, "y")
  .min(-3)
  .max(3)
  .step(0.1)
  .name("Position Y");
positionFolder
  .add(element.position, "z")
  .min(-3)
  .max(3)
  .step(0.1)
  .name("Position Z");
positionFolder.open();

// Scale controls
scaleFolder.add(element.scale, "x").min(0.1).max(5).step(0.1).name("Scale X");
scaleFolder.add(element.scale, "y").min(0.1).max(5).step(0.1).name("Scale Y");
scaleFolder.add(element.scale, "z").min(0.1).max(5).step(0.1).name("Scale Z");
scaleFolder.open();

// Rotation controls
rotationFolder
  .add(element.rotation, "x")
  .min(-Math.PI)
  .max(Math.PI)
  .step(0.01)
  .name("Rotation X");
rotationFolder
  .add(element.rotation, "y")
  .min(-Math.PI)
  .max(Math.PI)
  .step(0.01)
  .name("Rotation Y");
rotationFolder
  .add(element.rotation, "z")
  .min(-Math.PI)
  .max(Math.PI)
  .step(0.01)
  .name("Rotation Z");
rotationFolder.open();

// Properties
propertiesFolder.addColor(element.material, "color");
propertiesFolder.add(element, "visible").name("Visibility");
propertiesFolder.add(element.material, "wireframe").name("Wireframe");
propertiesFolder.add(parameters, "spin");
propertiesFolder.open();
