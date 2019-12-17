import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class Scene {
  animations = [];
  options = {
    id: 'scene',
    camera: {
      fov: 45,
      near: 1, 
      far: 10000,
      x: 0,
      y: 0,
      z: 600
    },
    controls: {
      autoRotate: true,
      enableDamping: true,
      maxDistance: 1000,
      minDistance: 200,
      type: 'OrbitControls',
      zoomSpeed: .2,
    },
    loader: {
      decoder: 'https://threejs.org/examples/js/libs/draco/gltf/',
    },
    renderer: {
      antialias: true
    }
  }

  constructor(options) {
    this.options = {...this.options, ...options};
    console.log('Scene', this.options);
    this.renderer2d = this.setupRenderer2d(this.options.renderer);
    this.renderer3d = this.setupRenderer3d(this.options.renderer);
    this.camera = this.setupCamera(this.options.camera);
    this.controls = this.setupControls(this.options.controls, this.camera, this.renderer2d);
    this.scene = this.setupScene(this.camera);
    this.loader = this.setupLoader(this.options.loader);
    this.setupLights(this.scene, this.camera);
    this.setupResize(this.camera, this.renderer2d, this.renderer3d);
    this.setupAnimate(this.controls, this.renderer3d, this.renderer2d, this.scene, this.camera, this.options.onAnimate);
  }

  getEl() {
    return document.getElementById(this.options.id);
  }

  setupRenderer2d(options) {
    const renderer = new CSS2DRenderer({antialias: options.antialias});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.className = 'scene2d';
    this.getEl().appendChild(renderer.domElement);
    return renderer;
  }

  setupRenderer3d(options) {
    const renderer = new THREE.WebGLRenderer({antialias: options.antialias});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.className = 'scene3d';
    this.getEl().appendChild(renderer.domElement);
    return renderer;
  }

  setupCamera(options) {
    const camera = new THREE.PerspectiveCamera(options.fov, window.innerWidth / window.innerHeight, options.near, options.far);
    camera.position.set(options.x, options.y, options.z);
    return camera;
  }

  setupControls(options, camera, renderer) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = options.autoRotate;
    controls.enableDamping = options.enableDamping;
    controls.minDistance = options.minDistance;
    controls.maxDistance = options.maxDistance;
    controls.zoomSpeed = options.zoomSpeed;
    return controls;
  }

  setupScene(camera) {
    const scene = new THREE.Scene();
    scene.add(camera);
    return scene;
  }

  setupLights(scene, camera) {
    const ambient = new THREE.AmbientLight(0x404040);
    scene.add(ambient);
    const point = new THREE.PointLight(0xffffff, 1);
    point.position.copy(camera.position);
    scene.add(point);
    return [point, ambient];
  }

  setupResize(camera, renderer2d, renderer3d) {
    this.addEvents(window, ['resize', 'rotate'], () => {
      if (window.innerWidth !== this.previousWidth) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer2d.setSize(window.innerWidth, window.innerHeight);
        renderer3d.setSize(window.innerWidth, window.innerHeight);
        this.previousWidth = window.innerWidth;
      }
    });
  }

  setupAnimate(controls, renderer, renderer2D, scene, camera) {
    const clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();

    const animate = () => {
      TWEEN.update();
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      this.animations.forEach((animation) => {
        animation.update(delta);
      });
      controls.update(delta);
      if (this.onAnimate) {
        this.onAnimate(camera);
      }
      renderer.render(scene, camera);
      renderer2D.render(scene, camera);
    };
    animate();
  }

  setupLoader(options) {
    const loader = new GLTFLoader();
    if (options.decoder) {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath(options.decoder);
      loader.setDRACOLoader(dracoLoader);
    }
    return loader;
  }

  addAnimation(model, gltf) {
    let mixer = new THREE.AnimationMixer(model);
    mixer.clipAction(gltf.animations[0]).play();
    this.animations.push(mixer);
    return mixer;
  }

  addEvents(el, events, callback) {
    events.forEach((event) => {
      el.addEventListener(event, callback, {passive: false});
    });
  }

  addModel(path, scale = 1, callback) {
    console.log('addModel', path, scale);
    this.loader.load(path, (gltf) => {
      console.log('addModel.load', gltf);
      gltf.scene.scale.set(scale, scale, scale);
      if (gltf.animations) {
        this.addAnimation(gltf.scene, gltf);
      }
      // if (gltf.cameras) {
      //   base.addCamera(gltf.cameras[0]);
      // }
      if (callback) {
        callback(gltf.scene);
      } else {
        this.scene.add(gltf.scene);
      }
    });
  }

  zoomTo(cameraPos, controlsPos, duration) {
    const cameraAnim = new TWEEN.Tween(this.camera.position).to(cameraPos, duration).easing(TWEEN.Easing.Quadratic.InOut).start();
    const controlsAnim = new TWEEN.Tween(this.controls.target).to(controlsPos, duration).easing(TWEEN.Easing.Quadratic.InOut).start();
  }
}
