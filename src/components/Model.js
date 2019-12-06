import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class Model {
  options = {};
  constructor(base, globe, options) {
    console.log('Model', this);
    this.options = {...this.options, ...options};
    this.loader = new GLTFLoader();
    if (options.decoder) {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath(options.decoder);
      this.loader.setDRACOLoader(dracoLoader);
    }
    this.load(base, globe, options.path, options.scale, options.offset, options.selectable);
  }

  load(base, globe, path, scale, offset = 0, selectable = false) {
    this.loader.load(path, (gltf) => {
      gltf.scene.scale.set(scale, scale, scale);
      globe.addModel(gltf.scene, offset);
      if (selectable) {
        base.addSelectable(gltf.scene);
      }
      if (gltf.animations) {
        base.addAnimation(gltf.scene, gltf);
      }
    });
  }
}
