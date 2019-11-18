import './index.scss';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function setupRenderer() {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  return renderer;
}

function setupCamera() {
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(0, 0, 600);
  return camera;
}

function setupControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  controls.enableDamping = true;
  controls.minDistance = 200;
  controls.maxDistance = 1000;
  controls.zoomSpeed = .5;
  return controls;
}

function setupScene(camera) {
  const scene = new THREE.Scene();
  scene.add(camera);
  return scene;
}

function setupGlobe(scene) {
  const texture_bg = 'https://images.designtrends.com/wp-content/uploads/2015/12/17112023/outer-space-Texture.jpg';
  const texture_globe = 'https://i.postimg.cc/nn74Bznd/earth.png';
  // const model_globe = 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf';
  const model_globe = './models/earth.gltf';
  const model_scale = 3;

  const loader = new THREE.TextureLoader();
  loader.load(texture_bg, (texture) => {
    scene.background = texture;
  });

  const pointLight = new THREE.PointLight(0xFFFFFF, 1, 4000);
  pointLight.position.set(10, 500, 400);
  scene.add(pointLight);

  const globe = new THREE.Group();
  scene.add(globe);

  // Example using basic shapes.
  // const loader2 = new THREE.TextureLoader();
  // loader2.load(texture_globe, (texture) => {
  //   const sphere = new THREE.SphereGeometry(200, 50, 50);
  //   const material = new THREE.MeshBasicMaterial({ map: texture, overdraw: 0.5 });
  //   const mesh = new THREE.Mesh(sphere, material);
  //   globe.add(mesh);
  // });

  // Example using model file
  const loader3 = new GLTFLoader();
  loader3.load(model_globe, (gltf) => {
    globe.add(gltf.scene);
    globe.scale.set(model_scale, model_scale, model_scale);
  });

  return globe;
}


function setupResize(camera, renderer) {
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function setupAnimate(controls, renderer, scene, camera) {
  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  animate();
}

function setup() {
  const renderer = setupRenderer();
  const camera = setupCamera();
  const controls = setupControls(camera, renderer);
  const scene = setupScene(camera);
  const globe = setupGlobe(scene);
  setupResize(camera, renderer);
  setupAnimate(controls, renderer, scene, camera);
}

setup();
