import * as dat from 'lil-gui'
import * as THREE from 'three'
import { FontLoader, GLTFLoader, OrbitControls, TextGeometry } from 'three/examples/jsm/Addons.js'
import { startLoadingManager } from './loadingManagerPlus'

const gui = new dat.GUI()

const scene = new THREE.Scene()

const loadingManager = startLoadingManager(() => {
  function repeat() {
    createConfetti(250)

    setTimeout(() => repeat(), 4000)
  }

  repeat()
})

// const textureLoader = new THREE.TextureLoader(loadingManager);
const gltfLoader = new GLTFLoader(loadingManager)
const fontLoader = new FontLoader(loadingManager)

const normalMaterial = new THREE.MeshNormalMaterial({ side: 2 })

// 3D Models Import
let mixer: THREE.AnimationMixer | null
let heart: THREE.Group<THREE.Object3DEventMap> | null

gltfLoader.load('/models/Heart/heart.glb', (res) => {
  heart = res.scene
  mixer = new THREE.AnimationMixer(heart)
  const action = mixer.clipAction(res.animations[0])

  heart.position.y = 3

  action.play()

  heart.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = normalMaterial
    }
  })

  scene.add(heart)
})

let confetti1: THREE.Group<THREE.Object3DEventMap> | null
gltfLoader.load('/models/Confetti/1.glb', (res) => {
  confetti1 = res.scene

  confetti1.position.y = 3

  confetti1.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = normalMaterial
    }
  })
})

let confetti2: THREE.Group<THREE.Object3DEventMap> | null
gltfLoader.load('/models/Confetti/2.glb', (res) => {
  confetti2 = res.scene

  confetti2.position.y = 3

  confetti2.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = normalMaterial
    }
  })
})

let confetti3: THREE.Group<THREE.Object3DEventMap> | null
gltfLoader.load('/models/Confetti/3.glb', (res) => {
  confetti3 = res.scene

  confetti3.position.y = 3

  confetti3.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = normalMaterial
    }
  })
})

//Create confetti function
const objectsToUpdate: { mesh: THREE.Group<THREE.Object3DEventMap>; multiplier: number }[] = []

function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function createConfetti(count: number) {
  if (!confetti1 || !confetti2 || !confetti3) return

  const confetties = [confetti1, confetti2, confetti3]
  const size = 0.2
  const spread = 25
  const height = 40

  for (let i = 0; i < count; i++) {
    const base = confetties[Math.floor(Math.random() * confetties.length)]
    const mesh = base.clone(true)

    mesh.scale.set(size, size, size)

    mesh.position.set(
      Math.random() * spread * 2 - spread,
      Math.random() * 5 + height,
      Math.random() * spread * 2 - spread
    )

    scene.add(mesh)

    objectsToUpdate.push({ mesh, multiplier: randomRange(2, 10) })
  }
}

//Delete extra confetti function
function removeConfetti(target: THREE.Group<THREE.Object3DEventMap>) {
  const index = objectsToUpdate.findIndex((o) => o.mesh === target)
  if (index === -1) return

  const { mesh } = objectsToUpdate[index]

  scene.remove(mesh)

  mesh.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry.dispose()
      if (Array.isArray(child.material)) {
        child.material.forEach((m) => m.dispose())
      } else {
        child.material.dispose()
      }
    }
  })

  objectsToUpdate.splice(index, 1)
}

//Text loader
fontLoader.load('/fonts/Josefin_Sans_Bold.json', (font) => {
  const textGeometry = new TextGeometry('Happy Birthday', {
    font: font,
    size: 0.8,
    depth: 0.3,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelOffset: 0,
    bevelSegments: 5,
  })

  textGeometry.center()

  const text = new THREE.Mesh(textGeometry, normalMaterial)

  text.position.y = -0.5

  scene.add(text)
})

// Scene Config
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)

camera.position.z = 12

scene.add(camera)

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
})

const renderer = new THREE.WebGLRenderer({ alpha: true })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
const canvas = document.body.appendChild(renderer.domElement)
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap

let clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - oldElapsedTime
  oldElapsedTime = elapsedTime

  if (mixer) mixer.update(deltaTime / 1.5)
  if (heart) {
    heart.rotation.y = elapsedTime / 1.5
    heart.position.y = Math.sin(elapsedTime * 2) / 3 + 1.8
  }

  for (const object of objectsToUpdate) {
    object.mesh.position.y = object.mesh.position.y - deltaTime * object.multiplier
    object.mesh.rotateY((deltaTime * object.multiplier) / 4)
    object.mesh.rotateZ((deltaTime * object.multiplier) / 4)

    if (object.mesh.position.y < -20) {
      removeConfetti(object.mesh)
    }
  }

  controls.update()

  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}

tick()

// Add a reset button to the GUI
