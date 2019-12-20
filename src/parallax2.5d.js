import './index.scss';

import { Parallax } from './components/Parallax';

const parallax = new Parallax({
  camera: {
    fov: 45,
    near: 1,
    far: 15000,
    position: {
      x: 0,
      y: 80,
      z: 200
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0
    }
  },
  model: {
    path: './models/terrain.gltf',
    scale: 20
  },
  ratio: 15
});
