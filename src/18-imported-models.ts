import * as dat from "lil-gui";
import * as THREE from "three";
import {
  DRACOLoader,
  GLTFLoader,
  OrbitControls,
} from "three/examples/jsm/Addons.js";
import { startLoadingManager } from "./loadingManager";

const gui = new dat.GUI();

const scene = new THREE.Scene();

const loadingManager = startLoadingManager();
// const textureLoader = new THREE.TextureLoader(loadingManager);
const dracoLoader = new DRACOLoader(loadingManager);
dracoLoader.setDecoderPath("/draco/");
const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.setDRACOLoader(dracoLoader);
// const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

const standardMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.2,
  roughness: 0.2,
  side: 2,
});

// Scene Setup
const plane = new THREE.Mesh(
  new THREE.BoxGeometry(10, 0.05, 10).center(),
  standardMaterial
);
plane.position.y = -1.05;

scene.background = new THREE.Color("black");

scene.add(plane);

// Lights Setup
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(1, 2, 0);
scene.add(directionalLight);

// 3D Model Import
let mixer: THREE.AnimationMixer | null;

gltfLoader.load("/models/Fox/glTF/Fox.gltf", (res) => {
  const model = res.scene;
  mixer = new THREE.AnimationMixer(model);
  const action = mixer.clipAction(res.animations[0]);

  action.play();

  model.scale.set(0.03, 0.03, 0.03);
  model.position.y = -1.02;

  model.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = false;
    }
  });

  scene.add(model);
});

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

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

plane.receiveShadow = true;

directionalLight.castShadow = true;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 11;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -11;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;

let clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  if (mixer) mixer.update(deltaTime);

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();

// Add a reset button to the GUI
gui.add({ reset: () => gui.reset() }, "reset").name("Reset To Default");
