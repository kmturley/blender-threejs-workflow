import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class Base {
  animations = [];
  intersected = null;
  options = {};
  constructor(options) {
    console.log('Base', this);
    this.options = {...this.options, ...options};
    this.clock = new THREE.Clock();
    this.renderer = this.setupRenderer(options.id);
    this.camera = this.setupCamera();
    this.controls = this.setupControls(this.camera, this.renderer);
    this.scene = this.setupScene(this.camera);
    this.interactions = this.setupInteractions(this.camera, this.controls, this.sphere);
    this.setupLights(this.scene, this.camera);
    this.setupResize(this.camera, this.renderer);
    this.setupAnimate(this.controls, this.renderer, this.scene, this.camera, this.interactions, this.clock);
  }

  setupRenderer(id) {
    const el = document.getElementById(id);
    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    el.appendChild(renderer.domElement);
    return renderer;
  }

  setupCamera() {
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 0, 600);
    return camera;
  }

  setupControls(camera, renderer) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.enableDamping = true;
    controls.minDistance = 200;
    controls.maxDistance = 1000;
    controls.zoomSpeed = .2;
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

  setupResize(camera, renderer) {
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  setupInteractions(camera, controls, globe) {
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
      if (this.intersected) {
        console.log('intersected', this.intersected);
        zoomCameraWithTransition(camera, controls, this.intersected);
      } else {
        zoomCameraWithTransition(camera, controls, globe, 1.5);
      }
    });
    return vector;
  }

  zoomCameraWithTransition(camera, controls, model, fitOffset = 1.2) {
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

  setupAnimate(controls, renderer, scene, camera, interactions, clock) {
    const raycaster = new THREE.Raycaster();
    const vectors = () => {
      raycaster.setFromCamera(interactions, camera);
      var intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0) {
        if (this.intersected != intersects[0].object) {
          if (this.intersected && this.intersected.material.emissive) {
            this.intersected.material.emissive.setHex(this.intersected.currentHex);
          }
          this.intersected = intersects[0].object;
          if (this.intersected && this.intersected.material.emissive) {
            this.intersected.currentHex = this.intersected.material.emissive.getHex();
            this.intersected.material.emissive.setHex(0xff0000);
          }
        }
      } else {
        if (this.intersected && this.intersected.material.emissive) {
          this.intersected.material.emissive.setHex(this.intersected.currentHex);
        }
        this.intersected = null;
      }
    };
    const animate = () => {
      TWEEN.update();
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      this.animations.forEach((animation) => {
        animation.update(delta);
      });
      controls.update(delta);
      vectors();
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
