import * as THREE from "three";

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material1 = new THREE.MeshBasicMaterial({ color: 0x5d5d5d });
const material2 = new THREE.MeshBasicMaterial({ color: 0x111111 });
const material3 = new THREE.MeshBasicMaterial({ color: 0x333333 });
const material4 = new THREE.MeshBasicMaterial({ color: 0x555555 });

const cube1 = new THREE.Mesh(geometry, material1);

const cube2 = new THREE.Mesh(geometry, material2);
cube2.position.x = 1.1;

const cube3 = new THREE.Mesh(geometry, material3);
cube3.position.y = 1.1;

const cube4 = new THREE.Mesh(geometry, material4);
cube4.position.z = 1.1;

const group = new THREE.Group();
group.add(cube1, cube2, cube3, cube4);

group.rotation.y = -Math.PI / 6;

const axesHelper = new THREE.AxesHelper(2);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.y = 3;
camera.position.z = 5;
camera.lookAt(group.position);

scene.add(camera, axesHelper, group);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.render(scene, camera);

console.log("huh");
