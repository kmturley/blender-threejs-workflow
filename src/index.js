import './index.scss';
import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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
  controls.zoomSpeed = .5;
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
  const globe = new THREE.Group();
  const geometry = new THREE.SphereBufferGeometry(150, 12, 9);
  const material = new THREE.MeshPhongMaterial({
    flatShading: true,
    color: 0x0000ff,
  });
  const mesh = new THREE.Mesh(geometry, material);
  globe.add(mesh);
  scene.add(globe);
  return globe;
}

function setupGlobe(scene) {
  const model_globe = './models/earth.gltf';
  const model_scale = 3;

  const globe = new THREE.Group();
  scene.add(globe);

  const loader3 = new GLTFLoader();
  loader3.load(model_globe, (gltf) => {
    globe.add(gltf.scene);
    globe.scale.set(model_scale, model_scale, model_scale);
  });

  return globe;
}

function setupLocation(scene, complete) {
  let mixer;
  const path = 'https://threejs.org/examples/textures/cube/Park2/';
  const format = '.jpg';
  const envMap = new THREE.CubeTextureLoader().load( [
    path + 'posx' + format, path + 'negx' + format,
    path + 'posy' + format, path + 'negy' + format,
    path + 'posz' + format, path + 'negz' + format
  ] );
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://threejs.org/examples/js/libs/draco/gltf/');
  const loader = new GLTFLoader();
  loader.setDRACOLoader( dracoLoader );
  loader.load('https://threejs.org/examples/models/gltf/LittlestTokyo.glb', (gltf) => {
    const model = gltf.scene;
    model.scale.set(.2, .2, .2);
    const box = new THREE.Box3().setFromObject(model);
    const offset = (box.getSize().y / 2);
    model.position.set(12, 140 + offset, 0);
    model.traverse((child) => {
      if (child.isMesh) {
        child.material.envMap = envMap;
      }
    });
    scene.add(model);
    mixer = new THREE.AnimationMixer(model);
    mixer.clipAction(gltf.animations[0]).play();
    complete(mixer);
  }, undefined, (e) => {
    console.error(e);
  });
}

function setupResize(camera, renderer) {
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function setupInteractions() {
  const vector = new THREE.Vector2();
  document.addEventListener('mousemove', (event) => {
    event.preventDefault();
    vector.x = (event.clientX / window.innerWidth) * 2 - 1;
    vector.y = - (event.clientY / window.innerHeight) * 2 + 1;
  });
  return vector;
}

function setupAnimate(controls, renderer, scene, camera, interactions, clock, location) {
  const raycaster = new THREE.Raycaster();
  let intersected = false;
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
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    location.update(delta);
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
  const interactions = setupInteractions();
  setupLights(scene, camera);
  setupSky(scene);
  // setupGlobe(scene);
  setupSphere(scene);
  setupLocation(scene, (location) => {
    setupResize(camera, renderer);
    setupAnimate(controls, renderer, scene, camera, interactions, clock, location);
  });
}

setup();
