import CANNON from "cannon";
import * as dat from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { startLoadingManager } from "./loadingManager";

const gui = new dat.GUI();

const scene = new THREE.Scene();

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

const concreteMaterial = new CANNON.Material("concrete");
const plasticMaterial = new CANNON.Material("plastic");

const defaultContactMaterial = new CANNON.ContactMaterial(
  concreteMaterial,
  plasticMaterial,
  {
    friction: 0.1,
    restitution: 0.7,
  }
);
world.addContactMaterial(defaultContactMaterial);

const loadingManger = startLoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManger);

const gradientTexture = textureLoader.load("/textures/gradients/5.jpg");
gradientTexture.magFilter = THREE.NearestFilter;

const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManger);
const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.png",
  "/textures/environmentMaps/0/nx.png",
  "/textures/environmentMaps/0/py.png",
  "/textures/environmentMaps/0/ny.png",
  "/textures/environmentMaps/0/pz.png",
  "/textures/environmentMaps/0/nz.png",
]);

const standardMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.2,
  roughness: 0.2,
  side: 2,
});

const mainMaterial = new THREE.MeshStandardMaterial({
  color: "#eee",
  metalness: 0,
  roughness: 0.2,
});

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 16),
  mainMaterial
);

const sphereShape = new CANNON.Sphere(0.5);

const sphereBody = new CANNON.Body({
  mass: 1,
  position: new CANNON.Vec3(0, 3, 0),
  material: plasticMaterial,
  shape: sphereShape,
});

world.addBody(sphereBody);

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10).center(),
  standardMaterial
);
plane.position.y = -1;
plane.rotation.x = -Math.PI / 2;

const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
  shape: floorShape,
  material: concreteMaterial,
  mass: 0,
});
world.addBody(floorBody);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
floorBody.position.y = -1;

scene.background = new THREE.Color("black");

scene.add(sphere, plane);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(1, 2, 0);
scene.add(directionalLight);

// const axesHelper = new THREE.AxesHelper(2);

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
sphere.castShadow = true;

directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 11;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -11;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;

// spotLight.shadow.camera.far = 15;

let clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  world.step(1 / 60, deltaTime, 3);
  sphere.position.copy(sphereBody.position as unknown as THREE.Vector3);

  sphereBody.applyForce(new CANNON.Vec3(-0.2, 0, 0), sphereBody.position);

  // box.rotation.x = 0.1 * elapsedTime;
  // sphere.rotation.x = 0.1 * elapsedTime;
  // octahedron.rotation.x = 0.1 * elapsedTime;

  // box.rotation.y = -0.15 * elapsedTime;
  // sphere.rotation.y = -0.15 * elapsedTime;
  // octahedron.rotation.y = -0.15 * elapsedTime;

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();

// Add a reset button to the GUI
gui.add({ reset: () => gui.reset() }, "reset").name("Reset To Default");
