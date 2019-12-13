import './index.scss';
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';

import { Model } from './components/Model';

export class Place {
  animations = [];
  options = {};

  constructor(options) {
    console.log('Place', this);
    this.options = {...this.options, ...options};
    this.renderer3d = this.setupRenderer3d(options.id);
    this.camera = this.setupCamera(0, 0, 600);
    // this.controls = this.setupControls(this.camera, this.renderer3d);
    this.scene = this.setupScene(this.camera);
    this.setupLights(this.scene, this.camera);
    this.setupResize(this.camera, this.renderer3d);
    this.setupAnimate(this.controls, this.renderer3d, this.scene, this.camera);
  }

  setupRenderer3d(id) {
    const el = document.getElementById(id);
    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.className = 'scene3d';
    el.appendChild(renderer.domElement);
    return renderer;
  }

  setupCamera(x, y, z) {
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(x, y, z);
    return camera;
  }

  setupControls(camera, renderer) {
    const controls = new FlyControls(camera, renderer.domElement);
    controls.movementSpeed = 200;
    controls.domElement = renderer.domElement;
    // controls.rollSpeed = Math.PI / 24;
    controls.autoForward = false;
    controls.dragToLook = false;
    return controls;
  }

  setupLights(scene, camera) {
    const ambient = new THREE.AmbientLight(0x404040);
    scene.add(ambient);
    const point = new THREE.PointLight(0xffffff, 1);
    point.position.copy(camera.position);
    scene.add(point);
    return [point, ambient];
  }

  setupScene(camera) {
    const scene = new THREE.Scene();
    scene.add(camera);
    return scene;
  }

  setupResize(camera, renderer3d) {
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer3d.setSize(window.innerWidth, window.innerHeight);
    });
  }

  setupAnimate(controls, renderer, scene, camera) {
    const clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();

    const animate = () => {
      TWEEN.update();
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      this.animations.forEach((animation) => {
        animation.update(delta);
      });
      // controls.update(delta);
      // this.updateVectors(scene, interactions, camera);
      renderer.render(scene, camera);
    };
    animate();
  }

  addAnimation(model, gltf) {
    let mixer = new THREE.AnimationMixer(model);
    mixer.clipAction(gltf.animations[0]).play();
    this.animations.push(mixer);
    return mixer;
  }
}

export class Ground {
  options = {};
  constructor(base, options) {
    console.log('Ground', this);
    this.base = base;
    this.options = {...this.options, ...options};
    // this.addCube();
    // this.addGround();
  }

  addCube() {
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    cube.scale.set(200, 200, 200);
    this.base.scene.add( cube );
  }

  addGround() {
    const geo = new THREE.PlaneBufferGeometry(2000, 2000, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffcc00, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(geo, mat);
    plane.rotateX( - Math.PI / 2);
    this.base.scene.add(plane);
  }

  addModel(model) {
    this.base.scene.add(model);
  }
}

const base = new Place({
  id: 'place'
});

const ground = new Ground(base);

const house = new Model(base, ground, {
  decoder: 'https://threejs.org/examples/js/libs/draco/gltf/',
  name: 'House',
  offset: 35,
  path: 'https://threejs.org/examples/models/gltf/LittlestTokyo.glb',
  selectable: true,
  scale: .5
});
