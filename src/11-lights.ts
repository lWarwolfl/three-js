import * as dat from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

const gui = new dat.GUI();

const loadingManger = new THREE.LoadingManager();

document.body.classList.add("loading");
const loadingContainer = document.getElementById("loading-container");
const percentageContainer = document.getElementById("percentage");

loadingManger.onProgress = (_, itemsLoaded, itemsTotal) => {
  const progress = itemsLoaded / itemsTotal;
  const percentage = parseFloat(progress.toFixed(2)) * 100;

  if (percentageContainer)
    percentageContainer.innerHTML = `${
      percentage / 1 >= 1
        ? percentage / 10 >= 1
          ? percentage / 100 >= 1
            ? percentage
            : "0" + percentage
          : "00" + percentage
        : "000" + percentage
    }%`;

  if (progress === 1) {
    document.body.classList.remove("loading");

    if (loadingContainer) {
      setTimeout(() => {
        loadingContainer.style.opacity = "0";
      }, 500);

      setTimeout(() => {
        loadingContainer.style.display = "none";
      }, 1000);
    }
  }
};

const scene = new THREE.Scene();

const standardMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.2,
  roughness: 0.2,
  side: 2,
});

const mainMaterial = standardMaterial;

const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1, 3, 3), mainMaterial);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 16),
  mainMaterial
);
sphere.position.x = 2;

const octahedron = new THREE.Mesh(
  new THREE.OctahedronGeometry(0.5),
  mainMaterial
);
octahedron.position.x = -2;

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(6, 6).center(),
  mainMaterial
);
plane.position.y = -1;
plane.rotation.x = -Math.PI / 2;

const group = new THREE.Group();
group.add(box, sphere, octahedron, plane);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.9);
directionalLight.position.set(1, 2, 0);
scene.add(directionalLight);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  1
);
scene.add(directionalLightHelper);

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.9);
scene.add(hemisphereLight);

const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  0.5
);
scene.add(hemisphereLightHelper);

const pointLight = new THREE.PointLight(0xff9000, 1.5, 0, 0.5);
pointLight.position.set(1, -0.5, 1);
scene.add(pointLight);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);
scene.add(pointLightHelper);

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 6, 1, 1);
rectAreaLight.position.set(0, 2, 2);
rectAreaLight.lookAt(box.position);
scene.add(rectAreaLight);

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

const spotLight = new THREE.SpotLight(
  0x78ff00,
  4.5,
  10,
  Math.PI * 0.1,
  0.25,
  1
);
spotLight.position.set(0, 2, -2);
spotLight.target.position.x = -0.5;
scene.add(spotLight);
scene.add(spotLight.target);

const spotLightHelper = new THREE.SpotLightHelper(spotLight, 1);
scene.add(spotLightHelper);

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

let clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  box.rotation.x = 0.1 * elapsedTime;
  sphere.rotation.x = 0.1 * elapsedTime;
  octahedron.rotation.x = 0.1 * elapsedTime;

  box.rotation.y = -0.15 * elapsedTime;
  sphere.rotation.y = -0.15 * elapsedTime;
  octahedron.rotation.y = -0.15 * elapsedTime;

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();

// Add a folder for Position Controls
const positionFolder = gui.addFolder("Position Controls");

// Position controls
positionFolder
  .add(group.position, "x")
  .min(-3)
  .max(3)
  .step(0.1)
  .name("Position X");
positionFolder
  .add(group.position, "y")
  .min(-3)
  .max(3)
  .step(0.1)
  .name("Position Y");
positionFolder
  .add(group.position, "z")
  .min(-3)
  .max(3)
  .step(0.1)
  .name("Position Z");

// Helper toggle object
const helpers = {
  showDirectionalHelper: false,
  showHemisphereHelper: false,
  showPointHelper: false,
  showRectAreaHelper: false,
  showSpotHelper: false,
  showAxesHelper: false,
};

// Function to update helper visibility
const updateHelpersVisibility = () => {
  directionalLightHelper.visible = helpers.showDirectionalHelper;
  hemisphereLightHelper.visible = helpers.showHemisphereHelper;
  pointLightHelper.visible = helpers.showPointHelper;
  rectAreaLightHelper.visible = helpers.showRectAreaHelper;
  spotLightHelper.visible = helpers.showSpotHelper;
  axesHelper.visible = helpers.showAxesHelper;
};

// Initialize helper visibility
updateHelpersVisibility();

// Add GUI folder for Light Helpers
const helpersFolder = gui.addFolder("Light Helpers");

// Add toggles for each light helper
helpersFolder
  .add(helpers, "showDirectionalHelper")
  .name("Directional Light Helper")
  .onChange(updateHelpersVisibility);
helpersFolder
  .add(helpers, "showHemisphereHelper")
  .name("Hemisphere Light Helper")
  .onChange(updateHelpersVisibility);
helpersFolder
  .add(helpers, "showPointHelper")
  .name("Point Light Helper")
  .onChange(updateHelpersVisibility);
helpersFolder
  .add(helpers, "showRectAreaHelper")
  .name("Rect Area Light Helper")
  .onChange(updateHelpersVisibility);
helpersFolder
  .add(helpers, "showSpotHelper")
  .name("Spot Light Helper")
  .onChange(updateHelpersVisibility);
helpersFolder
  .add(helpers, "showAxesHelper")
  .name("Axes Helper")
  .onChange(updateHelpersVisibility);

// Open the Light Helpers folder by default
helpersFolder.open();

// Add a reset button to the GUI
gui.add({ reset: () => gui.reset() }, "reset").name("Reset To Default");
