import * as dat from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { startLoadingManager } from "./loadingManager";

const gui = new dat.GUI();

const scene = new THREE.Scene();

const loadingManager = startLoadingManager();

const textureLoader = new THREE.TextureLoader(loadingManager);
textureLoader.load("/textures/gradients/3.jpg");
// const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

const mainMaterial = new THREE.MeshBasicMaterial();

// Scene Setup
const plane = new THREE.Mesh(
  new THREE.BoxGeometry(10, 0.05, 10).center(),
  mainMaterial
);
plane.position.y = -3;

scene.add(plane);

const sphereGeometry = new THREE.SphereGeometry(1, 24, 12);
const sphere1 = new THREE.Mesh(
  sphereGeometry,
  new THREE.MeshBasicMaterial({
    color: "gray",
  })
);
sphere1.position.x = -3;

const sphere2 = new THREE.Mesh(
  sphereGeometry,
  new THREE.MeshBasicMaterial({
    color: "gray",
  })
);

const sphere3 = new THREE.Mesh(
  sphereGeometry,
  new THREE.MeshBasicMaterial({
    color: "gray",
  })
);
sphere3.position.x = 3;

scene.add(sphere1, sphere2, sphere3);

const raycaster = new THREE.Raycaster();

// Scene Config
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
camera.position.y = 5;

scene.add(camera);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
});

const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});

const renderer = new THREE.WebGLRenderer();
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
const canvas = document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

let clock = new THREE.Clock();
// let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  // const deltaTime = elapsedTime - oldElapsedTime;
  // oldElapsedTime = elapsedTime;

  sphere1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  sphere2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
  sphere3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

  // const raycasterOrigin = new THREE.Vector3(-4, 0, 0);
  // const raycasterDirection = new THREE.Vector3(10, 0, 0);
  // raycasterDirection.normalize();
  // raycaster.set(raycasterOrigin, raycasterDirection);

  raycaster.setFromCamera(mouse, camera);

  const spheres = [sphere1, sphere2, sphere3];
  const intersects = raycaster.intersectObjects(spheres);

  for (const sphere of spheres) {
    sphere.material.color.set("gray");
  }

  for (const intersect of intersects) {
    // @ts-expect-error this just works like this and only the type is wrong
    intersect.object.material.color.set("green");
  }

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();

// Add a reset button to the GUI
gui.add({ reset: () => gui.reset() }, "reset").name("Reset To Default");
