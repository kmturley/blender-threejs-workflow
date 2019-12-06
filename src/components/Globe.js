import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

export class Globe {
  options = {};
  constructor(base, options) {
    console.log('Globe', this);
    this.options = {...this.options, ...options};
    this.base = base;
    this.sky = this.setupSky(base, options.sky);
    this.earth = this.setupEarth(base, options.earth);
  }

  setupSky(base, sky) {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([sky, sky, sky, sky, sky, sky]);
    base.scene.background = texture;
    return base.scene.background;
  }

  setupSkyStatic(base, sky) {
    const loader = new THREE.TextureLoader();
    loader.load(sky, (texture) => {
      base.scene.background = texture;
    });
    return base.scene.background;
  }

  setupEarth(base, earth) {
    const loader = new THREE.TextureLoader();
    loader.load(earth, (texture) => {
      const sphere = new THREE.SphereGeometry(this.options.radius, 20, 20);
      const material = new THREE.MeshBasicMaterial({map: texture});
      const mesh = new THREE.Mesh(sphere, material);
      base.scene.add(mesh);
    });
    return earth;
  }

  setupEarthSimple(base) {
    const geometry = new THREE.SphereBufferGeometry(this.options.radius, 12, 9);
    const material = new THREE.MeshPhongMaterial({
      flatShading: true,
      color: 0x0000ff,
    });
    const mesh = new THREE.Mesh(geometry, material);
    base.scene.add(mesh);
    return mesh;
  }

  randomRotation() {
    return Math.random() * 360;
  }

  addModel(model, text, offset = 0) {
    const stick = new THREE.Object3D();
    model.position.set(0, this.options.radius + offset, 0);
    stick.add(model);
    this.addLabel(model, stick, text);
    stick.rotation.set(this.randomRotation(), this.randomRotation(), this.randomRotation());
    this.base.scene.add(stick);
  }

  addLabel(model, stick, text) {
    const el = document.createElement('div');
    el.className = 'label';
    el.textContent = text;
    const obj = new CSS2DObject(el);
    obj.position.set(model.position.x, model.position.y + 60, model.position.z);
    stick.add(obj);
  }
}
