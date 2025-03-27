import * as dat from "lil-gui";
import * as THREE from "three";
import { Timer } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { startLoadingManager } from "./loadingManager";

const gui = new dat.GUI();

const scene = new THREE.Scene();

const loadingManger = startLoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManger);

const wallsMeasurements = {
  width: 4,
  height: 2.5,
  depth: 4,
};

const roofMeasurements = {
  width: 4.8,
  height: 0.3,
  depth: 4.8,
};

const doorMeasurements = {
  width: 2.2,
  height: 2.2,
};

//Floor textures
const floorAlphaTexture = textureLoader.load(
  "/textures/haunted-house/floor/alpha.jpg"
);
const floorColorTexture = textureLoader.load(
  "/textures/haunted-house/floor/diff.jpg"
);
const floorARMTexture = textureLoader.load(
  "/textures/haunted-house/floor/arm.jpg"
);
const floorNormalTexture = textureLoader.load(
  "/textures/haunted-house/floor/nor.jpg"
);
const floorDisplacementTexture = textureLoader.load(
  "/textures/haunted-house/floor/disp.jpg"
);

const floorRepeat = 6;

floorColorTexture.repeat.set(floorRepeat, floorRepeat);
floorColorTexture.wrapS = THREE.RepeatWrapping;
floorColorTexture.wrapT = THREE.RepeatWrapping;
floorColorTexture.colorSpace = THREE.SRGBColorSpace;

floorARMTexture.repeat.set(floorRepeat, floorRepeat);
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;

floorNormalTexture.repeat.set(floorRepeat, floorRepeat);
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;

floorDisplacementTexture.repeat.set(floorRepeat, floorRepeat);
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

//Wall textures
const wallColorTexture = textureLoader.load(
  "/textures/haunted-house/wall/diff.jpg"
);
const wallARMTexture = textureLoader.load(
  "/textures/haunted-house/wall/arm.jpg"
);
const wallNormalTexture = textureLoader.load(
  "/textures/haunted-house/wall/nor.jpg"
);
const wallRepeat = 2;

wallColorTexture.repeat.set(wallRepeat, wallRepeat);
wallColorTexture.wrapS = THREE.RepeatWrapping;
wallColorTexture.wrapT = THREE.RepeatWrapping;
wallColorTexture.colorSpace = THREE.SRGBColorSpace;

wallARMTexture.repeat.set(wallRepeat, wallRepeat);
wallARMTexture.wrapS = THREE.RepeatWrapping;
wallARMTexture.wrapT = THREE.RepeatWrapping;

wallNormalTexture.repeat.set(wallRepeat, wallRepeat);
wallNormalTexture.wrapS = THREE.RepeatWrapping;
wallNormalTexture.wrapT = THREE.RepeatWrapping;

//Floor textures
const roofColorTexture = textureLoader.load(
  "/textures/haunted-house/roof/diff.jpg"
);
const roofARMTexture = textureLoader.load(
  "/textures/haunted-house/roof/arm.jpg"
);
const roofNormalTexture = textureLoader.load(
  "/textures/haunted-house/roof/nor.jpg"
);

roofColorTexture.repeat.set(2, roofMeasurements.height);
roofColorTexture.wrapS = THREE.RepeatWrapping;
roofColorTexture.wrapT = THREE.RepeatWrapping;
roofColorTexture.colorSpace = THREE.SRGBColorSpace;

roofARMTexture.repeat.set(2, roofMeasurements.height);
roofARMTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapT = THREE.RepeatWrapping;

roofNormalTexture.repeat.set(2, roofMeasurements.height);
roofNormalTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapT = THREE.RepeatWrapping;

//Bush textures
const bushColorTexture = textureLoader.load(
  "/textures/haunted-house/bush/diff.jpg"
);
const bushARMTexture = textureLoader.load(
  "/textures/haunted-house/bush/arm.jpg"
);
const bushNormalTexture = textureLoader.load(
  "/textures/haunted-house/bush/nor.jpg"
);

bushColorTexture.repeat.set(2, 1);
bushColorTexture.wrapS = THREE.RepeatWrapping;
bushColorTexture.colorSpace = THREE.SRGBColorSpace;

bushARMTexture.repeat.set(2, 1);
bushARMTexture.wrapS = THREE.RepeatWrapping;

bushNormalTexture.repeat.set(2, 1);
bushNormalTexture.wrapS = THREE.RepeatWrapping;

//Grave textures
const graveColorTexture = textureLoader.load(
  "/textures/haunted-house/grave/diff.jpg"
);
const graveARMTexture = textureLoader.load(
  "/textures/haunted-house/grave/arm.jpg"
);
const graveNormalTexture = textureLoader.load(
  "/textures/haunted-house/grave/nor.jpg"
);

