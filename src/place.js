import './index.scss';
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { FlyControls } from 'three/examples/jsm/controls/FlyControls';

// import { Model } from './components/Model';

// export class Place {
//   animating = false;
//   animations = [];
//   options = {};
//   cameraAnim = {
//     start: 2000,
//     end: 600
//   };
//   previousWidth = window.innerWidth;
//   constructor(options) {
//     console.log('Place', this);
//     this.options = {...this.options, ...options};
//     this.renderer3d = this.setupRenderer3d(options.id);
//     this.camera = this.setupCamera(-10205, this.cameraAnim.start, -4071);
//     // this.controls = this.setupControls(this.camera, this.renderer3d);
//     this.scene = this.setupScene(this.camera);
//     this.interactions = this.setupInteractions(this.camera, this.controls);
//     this.setupLights(this.scene, this.camera);
//     this.setupResize(this.renderer3d, this.camera, this.renderer3d);
//     this.setupAnimate(this.controls, this.renderer3d, this.scene, this.camera);

//     this.animating = true;
//     window.setTimeout(() => {
//       this.zoomCameraWithTransition(this.camera, this.cameraAnim.end, 3000);
//     }, 1000);
//   }

//   setupRenderer3d(id) {
//     const el = document.getElementById(id);
//     const renderer = new THREE.WebGLRenderer({antialias: true});
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.domElement.className = 'scene3d';
//     el.appendChild(renderer.domElement);
//     return renderer;
//   }

//   setupCamera(x, y, z) {
//     const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 20000);
//     camera.position.set(x, y, z);
//     camera.rotation.set(-3, -1, -3);
//     // camera.rotation.set(-3.6, -107, 0);
//     return camera;
//   }

//   setupControls(camera, renderer) {
//     const controls = new FlyControls(camera, renderer.domElement);
//     controls.movementSpeed = 200;
//     controls.domElement = renderer.domElement;
//     controls.rollSpeed = Math.PI / 24;
//     controls.autoForward = false;
//     controls.dragToLook = false;
//     return controls;
//   }

//   setupLights(scene, camera) {
//     const ambient = new THREE.AmbientLight(0x404040);
//     scene.add(ambient);
//     const point = new THREE.PointLight(0xffffff, 1);
//     point.position.copy(camera.position);
//     scene.add(point);
//     return [point, ambient];
//   }

//   setupScene(camera) {
//     const scene = new THREE.Scene();
//     scene.add(camera);
//     return scene;
//   }

//   setupResize(renderer, camera, renderer3d) {
//     this.addEvents(window, ['resize', 'rotate'], () => {
//       if (window.innerWidth !== this.previousWidth) {
//         camera.aspect = window.innerWidth / window.innerHeight;
//         camera.updateProjectionMatrix();
//         renderer3d.setSize(window.innerWidth, window.innerHeight);
//         this.previousWidth = window.innerWidth;
//       }
//     });
//   }

//   addEvents(el, events, callback) {
//     events.forEach((event) => {
//       el.addEventListener(event, callback, {passive: false});
//     });
//   }

//   setupInteractions(camera) {
//     document.addEventListener('scroll', (e) => {
//       if (this.animating === false) {
//         camera.position.y = this.cameraAnim.end - (window.scrollY / 2);
//       }
//     }, {passive: false});
//   }

//   zoomCameraWithTransition(camera, yPos, speed) {
//     const cameraCoords = {
//       x: camera.position.x,
//       y : yPos,
//       z : camera.position.z
//     };
//     const cameraAnim = new TWEEN.Tween(camera.position)
//       .to(cameraCoords, speed)
//       .easing(TWEEN.Easing.Quadratic.InOut)
//       .start()
//       .onComplete(() => {
//         console.log('camera animation finish');
//         this.animating = false;
//       });
//   }

//   setupAnimate(controls, renderer, scene, camera) {
//     const clock = new THREE.Clock();
//     this.raycaster = new THREE.Raycaster();

//     const animate = () => {
//       TWEEN.update();
//       requestAnimationFrame(animate);
//       const delta = clock.getDelta();
//       this.animations.forEach((animation) => {
//         animation.update(delta);
//       });
//       if (controls) {
//         controls.update(delta);
//       }
//       // this.updateVectors(scene, interactions, camera);
//       renderer.render(scene, camera);
//       // console.log(camera.rotation);
//     };
//     animate();
//   }

//   addAnimation(model, gltf) {
//     let mixer = new THREE.AnimationMixer(model);
//     mixer.clipAction(gltf.animations[0]).play();
//     this.animations.push(mixer);
//     return mixer;
//   }
// }

// export class Ground {
//   options = {};
//   constructor(base, options) {
//     console.log('Ground', this);
//     this.base = base;
//     this.options = {...this.options, ...options};
//     // this.addCube();
//     // this.addGround();
//   }

//   addCube() {
//     var geometry = new THREE.BoxGeometry( 1, 1, 1 );
//     var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
//     var cube = new THREE.Mesh( geometry, material );
//     cube.scale.set(200, 200, 200);
//     this.base.scene.add( cube );
//   }

//   addGround() {
//     const geo = new THREE.PlaneBufferGeometry(2000, 2000, 8, 8);
//     const mat = new THREE.MeshBasicMaterial({ color: 0xffcc00, side: THREE.DoubleSide });
//     const plane = new THREE.Mesh(geo, mat);
//     plane.rotateX( - Math.PI / 2);
//     this.base.scene.add(plane);
//   }

//   addModel(model) {
//     this.base.scene.add(model);
//   }
// }

// const base = new Place({
//   id: 'place'
// });

// const ground = new Ground(base);

// // const house = new Model(base, ground, {
// //   decoder: 'https://threejs.org/examples/js/libs/draco/gltf/',
// //   name: 'House',
// //   offset: 35,
// //   path: 'https://threejs.org/examples/models/gltf/LittlestTokyo.glb',
// //   selectable: true,
// //   scale: .8
// // });

// const castle = new Model(base, ground, {
//   name: 'Castle',
//   path: './models/v4/GFG_scene_castle.gltf',
//   scale: 1
// });

const clock = new THREE.Clock();
const scene = new THREE.Scene();
let camera;
let model;
let animations = [];
// var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 15000);
// camera.position.set(0, 0, 4000);
// camera.rotation.set(-3, -1, -3);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.className = 'scene3d';
document.getElementById('place').appendChild(renderer.domElement);

var loader = new GLTFLoader();
loader.load('./models/v4/GFG_scene_castle.gltf', (gltf) => {
  console.log('add', gltf);
  // gltf.scene.scale.set(.1, .1, .1);
  loadElements(gltf);
});

function loadElements(file) {
  if (file.scene) {
    model = file.scene;
    console.log('model', model);
    scene.add(model);
  }
  if (file.animations) {
    let mixer = new THREE.AnimationMixer(file.scene);
    mixer.clipAction(file.animations[0]).play();
    animations.push(mixer);
  }
  if (file.cameras) {
    camera = file.cameras[0];
    console.log('camera', camera);
    scene.add(camera);
  }
  const ambient = new THREE.AmbientLight(0x404040);
  scene.add(ambient);

  const point = new THREE.PointLight(0xffffff, 1);
  point.position.copy(camera.position);
  scene.add(point);
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  animations.forEach((animation) => {
    animation.update(delta);
  });
  if (camera) {
    renderer.render(scene, camera);
  }
}
animate();
