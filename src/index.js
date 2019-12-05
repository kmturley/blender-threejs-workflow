import './index.scss';
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const SPHERE_SIZE = 150;

const animations = [];
let intersected = false;

function randomPosition(model) {
  model.position.x = Math.random() * 2 - 1;
  model.position.y = Math.random() * 2 - 1;
  model.position.z = Math.random() * 2 - 1;
  model.position.normalize();
  model.position.multiplyScalar(SPHERE_SIZE);
}

function animateModel(model, gltf) {
  let mixer = new THREE.AnimationMixer(model);
  mixer.clipAction(gltf.animations[0]).play();
  animations.push(mixer);
}

function setupRenderer() {
  const el = document.getElementById('scene');
  const renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
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
  controls.zoomSpeed = .2;
  return controls;
}

function setupLights(scene, camera) {
  const point = new THREE.PointLight(0xffffff, 1);
  point.position.copy(camera.position);
  scene.add(point);
  const ambient = new THREE.AmbientLight(0x404040);
  scene.add(ambient);
}

function setupScene(camera) {
  const scene = new THREE.Scene();
  scene.add(camera);
  return scene;
}

function setupSky(scene) {
  const texture_bg = './textures/space.jpg';
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
  return texture;
}

function setupSphere(scene) {
  // Example using basic background
  // const loader = new THREE.TextureLoader();
  // loader.load(texture_bg, (texture) => {
  //   scene.background = texture;
  // });

  // Example using basic texture
  // const texture_globe = 'https://i.postimg.cc/nn74Bznd/earth.png';
  // const globe = new THREE.Group();
  // scene.add(globe);
  // const loader2 = new THREE.TextureLoader();
  // loader2.load(texture_globe, (texture) => {
  //   const sphere = new THREE.SphereGeometry(200, 50, 50);
  //   const material = new THREE.MeshBasicMaterial({map: texture});
  //   const mesh = new THREE.Mesh(sphere, material);
  //   globe.add(mesh);
  // });
  // return globe;

  // Example using flat shading
  const geometry = new THREE.SphereBufferGeometry(SPHERE_SIZE, 12, 9);
  const material = new THREE.MeshPhongMaterial({
    flatShading: true,
    color: 0x0000ff,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  return mesh;
}

function setupGlobe(scene) {
  const model_globe = './models/monkey.gltf';
  const model_scale = 30;
  const loader3 = new GLTFLoader();
  loader3.load(model_globe, (gltf) => {
    const model = gltf.scene;
    randomPosition(model);
    animateModel(model, gltf);
    scene.add(model);
    model.scale.set(model_scale, model_scale, model_scale);
  });
}

function setupLocation(scene) {
  let mixer;
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://threejs.org/examples/js/libs/draco/gltf/');
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.load('https://threejs.org/examples/models/gltf/LittlestTokyo.glb', (gltf) => {
    const model = gltf.scene;
    model.scale.set(.2, .2, .2);
    randomPosition(model);
    animateModel(model, gltf);
    scene.add(model);
  });
}

function setupResize(camera, renderer) {
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function setupInteractions(camera, controls, globe) {
  const vector = new THREE.Vector2();
  let isDragging = false;
  document.addEventListener('mousedown', (event) => {
    event.preventDefault();
    isDragging = false;
  });
  document.addEventListener('mousemove', (event) => {
    event.preventDefault();
    isDragging = true;
    vector.x = (event.clientX / window.innerWidth) * 2 - 1;
    vector.y = - (event.clientY / window.innerHeight) * 2 + 1;
  });
  document.addEventListener('mouseup', (event) => {
    if (isDragging) {
      isDragging = false;
      return;
    }
    event.preventDefault();
    if (intersected) {
      console.log('intersected', intersected);
      zoomCameraWithTransition(camera, controls, intersected);
    } else {
      zoomCameraWithTransition(camera, controls, globe, 1.5);
    }
  });
  return vector;
}

function zoomCameraWithTransition(camera, controls, model, fitOffset = 1.2) {
  // distance
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter();
  const size = box.getSize();
  const maxSize = Math.max(size.x, size.y, size.z);
  const fitHeightDistance = maxSize / ( 2 * Math.atan( Math.PI * camera.fov / 360 ) );
  const fitWidthDistance = fitHeightDistance / camera.aspect;
  const distance = fitOffset * Math.max(fitHeightDistance, fitWidthDistance);
  const cameraCoords = {
    x: center.x,
    y : center.y,
    z : center.z + distance
  };
  console.log('center', center, cameraCoords);
  const cameraAnim = new TWEEN.Tween(camera.position).to(cameraCoords, 1000).easing(TWEEN.Easing.Quadratic.InOut).start();
  const controlsAnim = new TWEEN.Tween(controls.target).to(center, 1000).easing(TWEEN.Easing.Quadratic.InOut).start();
}

function setupAnimate(controls, renderer, scene, camera, interactions, clock) {
  const raycaster = new THREE.Raycaster();
  const vectors = () => {
    raycaster.setFromCamera(interactions, camera);
    var intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
      if (intersected != intersects[0].object) {
        if (intersected && intersected.material.emissive) {
          intersected.material.emissive.setHex(intersected.currentHex);
        }
        intersected = intersects[0].object;
        if (intersected && intersected.material.emissive) {
          intersected.currentHex = intersected.material.emissive.getHex();
          intersected.material.emissive.setHex(0xff0000);
        }
      }
    } else {
      if (intersected && intersected.material.emissive) {
        intersected.material.emissive.setHex(intersected.currentHex);
      }
      intersected = null;
    }
  };
  const animate = () => {
    TWEEN.update();
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    animations.forEach((animation) => {
      animation.update(delta);
    });
    controls.update(delta);
    vectors();
    renderer.render(scene, camera);
  };
  animate();
}

function setup() {
  const clock = new THREE.Clock();
  const renderer = setupRenderer();
  const camera = setupCamera();
  const controls = setupControls(camera, renderer);
  const scene = setupScene(camera);
  const sphere = setupSphere(scene);
  const interactions = setupInteractions(camera, controls, sphere);
  setupLights(scene, camera);
  setupSky(scene);
  setupGlobe(scene);
  setupLocation(scene);
  setupResize(camera, renderer);
  setupAnimate(controls, renderer, scene, camera, interactions, clock);
}

setup();
