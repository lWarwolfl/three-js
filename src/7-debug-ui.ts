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

const geometry1 = new THREE.BufferGeometry();
const count = 50;
const positionsArray = new Float32Array(count * 3 * 3);
for (let i = 0; i < count * 3 * 3; i++) {
  positionsArray[i] = Math.random() - 0.5;
}
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
geometry1.setAttribute("position", positionsAttribute);

const geometry2 = new THREE.SphereGeometry(0.5, 24, 12);

const geometry3 = new THREE.BoxGeometry(1, 1, 1);

const geometry4 = new THREE.OctahedronGeometry(0.5);

const material1 = new THREE.MeshBasicMaterial({
  color: 0x333333,
  wireframe: true,
});

const material2 = new THREE.MeshBasicMaterial({
  color: 0x444444,
  wireframe: true,
});

const material3 = new THREE.MeshBasicMaterial({
  color: 0x555555,
  wireframe: true,
});

const material4 = new THREE.MeshBasicMaterial({
  color: 0x666666,
  wireframe: true,
});

const element1 = new THREE.Mesh(geometry1, material1);

const element2 = new THREE.Mesh(geometry2, material2);
element2.position.x = 1.1;

const element3 = new THREE.Mesh(geometry3, material3);
element3.position.y = 1.1;

const element4 = new THREE.Mesh(geometry4, material4);
element4.position.z = 1.1;

const group = new THREE.Group();
group.add(element1, element2, element3, element4);

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

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
});

window.addEventListener("dblclick", () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

// let clock = new THREE.Clock();

const tick = () => {
  // const elapsedTime = clock.getElapsedTime();

  // group.rotation.y = elapsedTime / 1.5;
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 5;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 5;
  // camera.position.y = -cursor.y * 5;
  // camera.lookAt(group.position);

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
