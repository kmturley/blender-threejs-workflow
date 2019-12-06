import './index.scss';
import { Base } from './components/Base';
import { Globe } from './components/Globe';
import { Model } from './components/Model';

const base = new Base({
  id: 'scene'
});

const globe = new Globe(base, {
  radius: 150,
  sky: './textures/space.jpg'
});

const monkey = new Model(base, globe, {
  path: './models/monkey.gltf',
  scale: 30
});

const house = new Model(base, globe, {
  decoder: 'https://threejs.org/examples/js/libs/draco/gltf/',
  path: 'https://threejs.org/examples/models/gltf/LittlestTokyo.glb',
  offset: 35,
  scale: .2
});
