import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

export class Globe {
  options = {};
  constructor(base, options) {
    console.log('Globe', this);
    this.options = {...this.options, ...options};
    this.base = base;
    this.sky = this.setupSky(base, options.sky);
    this.sphere = this.setupSphere(base);
  }

  setupSky(base, sky) {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([sky, sky, sky, sky, sky, sky]);
    base.scene.background = texture;
    return base.scene.background;
  }

  setupSphere(base) {
    // Example using basic background
    // const loader = new THREE.TextureLoader();
    // loader.load(texture_bg, (texture) => {
    //   base.scene.background = texture;
    // });
  
    // Example using basic texture
    // const texture_globe = 'https://i.postimg.cc/nn74Bznd/earth.png';
    // const globe = new THREE.Group();
    // base.scene.add(globe);
    // const loader2 = new THREE.TextureLoader();
    // loader2.load(texture_globe, (texture) => {
    //   const sphere = new THREE.SphereGeometry(200, 50, 50);
    //   const material = new THREE.MeshBasicMaterial({map: texture});
    //   const mesh = new THREE.Mesh(sphere, material);
    //   globe.add(mesh);
    // });
    // return globe;
  
    // Example using flat shading
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
