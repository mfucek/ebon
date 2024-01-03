import { Entity, Scene } from '@nukleus/core';
import * as THREE from 'three';
import { Dummy } from './entities/Dummy';
import { Player } from './entities/Player';
import { nukleus } from './lib/nukleus/nukleus';

console.clear();

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

scene.addEntity(Player);
scene.addEntity(Floor);
export const dummyRef = scene.addEntity(Dummy);

nukleus.setScene(scene);

const game = nukleus;

export { game };
