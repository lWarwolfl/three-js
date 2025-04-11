import * as dat from "lil-gui";
import * as THREE from "three";
import { Timer } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const gui = new dat.GUI();

const scene = new THREE.Scene();

const parameters = {
  count: 20000,
  size: 0.02,
  radius: 4,
  branches: 7,
  spin: 1.5,
  randomness: 0.2,
  concenteration: 3,
  insideColor: "#ff6030",
  outsideColor: "#1b3984",
};

let geometry: THREE.BufferGeometry | null = null;
let material: THREE.PointsMaterial | null = null;
let points: THREE.Points | null = null;

const generateGalaxy = () => {
  if (points !== null) {
    geometry?.dispose();
    material?.dispose();
    scene.remove(points);
  }

  geometry = new THREE.BufferGeometry();

  let vertexes = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);

  const colorInside = new THREE.Color(parameters.insideColor);
  const colorOutside = new THREE.Color(parameters.outsideColor);

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;

    const radius = Math.random() * parameters.radius;
    const spinAngle = radius * parameters.spin;
    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

    const randomX =
      Math.pow(Math.random(), parameters.concenteration) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;
    const randomY =
      Math.pow(Math.random(), parameters.concenteration) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;
    const randomZ =
      Math.pow(Math.random(), parameters.concenteration) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;

    vertexes[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    vertexes[i3 + 1] = randomY;
    vertexes[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / parameters.radius);

    colors[i3 + 0] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(vertexes, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  points = new THREE.Points(geometry, material);

  scene.add(points);
};

generateGalaxy();

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
controls.minDistance = 3.5;
controls.maxDistance = 10;
controls.enablePan = false;
controls.enableDamping = true;

let timer = new Timer();

const tick = () => {
  timer.update();
  const elapsedTime = timer.getElapsed();

  if (points) points.rotation.y = elapsedTime * 0.08;

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();

gui
  .add(parameters, "count")
  .min(100)
  .max(100000)
  .step(100)
  .name("Particle Count")
  .onFinishChange(generateGalaxy);

gui
  .add(parameters, "size")
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .name("Particle Size")
  .onFinishChange(generateGalaxy);

gui
  .add(parameters, "radius")
  .min(1)
  .max(20)
  .step(0.5)
  .name("Galaxy Radius")
  .onFinishChange(generateGalaxy);

gui
  .add(parameters, "branches")
  .min(4)
  .max(20)
  .step(1)
  .name("Galaxy Branches")
  .onFinishChange(generateGalaxy);

gui
  .add(parameters, "spin")
  .min(-5)
  .max(5)
  .step(0.1)
  .name("Galaxy Spin")
  .onFinishChange(generateGalaxy);

gui
  .add(parameters, "randomness")
  .min(0.1)
  .max(2)
  .step(0.1)
  .name("Randomness")
  .onFinishChange(generateGalaxy);

gui
  .add(parameters, "concenteration")
  .min(2)
  .max(10)
  .step(1)
  .name("Concenteration")
  .onFinishChange(generateGalaxy);

gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);

gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);

// Add a reset button to the GUI
gui.add({ reset: () => gui.reset() }, "reset").name("Reset To Default");
