import './index.scss';

import { Parallax } from './components/Parallax';

const parallax = new Parallax({
  camera: {
    fov: 45,
    near: 1,
    far: 15000,
    position: {
      x: -10205,
      y: 1000,
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
  },
  model: {
    path: './models/castle.gltf',
    scale: 1
  },
  ratio: 2
});
