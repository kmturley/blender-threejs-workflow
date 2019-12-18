import { Scene } from './Scene';
import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

export class Globe extends Scene {
  intersected = null;
  labels = [];
  highlights = [];
  options = {
    id: 'scene',
    earth: {
      heightSegments: 20,
      radius: 150,
      texture: './textures/earth.jpg',
      widthSegments: 20
    },
    sky: './textures/space.jpg'
  }

  constructor(options) {
    options = options || {};
    options.controls = {
      autoRotate: true,
      enableDamping: true,
      maxDistance: 1000,
      minDistance: 200,
      type: 'OrbitControls',
      zoomSpeed: .2,
    };
    super(options);
    console.log('Example', this.options);

    this.interactions = this.setupInteractions(this.camera, this.controls);
    this.onAnimate = (camera) => {
      this.updateHighlights(camera);
      this.updateLabels(camera);
    };
    this.setupSky(this.scene, this.options.sky);
    this.setupEarth(this.scene, this.options.earth);
    this.addModel('./models/monkey.gltf', 30, (model) => {
      this.addHighlight(model);
      this.addGlobeModel(model, 'Monkey', this.options.earth);
    });
    this.addModel('https://threejs.org/examples/models/gltf/LittlestTokyo.glb', .2, (model) => {
      this.addHighlight(model);
      this.addGlobeModel(model, 'House', this.options.earth, 35);
    });
  }

  setupInteractions(camera, controls) {
    const el = this.getEl().firstChild;
    const vector = new THREE.Vector2();
    let isDragging = false;
    this.addEvents(el, ['mousedown', 'touchstart'], (event) => {
      event.preventDefault();
      isDragging = false;
    });
    this.addEvents(el, ['mousemove', 'touchmove'], (event) => {
      event.preventDefault();
      isDragging = true;
      if (event.targetTouches) {
        vector.x = (event.targetTouches[0].pageX / window.innerWidth) * 2 - 1;
        vector.y = - (event.targetTouches[0].pageY / window.innerHeight) * 2 + 1;
      } else {
        vector.x = (event.clientX / window.innerWidth) * 2 - 1;
        vector.y = - (event.clientY / window.innerHeight) * 2 + 1;
      }
    });
    this.addEvents(el, ['mouseup', 'touchcancel', 'touchend'], (event) => {
      if (isDragging) {
        isDragging = false;
        return;
      }
      event.preventDefault();
      if (this.intersected) {
        console.log('intersected', this.intersected);
        this.zoomCameraWithTransition(camera, controls, this.intersected);
      } else {
        this.zoomCameraWithTransition(camera, controls, this.scene, 1.5);
      }
    });
    return vector;
  }

  setupSky(scene, sky) {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([sky, sky, sky, sky, sky, sky]);
    scene.background = texture;
    return scene.background;
  }

  setupEarth(scene, options) {
    const loader = new THREE.TextureLoader();
    const sphere = new THREE.SphereGeometry(options.radius, options.widthSegments, options.heightSegments);
    let mesh;
    loader.load(options.texture, (texture) => {
      const material = new THREE.MeshBasicMaterial({map: texture});
      mesh = new THREE.Mesh(sphere, material);
      scene.add(mesh);
    });
    return mesh;
  }

  randomRotation() {
    return Math.random() * 360;
  }

  addGlobeModel(model, text, options, offset = 0) {
    console.log('addGlobeModel', model);
    const stick = new THREE.Object3D();
    model.position.set(0, options.radius + offset, 0);
    stick.add(model);
    const box = new THREE.Box3().setFromObject(model);
    const el = this.addGlobeLabel(text);
    const obj = new CSS2DObject(el);
    obj.position.set(model.position.x, model.position.y + (box.getSize().y - offset + 10), model.position.z);
    this.labels.push(obj);
    stick.add(obj);
    stick.rotation.set(this.randomRotation(), this.randomRotation(), this.randomRotation());
    this.scene.add(stick);
  }

  addGlobeLabel(text) {
    const el = document.createElement('a');
    el.className = 'label';
    el.setAttribute('href', 'parallax.html');
    el.textContent = text + ' >';
    return el;
  }

  addHighlight(model) {
    this.highlights.push(model);
  }

  updateLabels() {
    this.labels.forEach((label) => {
      let className = 'label';
      const position = this.toScreenPosition(label);
      if (position.left) {
        className += ' label-left';
      } else {
        className += ' label-right';
      }
      if (position.top) {
        className += ' label-top';
      } else {
        className += ' label-bottom';
      }
      if (label.element.className !== className) {
        label.element.className = className;
      }
    });
  }

  toScreenPosition(obj) {
    const vector = new THREE.Vector3();
    const widthHalf = 0.5 * this.renderer3d.getContext().canvas.width;
    const heightHalf = 0.5 * this.renderer3d.getContext().canvas.height;
    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(this.camera);
    vector.x = (vector.x * widthHalf) + widthHalf;
    vector.y = - (vector.y * heightHalf) + heightHalf;
    return { 
      x: vector.x,
      y: vector.y,
      left: vector.x > widthHalf,
      top: vector.y > heightHalf
    };
  }

  updateHighlights(camera) {
    this.raycaster.setFromCamera(this.interactions, camera);
    var intersects = this.raycaster.intersectObjects(this.highlights, true);
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
  }

  zoomCameraWithTransition(camera, controls, model, fitOffset = 1.2) {
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter();
    const size = box.getSize();
    const maxSize = Math.max(size.x, size.y, size.z);
    const fitHeightDistance = maxSize / (2 * Math.atan(Math.PI * camera.fov / 360));
    const fitWidthDistance = fitHeightDistance / camera.aspect;
    const distance = fitOffset * Math.max(fitHeightDistance, fitWidthDistance);
    const cameraCoords = {
      x: center.x,
      y : center.y,
      z : center.z + distance
    };
    console.log('zoomCameraWithTransition', center, cameraCoords);
    this.zoomTo(cameraCoords, center, 1000);
  }
}
