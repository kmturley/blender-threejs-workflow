import { Scene } from './Scene';
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

export class Parallax extends Scene {

  constructor(options) {
    options = options || {};
    options.camera = {
      fov: 45,
      near: 1,
      far: 15000,
      position: {
        x: -10205,
        y: 2000,
        z: -4071
      },
      positionEnd: {
        y: 600
      },
      rotation: {
        x: -3,
        y: -1,
        z: -3
      }
    };
    super(options);
    console.log('Parallax', this);

    this.interactions = this.setupInteractions(this.camera, this.controls);
    this.addModel('./models/castle.gltf', 1);

    this.animating = true;
    window.setTimeout(() => {
      const cameraCoords = {
        x: this.camera.position.x,
        y : this.options.camera.positionEnd.y,
        z : this.camera.position.z
      };
      this.cameraZoom(cameraCoords, null, 3000, () => {
        this.animating = false;
      });
    }, 1000);
  }

  setupInteractions(camera) {
    document.addEventListener('scroll', (e) => {
      if (this.animating === false) {
        camera.position.y = this.options.camera.positionEnd.y - (window.scrollY / 2);
      }
    }, {passive: false});
  }
}
