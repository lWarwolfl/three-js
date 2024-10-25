import * as THREE from "three";
import {
  FontLoader,
  OrbitControls,
  TextGeometry,
} from "three/examples/jsm/Addons.js";

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

const normalMaterial = new THREE.MeshNormalMaterial();

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

// const physicalMaterial = new THREE.MeshPhysicalMaterial({
//   metalness: 0,
//   roughness: 0,
//   ior: 2.4,
//   transmission: 1,
//   thickness: 1,
// });

const fontLoader = new FontLoader(loadingManger);
fontLoader.load("/fonts/DM_Mono_Regular.json", (font) => {
  const textGeometry = new TextGeometry("I'm Sorry :(", {
    font: font,
    size: 0.5,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });

  const textGeometry2 = new TextGeometry("Love You <3", {
    font: font,
    size: 0.5,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });

  textGeometry.center();
  textGeometry2.center();

  const text = new THREE.Mesh(textGeometry, normalMaterial);
  const text2 = new THREE.Mesh(textGeometry2, normalMaterial);

  text.position.y = 0.5;

  text2.position.y = -0.5;

  scene.add(text, text2);
});

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

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

const renderer = new THREE.WebGLRenderer({ alpha: true });
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
