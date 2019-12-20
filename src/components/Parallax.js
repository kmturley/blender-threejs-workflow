import { Scene } from './Scene';
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

export class Parallax extends Scene {

  constructor(options) {
    super(options);
    console.log('Parallax', this);

    this.interactions = this.setupInteractions(this.camera, this.controls);
    this.addModel(options.model.path, options.model.scale);

    if (this.options.camera.positionEnd && this.options.camera.positionEnd.y !== this.options.camera.position.y) {
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
    } else {
      this.animating = false;
    }
  }

  setupInteractions(camera) {
    const startY = this.options.camera.positionEnd ? this.options.camera.positionEnd.y : this.options.camera.position.y;
    document.addEventListener('scroll', (e) => {
      if (this.animating === false) {
        camera.position.y = startY - (window.scrollY / this.options.ratio);
      }
    }, {passive: false});
  }
}
