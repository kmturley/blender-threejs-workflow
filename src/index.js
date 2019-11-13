import './index.scss';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function setupRenderer() {
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  return renderer;
}

function setupCamera() {
  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(0, 0, 600);
  return camera;
}

function setupControls(camera, renderer) {
  var controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  return controls;
}

function setupScene(camera) {
  var scene = new THREE.Scene();
  scene.add(camera);
  return scene;
}

function setupGlobe(scene) {
  var texture_bg = 'https://images.designtrends.com/wp-content/uploads/2015/12/17112023/outer-space-Texture.jpg';
  var texture_globe = 'https://i.postimg.cc/nn74Bznd/earth.png';
  // var model_globe = 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf';
  var model_globe = './models/earth.gltf';
  var model_scale = 3;

  var loader = new THREE.TextureLoader();
  loader.load(texture_bg, function (texture) {
    scene.background = texture;
  });

  var pointLight = new THREE.PointLight(0xFFFFFF, 1, 4000);
  pointLight.position.set(10, 500, 400);
  scene.add(pointLight);

  var globe = new THREE.Group();
  scene.add(globe);

  // Example using basic shapes.
  // var loader2 = new THREE.TextureLoader();
  // loader2.load(texture_globe, function (texture) {
  //   var sphere = new THREE.SphereGeometry(200, 50, 50);
  //   var material = new THREE.MeshBasicMaterial({ map: texture, overdraw: 0.5 });
  //   var mesh = new THREE.Mesh(sphere, material);
  //   globe.add(mesh);
  // });

  // Example using model file
  var loader3 = new GLTFLoader();
  loader3.load(model_globe, function (gltf) {
    globe.add(gltf.scene);
    globe.scale.set(model_scale, model_scale, model_scale);
  });

  return globe;
}

function setupKeyboard(globe) {
  document.onkeydown = function (e) {
    e = e || window.event;
    e.preventDefault();
    if (e.keyCode == '38') {
      globe.rotation.x -= 0.1;
    } else if (e.keyCode == '40') {
      globe.rotation.x += 0.1;
    } else if (e.keyCode == '37') {
      globe.rotation.y -= 0.1;
    } else if (e.keyCode == '39') {
      globe.rotation.y += 0.1;
    }
  }
}

function setupResize(camera, renderer) {
  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function setupAnimate(controls, renderer, scene, camera) {
  var animate = function () {
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
  setupKeyboard(globe);
  setupResize(camera, renderer);
  setupAnimate(controls, renderer, scene, camera);
}

setup();
