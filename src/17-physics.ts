import * as CANNON from "cannon-es";
import * as dat from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { startLoadingManager } from "./loadingManager";

const gui = new dat.GUI();

const scene = new THREE.Scene();

const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
world.gravity.set(0, -9.82, 0);

const concreteMaterial = new CANNON.Material("concrete");
const plasticMaterial = new CANNON.Material("plastic");
const metalMaterial = new CANNON.Material("metal");

// const defaultMaterial = new CANNON.Material("default");
const defaultContactMaterial = new CANNON.ContactMaterial(
  concreteMaterial,
  plasticMaterial,
  {
    friction: 0.2,
    restitution: 0.6,
  }
);
const metalConcereteContactMaterial = new CANNON.ContactMaterial(
  concreteMaterial,
  metalMaterial,
  {
    friction: 5,
    restitution: 0,
  }
);
const metalPlasticContactMaterial = new CANNON.ContactMaterial(
  metalMaterial,
  plasticMaterial,
  {
    friction: 0.15,
    restitution: 0.7,
  }
);

world.addContactMaterial(defaultContactMaterial);
world.addContactMaterial(metalConcereteContactMaterial);
world.addContactMaterial(metalPlasticContactMaterial);

const loadingManager = startLoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

const gradientTexture = textureLoader.load("/textures/gradients/5.jpg");
gradientTexture.magFilter = THREE.NearestFilter;

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.png",
  "/textures/environmentMaps/0/nx.png",
  "/textures/environmentMaps/0/py.png",
  "/textures/environmentMaps/0/ny.png",
  "/textures/environmentMaps/0/pz.png",
  "/textures/environmentMaps/0/nz.png",
]);
environmentMapTexture.colorSpace = THREE.SRGBColorSpace;

const standardMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.2,
  roughness: 0.2,
  side: 2,
});

const color_array = [
  "#FDB927",
  "#0033A0",
  "#C8102E",
  "#00843D",
  "#FF8200",
  "#532E88",
  "#8A1538",
  "#000000",
  "#FDB927",
  "#0033A0",
  "#C8102E",
  "#00843D",
  "#FF8200",
  "#532E88",
  "#8A1538",
  "#FFFFFF",
];

const mainMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.8,
  roughness: 0.2,
  envMap: environmentMapTexture,
});

const hitSound = new Audio("/sounds/hit.mp3");

const playHitSound = (collision: any) => {
  const impactStrength = collision.contact.getImpactVelocityAlongNormal();

  if (impactStrength > 1.5) {
    hitSound.volume = Math.min(impactStrength / 10, 1);
    hitSound.currentTime = 0;
    hitSound.play();
  }
};

const objectsToUpdate: { mesh: THREE.Mesh; body: CANNON.Body }[] = [];

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);

function createSphere(radius: number, position: THREE.Vector3) {
  const mesh = new THREE.Mesh(
    sphereGeometry,
    new THREE.MeshStandardMaterial({
      metalness: 0,
      roughness: 0.15,
      color: color_array[Math.floor(Math.random() * 16)],
      envMap: environmentMapTexture,
    })
  );
  mesh.scale.set(radius, radius, radius);

  mesh.castShadow = true;
  mesh.position.copy(position);

  scene.add(mesh);

  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({
    mass: 2,
    shape,
    material: plasticMaterial,
  });

  body.position.x = position.x;
  body.position.y = position.y;
  body.position.z = position.z;

  body.addEventListener("collide", playHitSound);

  world.addBody(body);
  objectsToUpdate.push({ mesh, body });
}

createSphere(0.5, new THREE.Vector3(0, 3, 0));

const boxGeometry = new THREE.BoxGeometry(1);

function createBox(size: number, position: THREE.Vector3) {
  const mesh = new THREE.Mesh(boxGeometry, mainMaterial);
  mesh.scale.set(size, size, size);

  mesh.castShadow = true;
  mesh.position.copy(position);

  scene.add(mesh);

  const shape = new CANNON.Box(new CANNON.Vec3(size / 2, size / 2, size / 2));
  const body = new CANNON.Body({
    mass: 10,
    shape,
    material: metalMaterial,
  });

  body.position.x = position.x;
  body.position.y = position.y;
  body.position.z = position.z;

  body.addEventListener("collide", playHitSound);

  world.addBody(body);
  objectsToUpdate.push({ mesh, body });
}

createBox(0.8, new THREE.Vector3(2, 2, 2));
createBox(0.8, new THREE.Vector3(-2, 2, 2));
createBox(0.8, new THREE.Vector3(2, 2, -2));
createBox(0.8, new THREE.Vector3(-2, 2, -2));

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10).center(),
  standardMaterial
);
plane.position.y = -1;
plane.rotation.x = -Math.PI / 2;

const floorShape = new CANNON.Box(new CANNON.Vec3(5, 5, 0.1));
const floorBody = new CANNON.Body({
  shape: floorShape,
  material: concreteMaterial,
  mass: 0,
});
world.addBody(floorBody);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
floorBody.position.y = -1.1;

scene.background = new THREE.Color("black");

scene.add(plane);

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

  for (const object of objectsToUpdate) {
    object.mesh.position.copy(object.body.position);
    object.mesh.quaternion.copy(object.body.quaternion);
  }

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();

gui
  .add(
    {
      createSphere: () =>
        createSphere(
          0.5,
          new THREE.Vector3(
            0 + (Math.random() - 0.5) * 0.01,
            3 + Math.random(),
            0 + (Math.random() - 0.5) * 0.01
          )
        ),
    },
    "createSphere"
  )
  .name("Create A Ball");
gui
  .add(
    {
      createBox: () =>
        createBox(
          0.8,
          new THREE.Vector3(
            0 + (Math.random() - 0.5) * 2,
            3 + Math.random(),
            0 + (Math.random() - 0.5) * 2
          )
        ),
    },
    "createBox"
  )
  .name("Create A Box");
gui
  .add(
    {
      reset: () => {
        for (const object of objectsToUpdate) {
          const { mesh, body } = object;
          mesh.geometry.dispose();
          scene.remove(mesh);
          body.removeEventListener("collide", playHitSound);
          world.removeBody(body);
          renderer.renderLists.dispose();
          objectsToUpdate.splice(0, objectsToUpdate.length);
        }
      },
    },
    "reset"
  )
  .name("Remove All");
