import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { startLoadingManager } from "./loadingManager";

// const image = new Image();
// const texture = new THREE.Texture(image);
// texture.colorSpace = THREE.SRGBColorSpace;

// image.src = "/textures/door/Door_Wood_001_basecolor.jpg";
// image.onload = () => {
//   texture.needsUpdate = true;
// };

const loadingManger = startLoadingManager();

const textureLoader = new THREE.TextureLoader(loadingManger);
const colorTexture = textureLoader.load("/textures/minecraft.jpeg");
colorTexture.colorSpace = THREE.SRGBColorSpace;
colorTexture.magFilter = THREE.NearestFilter;
colorTexture.generateMipmaps = false;

// colorTexture.repeat.x = 3;
// colorTexture.repeat.y = 3;
// colorTexture.wrapS = THREE.RepeatWrapping;
// colorTexture.wrapT = THREE.RepeatWrapping;

// colorTexture.rotation = Math.PI / 4;
// colorTexture.center.x = 0.5;
// colorTexture.center.y = 0.5;

// const heightTexture = textureLoader.load(
//   "/textures/door/height.jpg"
// );
// const alphaTexture = textureLoader.load(
//   "/textures/door/alpha.jpg"
// );
// const ambientOcclusionTexture = textureLoader.load(
//   "/textures/door/ambientOcclusion.jpg"
// );
// const metalnessTexture = textureLoader.load(
//   "/textures/door/metalness.jpg"
// );
// const normalTexture = textureLoader.load(
//   "/textures/door/normal.jpg"
// );
// const roughnessTexture = textureLoader.load(
//   "/textures/door/roughness.jpg"
// );

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  map: colorTexture,
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
