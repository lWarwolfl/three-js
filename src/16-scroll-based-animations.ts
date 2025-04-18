import * as dat from "lil-gui";
import * as THREE from "three";
import { Timer } from "three/examples/jsm/Addons.js";
import { startLoadingManager } from "./loadingManager";

const parameters = { materialColor: "#d4d4d4" };

const gui = new dat.GUI();

const scene = new THREE.Scene();

const loadingManger = startLoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManger);

const gradientTexture = textureLoader.load("/textures/gradients/5.jpg");
gradientTexture.magFilter = THREE.NearestFilter;

const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture,
});

const distance = 2.1;

const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
mesh1.position.y = 0;

const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 24), material);
mesh2.position.y = -distance * 2;

const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);
mesh3.position.y = -distance * 4;

const meshes = [mesh1, mesh2, mesh3];

const particlesCount = 250;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
  const i3 = i * 3;

  positions[i3] = (Math.random() - 0.5) * 20;
  positions[i3 + 1] = -Math.random() * distance * meshes.length * 2.5;
  positions[i3 + 2] = (Math.random() - 0.5) * 20;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

const particlesMaterial = new THREE.PointsMaterial({
  color: parameters.materialColor,
  sizeAttenuation: true,
  size: 0.04,
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
particles.position.y = distance * 2;

const all = new THREE.Group();
all.add(mesh1, mesh2, mesh3, particles);

scene.add(all);

const directionalLight = new THREE.DirectionalLight("#ffffff", 2.2);
directionalLight.position.set(8, 7, 8);
scene.add(directionalLight);

let scrollY = window.scrollY;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
});

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
camera.position.z = 3;
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
canvas.className = "fixed-canvas";

let timer = new Timer();

const tick = () => {
  timer.update();
  const elapsedTime = timer.getElapsed();

  const mildHeight = -scrollY / sizes.height;

  all.rotation.y = mildHeight * 0.25;

  camera.position.y = mildHeight * distance * 2;

  for (const mesh of meshes) {
    mesh.rotation.x = elapsedTime * 0.2;
    mesh.rotation.y = elapsedTime * 0.1;
  }

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();

gui.addColor(material, "color");

// Add a reset button to the GUI
gui.addColor(parameters, "materialColor").onChange(() => {
  material.color.set(parameters.materialColor);
  particlesMaterial.color.set(parameters.materialColor);
});