graveColorTexture.repeat.set(0.3, 1);
graveColorTexture.wrapS = THREE.RepeatWrapping;
graveColorTexture.colorSpace = THREE.SRGBColorSpace;

graveARMTexture.repeat.set(0.3, 1);
graveARMTexture.wrapS = THREE.RepeatWrapping;

graveNormalTexture.repeat.set(0.3, 1);
graveNormalTexture.wrapS = THREE.RepeatWrapping;

const doorColorTexture = textureLoader.load(
  "/textures/haunted-house/door/color.jpg"
);
doorColorTexture.colorSpace = THREE.SRGBColorSpace;
const doorHeightTexture = textureLoader.load(
  "/textures/haunted-house/door/height.jpg"
);
const doorAlphaTexture = textureLoader.load(
  "/textures/haunted-house/door/alpha.jpg"
);
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/haunted-house/door/ambientOcclusion.jpg"
);
const doorMetalnessTexture = textureLoader.load(
  "/textures/haunted-house/door/metalness.jpg"
);
const doorNormalTexture = textureLoader.load(
  "/textures/haunted-house/door/normal.jpg"
);
const doorRoughnessTexture = textureLoader.load(
  "/textures/haunted-house/door/roughness.jpg"
);

const house = new THREE.Group();

const walls = new THREE.Mesh(
  new THREE.BoxGeometry(
    wallsMeasurements.width,
    wallsMeasurements.height,
    wallsMeasurements.depth,
    100,
    100
  ),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallARMTexture,
    roughnessMap: wallARMTexture,
    metalnessMap: wallARMTexture,
    normalMap: wallNormalTexture,
  })
);
walls.position.y += wallsMeasurements.height * 0.5;

const roof = new THREE.Mesh(
  new THREE.BoxGeometry(
    roofMeasurements.width,
    roofMeasurements.height,
    roofMeasurements.depth
  ),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture,
  })
);
roof.position.y += wallsMeasurements.height + roofMeasurements.height * 0.5;

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(
    doorMeasurements.width,
    doorMeasurements.height,
    30,
    30
  ),
  new THREE.MeshStandardMaterial({
    transparent: true,
    map: doorColorTexture,
    aoMap: doorAmbientOcclusionTexture,
    roughnessMap: doorRoughnessTexture,
    metalnessMap: doorMetalnessTexture,
    normalMap: doorNormalTexture,
    alphaMap: doorAlphaTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.15,
    displacementBias: -0.04,
  })
);
door.position.y = doorMeasurements.height * 0.5;
door.position.z = wallsMeasurements.width * 0.5 + 0.01;

const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  map: bushColorTexture,
  aoMap: bushARMTexture,
  roughnessMap: bushARMTexture,
  metalnessMap: bushARMTexture,
  normalMap: bushNormalTexture,
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);
bush1.rotation.x = -0.75;

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);
bush2.rotation.x = -0.75;

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);
bush3.rotation.x = -0.75;

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1.2, 0.05, 2.1);
bush4.rotation.x = -0.75;

house.add(walls, roof, door, bush1, bush2, bush3, bush4);

scene.add(house);

const graveGeometry = new THREE.BoxGeometry(0.9, 1.2, 0.25);
const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  aoMap: graveARMTexture,
  roughnessMap: graveARMTexture,
  metalnessMap: graveARMTexture,
  normalMap: graveNormalTexture,
});

const graves = new THREE.Group();

scene.add(graves);

for (let i = 0; i <= 20; i++) {
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);

  const angle = Math.random() * Math.PI * 2;
  const radius = 3.5 + Math.random() * 4.3;
  const positionX = Math.sin(angle) * radius;
  const positionY = Math.random() * 0.6;
  const positionZ = Math.cos(angle) * radius;

  grave.position.set(positionX, positionY, positionZ);

  const rotationX = (Math.random() - 0.5) * 0.5;
  const rotationY = (Math.random() - 0.5) * 0.5;
  const rotationZ = (Math.random() - 0.5) * 0.5;

  grave.rotation.set(rotationX, rotationY, rotationZ);

  graves.add(grave);
}

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(24, 24, 100, 100),
  new THREE.MeshStandardMaterial({
    alphaMap: floorAlphaTexture,
    transparent: true,
    map: floorColorTexture,
    aoMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture,
    normalMap: floorNormalTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.51,
    displacementBias: -0.25,
  })
);
floor.rotation.x += -Math.PI * 0.5;
scene.add(floor);

const pointLight = new THREE.PointLight(0xff9000, 1.5, 0, 0.5);

// const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);
// scene.add(pointLightHelper);

