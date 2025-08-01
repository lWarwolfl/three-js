import * as dat from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { startLoadingManager } from "./loadingManager";

const gui = new dat.GUI();

const scene = new THREE.Scene();

const loadingManager = startLoadingManager();

const textureLoader = new THREE.TextureLoader(loadingManager);
const bakedShadow = textureLoader.load("/shadow/bakedShadow.jpg");
const simpleShadow = textureLoader.load("/shadow/simpleShadow.jpg");
bakedShadow.colorSpace = THREE.SRGBColorSpace;

const standardMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.1,
  roughness: 0.6,
  side: 2,
});

const mainMaterial = standardMaterial;

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 16),
  mainMaterial
);
sphere.position.y = 1;
sphere.castShadow = true;
scene.add(sphere);

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(6, 6).center(),
  mainMaterial
);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xeeffff, 1.4);
directionalLight.position.set(2, 4, 0);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.right = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.camera.near = 2;
directionalLight.shadow.camera.far = 6;
scene.add(directionalLight);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  1
);
scene.add(directionalLightHelper);

const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
scene.add(directionalLightCameraHelper);

const spotLight = new THREE.SpotLight(0xffffff, 7, 10, Math.PI * 0.3);
spotLight.position.set(0, 2.5, -2.5);
spotLight.target.position.y = 1;
spotLight.castShadow = true;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
scene.add(spotLight);
scene.add(spotLight.target);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(spotLightCameraHelper);

const pointLight = new THREE.PointLight(0xff0000, 3, 10);
pointLight.position.set(1, 2.5, -1);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.5;
pointLight.shadow.camera.far = 4;
scene.add(pointLight);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);
scene.add(pointLightHelper);

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
scene.add(pointLightCameraHelper);

const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    alphaMap: simpleShadow,
  })
);
sphereShadow.rotation.x = -Math.PI * 0.5;
sphereShadow.position.y = plane.position.y + 0.01;

scene.add(sphereShadow);

const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

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
camera.lookAt(sphere.position);
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
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
const canvas = document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

let clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  sphere.position.x = Math.sin(elapsedTime) * 1.5;
  sphere.position.z = Math.cos(elapsedTime) * 1.5;
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 4.5)) + 0.5;

  sphereShadow.position.x = Math.sin(elapsedTime) * 1.5;
  sphereShadow.position.z = Math.cos(elapsedTime) * 1.5;
  sphereShadow.material.opacity = 1 - sphere.position.y + 0.4;

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();

// Add GUI folders
const positionFolder = gui.addFolder("Position Controls");

// Position controls
positionFolder
  .add(sphere.position, "x")
  .min(-3)
  .max(3)
  .step(0.1)
  .name("Position X");
positionFolder
  .add(sphere.position, "y")
  .min(-3)
  .max(3)
  .step(0.1)
  .name("Position Y");
positionFolder
  .add(sphere.position, "z")
  .min(-3)
  .max(3)
  .step(0.1)
  .name("Position Z");

// Light toggle object
const lights = {
  showAmbient: true,
  showDirectional: true,
  showSpotLight: false,
  showPointLight: false,
};

// Function to update light visibility
const updateLightsVisibility = () => {
  ambientLight.visible = lights.showAmbient;
  directionalLight.visible = lights.showDirectional;
  spotLight.visible = lights.showSpotLight;
  pointLight.visible = lights.showPointLight;
};

// Initialize light visibility
updateLightsVisibility();

// Helper toggle object
const helpers = {
  showDirectionalHelper: false,
  showDirectionalCameraHelper: false,
  showSpotLightHelper: false,
  showSpotLightCameraHelper: false,
  showPointLightHelper: false,
  showPointLightCameraHelper: false,
};

// Function to update helper visibility
const updateHelpersVisibility = () => {
  directionalLightHelper.visible = helpers.showDirectionalHelper;
  directionalLightCameraHelper.visible = helpers.showDirectionalCameraHelper;
  spotLightHelper.visible = helpers.showSpotLightHelper;
  spotLightCameraHelper.visible = helpers.showSpotLightCameraHelper;
  pointLightHelper.visible = helpers.showPointLightHelper;
  pointLightCameraHelper.visible = helpers.showPointLightCameraHelper;
};

// Initialize helper visibility
updateHelpersVisibility();

const lightsFolder = gui.addFolder("Lights");
const helpersFolder = gui.addFolder("Light Helpers");

// Add toggles for each light
lightsFolder
  .add(lights, "showAmbient")
  .name("Ambient Light")
  .onChange(updateLightsVisibility);

lightsFolder
  .add(lights, "showDirectional")
  .name("Directional Light")
  .onChange(updateLightsVisibility);

lightsFolder
  .add(lights, "showSpotLight")
  .name("Spot Light")
  .onChange(updateLightsVisibility);

lightsFolder
  .add(lights, "showPointLight")
  .name("Point Light")
  .onChange(updateLightsVisibility);

// Add toggles for each light helper
helpersFolder
  .add(helpers, "showDirectionalHelper")
  .name("Directional Light Helper")
  .onChange(updateHelpersVisibility);

helpersFolder
  .add(helpers, "showDirectionalCameraHelper")
  .name("Directional Light Camera Helper")
  .onChange(updateHelpersVisibility);

helpersFolder
  .add(helpers, "showSpotLightHelper")
  .name("Spot Light Helper")
  .onChange(updateHelpersVisibility);

helpersFolder
  .add(helpers, "showSpotLightCameraHelper")
  .name("Spot Light Camera Helper")
  .onChange(updateHelpersVisibility);

helpersFolder
  .add(helpers, "showPointLightHelper")
  .name("Point Light Helper")
  .onChange(updateHelpersVisibility);

helpersFolder
  .add(helpers, "showPointLightCameraHelper")
  .name("Point Light Camera Helper")
  .onChange(updateHelpersVisibility);

// Open the Light Helpers folder by default
helpersFolder.open();

// Add a reset button to the GUI
gui.add({ reset: () => gui.reset() }, "reset").name("Reset To Default");
