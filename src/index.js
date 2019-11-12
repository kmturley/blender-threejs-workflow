import './index.scss';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

var texture_bg = 'https://images.designtrends.com/wp-content/uploads/2015/12/17112023/outer-space-Texture.jpg';
var texture_globe = 'https://i.postimg.cc/nn74Bznd/earth.png';

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set(0, 0, 600);

var controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

var scene = new THREE.Scene();
scene.add(camera);

var loader = new THREE.TextureLoader();
loader.load(texture_bg, function(texture) {
  scene.background = texture;  
});

var pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.set(10, 50, 400);
scene.add(pointLight);

var globe = new THREE.Group();
scene.add(globe);

var loader2 = new THREE.TextureLoader();
loader2.load(texture_globe, function (texture) {
  var sphere = new THREE.SphereGeometry(200, 50, 50);
  var material = new THREE.MeshBasicMaterial({ map: texture, overdraw: 0.5 });
  var mesh = new THREE.Mesh(sphere, material);
  globe.add(mesh);
});

document.onkeydown = function(e) {
  e = e || window.event;
  e.preventDefault();
  if (e.keyCode == '38') {
    globe.rotation.x -= 0.2;
  }
  else if (e.keyCode == '40') {
    globe.rotation.x += 0.2;
  }
  else if (e.keyCode == '37') {
    globe.rotation.y -= 0.2;
  }
  else if (e.keyCode == '39') {
    globe.rotation.y += 0.2;
  }
}

window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

var animate = function() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};

animate();