const lightBulb = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.07, 0.3, 3, 20),
  new THREE.MeshStandardMaterial({
    roughness: 1,
    emissive: "#FFEB66",
    color: "#FFEB66",
  })
);

const doorLight = new THREE.Group();
doorLight.add(pointLight, lightBulb);
doorLight.position.y = 2.3;
doorLight.position.z = 2;
doorLight.rotation.z = Math.PI / 2;
scene.add(doorLight);

const ghostMaterial = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  emissive: "#ffffff",
  transparent: true,
  opacity: 0.2,
});

const ghost1Material = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  emissive: "#ffffff",
  transparent: true,
  opacity: 0.2,
});
const ghost1Light = new THREE.PointLight("#ffffff", 3, 2, 2);
const ghost1SmallMesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.1, 16, 16),
  ghost1Material
);
const ghost1Mesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.2, 16, 16),
  ghostMaterial
);

const ghost1 = new THREE.Group();
ghost1.add(ghost1Light, ghost1Mesh, ghost1SmallMesh);
scene.add(ghost1);

const ghost2Material = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  emissive: "#ffffff",
  transparent: true,
  opacity: 0.2,
});
const ghost2Light = new THREE.PointLight("#ffffff", 3, 3, 2);
const ghost2SmallMesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.15, 16, 16),
  ghost2Material
);
const ghost2Mesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.3, 16, 16),
  ghostMaterial
);

const ghost2 = new THREE.Group();
ghost2.add(ghost2Light, ghost2Mesh, ghost2SmallMesh);
scene.add(ghost2);

const ghost3Material = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  emissive: "#ffffff",
  transparent: true,
  opacity: 0.2,
});
const ghost3Light = new THREE.PointLight("#ffffff", 3, 4, 2);
const ghost3SmallMesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.2, 16, 16),
  ghost3Material
);
const ghost3Mesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.4, 16, 16),
  ghostMaterial
);

const ghost3 = new THREE.Group();
ghost3.add(ghost3Light, ghost3Mesh, ghost3SmallMesh);
scene.add(ghost3);

const ambientLight = new THREE.AmbientLight("#86cdff", 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("#86cdff", 1.2);
directionalLight.position.set(-99, 9, -18);
scene.add(directionalLight);

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
camera.lookAt(house.position);
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

let timer = new Timer();

function getAnimatedOpacity(angle: number) {
  return (
    Math.abs(Math.sin(angle) * Math.sin(2.2 * angle) * Math.sin(3.3 * angle)) +
    0.1
  );
}

const tick = () => {
  timer.update();
  const elapsedTime = timer.getElapsed();

  ghost1.position.x = Math.cos(elapsedTime * 0.9) * 4;
  ghost1.position.z = Math.sin(elapsedTime * 0.9) * 4;
  ghost1.position.y = Math.sin(elapsedTime * 2) * 1.5 + 1;
  ghost1Material.opacity = getAnimatedOpacity(elapsedTime * 1.3);

  ghost2.position.x = Math.cos(-elapsedTime * 0.7) * 6;
  ghost2.position.z = Math.sin(-elapsedTime * 0.7) * 6;
  ghost2.position.y = Math.sin(elapsedTime) * 1.7 + 1;
  ghost2Material.opacity = getAnimatedOpacity(elapsedTime * 1);

  ghost3.position.x = Math.cos(elapsedTime * 0.5) * 8;
  ghost3.position.z = Math.sin(elapsedTime * 0.5) * 8;
  ghost3.position.y = Math.sin(elapsedTime * 0.7) * 2 + 1;
  ghost3Material.opacity = getAnimatedOpacity(elapsedTime * 0.7);

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();

// Add GUI folders
const positionFolder = gui.addFolder("Position Controls");
const displacementFolder = gui.addFolder("Displacement Controls");

// Light Position controls
positionFolder
  .add(directionalLight.position, "x")
  .min(-100)
  .max(100)
  .step(0.1)
  .name("Position X");
positionFolder
  .add(directionalLight.position, "y")
  .min(-100)
  .max(100)
  .step(0.1)
  .name("Position Y");
positionFolder
  .add(directionalLight.position, "z")
  .min(-100)
  .max(100)
  .step(0.1)
  .name("Position Z");

// Displacement controls
displacementFolder
  .add(floor.material, "displacementScale")
  .min(0)
  .max(1)
  .step(0.01)
  .name("Scale");
displacementFolder
  .add(floor.material, "displacementBias")
  .min(-1)
  .max(1)
  .step(0.01)
  .name("Bias");

// Add a reset button to the GUI
gui.add({ reset: () => gui.reset() }, "reset").name("Reset To Default");
