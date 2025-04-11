import * as dat from "lil-gui";
import * as THREE from "three";
import { Timer } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { startLoadingManager } from "./loadingManager";

const gui = new dat.GUI();

const params = {
  count: 700,
};

const scene = new THREE.Scene();

const loadingManger = startLoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManger);

//Floor textures
const floorAlphaTexture = textureLoader.load(
  "/textures/haunted-house/floor/alpha.jpg"
);

const particleGeometry = new THREE.BufferGeometry();
const radius = 2;
const positionsArray = new Float32Array(params.count * 3);

for (let i = 0; i < params.count; i++) {
  // Generate a random point inside a sphere using spherical coordinates and random radius
  const u = Math.random();
  const v = Math.random();
  const w = Math.random();

  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = radius * Math.cbrt(w); // cube root ensures uniform volume distribution

  const x = r * Math.sin(phi) * Math.cos(theta);
  const y = r * Math.sin(phi) * Math.sin(theta);
  const z = r * Math.cos(phi);

  positionsArray[i * 3 + 0] = x;
  positionsArray[i * 3 + 1] = y;
  positionsArray[i * 3 + 2] = z;
}

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
particleGeometry.setAttribute("position", positionsAttribute);

const particleMaterial = new THREE.PointsMaterial({
  color: "#eee",
  size: 0.07,
  sizeAttenuation: true,
  alphaMap: floorAlphaTexture,
  transparent: true,
  depthWrite: false,
});
const particle = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particle);

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
camera.lookAt(particle.position);
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
controls.maxTargetRadius = 7;
controls.minDistance = 3.5;
controls.maxDistance = 10;
controls.enableDamping = true;

let timer = new Timer();

const tick = () => {
  timer.update();
  const elapsedTime = timer.getElapsed();

  for (let i = 0; i < params.count; i++) {
    const i3 = i * 3;

    particleGeometry.attributes.position.array[i3 + 1] = Math.sin(
      elapsedTime + i3
    );
  }
  particleGeometry.attributes.position.needsUpdate = true;

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();

gui.add(particleMaterial, "size", 0.01, 0.2, 0.01).name("Particle Size");

// Add a reset button to the GUI
gui.add({ reset: () => gui.reset() }, "reset").name("Reset To Default");
