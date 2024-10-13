import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

// const cursor = {
//   x: 0,
//   y: 0,
// };

// window.addEventListener("mousemove", (event) => {
//   cursor.x = event.clientX / window.innerWidth - 0.5;
//   cursor.y = event.clientY / window.innerHeight - 0.5;
// });

// window.addEventListener("mouseout", () => {
//   cursor.x = 0;
//   cursor.y = 0;
// });

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material1 = new THREE.MeshBasicMaterial({ color: 0x333333 });
const material2 = new THREE.MeshBasicMaterial({ color: 0x444444 });
const material3 = new THREE.MeshBasicMaterial({ color: 0x555555 });
const material4 = new THREE.MeshBasicMaterial({ color: 0x666666 });

const cube1 = new THREE.Mesh(geometry, material1);

const cube2 = new THREE.Mesh(geometry, material2);
cube2.position.x = 1.1;

const cube3 = new THREE.Mesh(geometry, material3);
cube3.position.y = 1.1;

const cube4 = new THREE.Mesh(geometry, material4);
cube4.position.z = 1.1;

const group = new THREE.Group();
group.add(cube1, cube2, cube3, cube4);

const axesHelper = new THREE.AxesHelper(2);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

// const aspectRatio = window.innerWidth / window.innerHeight;
// const camera = new THREE.OrthographicCamera(
//   -3 * aspectRatio,
//   3 * aspectRatio,
//   3,
//   -3,
//   0.1,
//   100
// );

// camera.position.y = 3;
camera.position.z = 5;
// camera.lookAt(group.position);

scene.add(camera, axesHelper, group);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
const canvas = document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// let time = Date.now();

// const tick = () => {
//   const currentTime = Date.now();
//   const deltaTime = currentTime - time;
//   time = currentTime;

//   group.rotation.y += 0.001 * deltaTime;
//   renderer.render(scene, camera);

//   window.requestAnimationFrame(tick);
// };

// tick();

let clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  group.rotation.y = elapsedTime / 1.5;
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 5;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 5;
  // camera.position.y = -cursor.y * 5;
  // camera.lookAt(group.position);

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
