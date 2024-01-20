import { Entity, Scene } from 'ebon';
import * as THREE from 'three';
import { Dummy } from './entities/Dummy';
import { MainCamera } from './entities/MainCamera';
import { Player } from './entities/Player';
import { ebon } from './lib/ebon/ebon';

console.clear();

const game = ebon;

// Floor
const Floor = Entity.init(({ object }) => {
	const plane = new THREE.Mesh(
		new THREE.CircleGeometry(4, 64),
		new THREE.MeshPhongMaterial({
			color: '#222222'
		})
	);
	plane.receiveShadow = true;
	plane.castShadow = false;
	return { object: plane };
});

// Scene
const scene = new Scene();
scene.makeActive(game);

export const playerRef = Player.create(scene);
Floor.create(scene);

export const dummyRef = Dummy.create(scene);

MainCamera.create(scene);

export { game };
