import './index.scss';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function setupRenderer() {
  const el = document.getElementById('scene');
  const renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  el.appendChild(renderer.domElement);
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
  const texture_bg = './textures/space.jpg';
  const model_globe = './models/earth.gltf';
  const model_scale = 3;

  const loader = new THREE.CubeTextureLoader();
  const texture = loader.load([
    texture_bg,
    texture_bg,
    texture_bg,
    texture_bg,
    texture_bg,
    texture_bg,
  ]);
  scene.background = texture;

  // Example using basic background
  // const loader = new THREE.TextureLoader();
  // loader.load(texture_bg, (texture) => {
  //   scene.background = texture;
  // });

  const pointLight = new THREE.PointLight(0xFFFFFF, 1, 4000);
  pointLight.position.set(10, 500, 400);
  scene.add(pointLight);

  const globe = new THREE.Group();
  scene.add(globe);

  // Example using basic shapes.
  // const texture_globe = 'https://i.postimg.cc/nn74Bznd/earth.png';
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

function setupVector() {
  const vector = new THREE.Vector2();
  document.addEventListener('mousemove', (event) => {
    event.preventDefault();
    vector.x = (event.clientX / window.innerWidth) * 2 - 1;
    vector.y = - (event.clientY / window.innerHeight) * 2 + 1;
  });
  return vector;
}

function setupAnimate(controls, renderer, scene, camera, vector) {
  const raycaster = new THREE.Raycaster();
  let intersected = false;
  const vectors = () => {
    raycaster.setFromCamera(vector, camera);
    var intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
      if (intersected != intersects[0].object) {
        if (intersected) {
          intersected.material.emissive.setHex(intersected.currentHex);
        }
        intersected = intersects[0].object;
        intersected.currentHex = intersected.material.emissive.getHex();
        intersected.material.emissive.setHex( 0xff0000 );
      }
    } else {
      if (intersected) {
        intersected.material.emissive.setHex(intersected.currentHex);
      }
      intersected = null;
    }
  };
  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    vectors();
    renderer.render(scene, camera);
  };
  animate();
}

function setup() {
  const renderer = setupRenderer();
  const camera = setupCamera();
  const controls = setupControls(camera, renderer);
  const scene = setupScene(camera);
  const vector = setupVector();
  setupGlobe(scene);
  setupResize(camera, renderer);
  setupAnimate(controls, renderer, scene, camera, vector);
}

setup();
