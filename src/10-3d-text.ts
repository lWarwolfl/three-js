import * as dat from "lil-gui";
import * as THREE from "three";
import { OrbitControls, RGBELoader } from "three/examples/jsm/Addons.js";

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

const textureLoader = new THREE.TextureLoader(loadingManger);

const minecraftColorTexture = textureLoader.load("/textures/minecraft.jpeg");
minecraftColorTexture.colorSpace = THREE.SRGBColorSpace;

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
doorColorTexture.colorSpace = THREE.SRGBColorSpace;

// const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
// const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
// const doorAmbientOcclusionTexture = textureLoader.load(
//   "/textures/door/ambientOcclusion.jpg"
// );
// const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
// const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
// const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const matcapTexture = textureLoader.load("/textures/matcaps/8.png");
matcapTexture.colorSpace = THREE.SRGBColorSpace;

const gradientTexture = textureLoader.load("/textures/gradients/5.jpg");
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;

const scene = new THREE.Scene();

// const minecraftMaterial = new THREE.MeshBasicMaterial({
//   map: minecraftColorTexture,
// });

// const basicMaterial = new THREE.MeshBasicMaterial({ map: doorColorTexture });

// const normalMaterial = new THREE.MeshNormalMaterial();

// const matcapMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

// const depthMaterial = new THREE.MeshDepthMaterial();

// const lambertMaterial = new THREE.MeshLambertMaterial();

// const phongMaterial = new THREE.MeshPhongMaterial({
//   shininess: 200,
//   specular: new THREE.Color(0x1188ff),
// });

// const toonMaterial = new THREE.MeshToonMaterial({
//   gradientMap: gradientTexture,
// });

// const standardMaterial = new THREE.MeshStandardMaterial({
//   metalness: 1,
//   roughness: 0,
//   map: doorColorTexture,
//   aoMap: doorAmbientOcclusionTexture,
//   normalMap: doorNormalTexture,
//   alphaMap: doorAlphaTexture,
// });

const physicalMaterial = new THREE.MeshPhysicalMaterial({
  metalness: 0,
  roughness: 0,
  ior: 2.4,
  transmission: 1,
  thickness: 1,
});

const mainMaterial = physicalMaterial;

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

const group = new THREE.Group();
group.add(box, sphere, octahedron);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 30);
pointLight.position.y = 5;
pointLight.lookAt(group.position);
scene.add(pointLight);

const rgbeLoader = new RGBELoader(loadingManger);
rgbeLoader.load(
  "/textures/environmentMap/2k.hdr",
  (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = environmentMap;
    scene.environment = environmentMap;
  }
);

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

// Create a folder for MeshStandardMaterial properties
const materialFolder = gui.addFolder("Standard Material Properties");

materialFolder
  .add(physicalMaterial, "metalness")
  .min(0)
  .max(1)
  .step(0.001)
  .name("Metalness");

materialFolder
  .add(physicalMaterial, "roughness")
  .min(0)
  .max(1)
  .step(0.001)
  .name("Roughness");

materialFolder
  .add(physicalMaterial, "clearcoat")
  .min(0)
  .max(1)
  .step(0.001)
  .name("Clearcoat");

materialFolder
  .add(physicalMaterial, "clearcoatRoughness")
  .min(0)
  .max(1)
  .step(0.001)
  .name("Clearcoat Roughness");

materialFolder
  .add(physicalMaterial, "sheen")
  .min(0)
  .max(1)
  .step(0.001)
  .name("Sheen");

materialFolder
  .add(physicalMaterial, "sheenRoughness")
  .min(0)
  .max(1)
  .step(0.001)
  .name("Sheen Roughness");

materialFolder
  .add(physicalMaterial, "iridescence")
  .min(0)
  .max(1)
  .step(0.001)
  .name("Iridescence");

materialFolder
  .add(physicalMaterial, "iridescenceIOR")
  .min(1)
  .max(2.33)
  .step(0.001)
  .name("Iridescence IOR");

materialFolder
  .add(physicalMaterial.iridescenceThicknessRange, "0")
  .min(1)
  .max(1000)
  .step(1)
  .name("Iridescence Thickness 0");

materialFolder
  .add(physicalMaterial.iridescenceThicknessRange, "1")
  .min(1)
  .max(1000)
  .step(1)
  .name("Iridescence Thickness 1");

materialFolder
  .add(physicalMaterial, "transmission")
  .min(0)
  .max(1)
  .step(0.001)
  .name("Transmission");

materialFolder
  .add(physicalMaterial, "ior")
  .min(1)
  .max(10)
  .step(0.001)
  .name("IOR");

materialFolder
  .add(physicalMaterial, "thickness")
  .min(0)
  .max(1)
  .step(0.001)
  .name("Thickness");

materialFolder.addColor(physicalMaterial, "sheenColor").name("Sheen Color");

materialFolder.addColor(physicalMaterial, "color").name("Color");

// Add a reset button to the GUI
gui.add({ reset: () => gui.reset() }, "reset").name("Reset To Default");
