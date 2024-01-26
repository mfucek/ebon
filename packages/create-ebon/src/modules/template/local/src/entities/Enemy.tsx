import * as THREE from 'three';

import {
	ApplyTransformToObject,
	Behavior,
	Delta,
	InterfaceAnchored,
	MeshObject,
	Transform
} from 'ebon';
import { Tooltip } from 'ui/Tooltip';
import { playerRef } from '../game';

const spawnRange = 10;
export const Enemy = new Behavior() //
	.use(Delta)
	.use(Transform)
	.use(MeshObject)
	.use(ApplyTransformToObject)
	.use(InterfaceAnchored(<Tooltip text="Zombie" />))
	.init(({ position }) => {
		const playerPosition = playerRef.state.position.clone();
		playerPosition.z = 0;

		const angle = Math.random() * Math.PI * 2;
		const randomOffsetVector = new THREE.Vector3().set(
			spawnRange * Math.cos(angle),
			spawnRange * Math.sin(angle),
			0
		);

		position.copy(playerPosition.add(randomOffsetVector));
		return {
			speed: Math.random() * 2 + 4
		};
	})
	.tick(({ position, velocity, speed }) => {
		const playerPosition = playerRef.state.position.clone();
		let direction = new THREE.Vector3(
			playerPosition.x - position.x,
			playerPosition.y - position.y,
			0
		);
		direction = rotateVectorZ(direction, Math.PI / direction.length());

		velocity.copy(direction.clone().normalize().multiplyScalar(speed));

		// if (direction.length() <= 1) {
		// 	// console.log('push');
		// 	playerRef.actions.push(
		// 		direction.normalize().multiplyScalar(2000000),
		// 		250
		// 	);
		// }
	});

const rotateVectorZ = (_vector: THREE.Vector3, angle: number) => {
	const vector = _vector.clone();
	const x = vector.x * Math.cos(angle) - vector.y * Math.sin(angle);
	const y = vector.x * Math.sin(angle) + vector.y * Math.cos(angle);
	vector.x = x;
	vector.y = y;
	return vector;
};
