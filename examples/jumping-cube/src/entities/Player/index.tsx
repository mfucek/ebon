import { Entity, InterfaceAnchored } from 'nukleus';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';
import { Jumping } from '../../Jumping';
import { Movement } from '../../behaviors/Movement';
import { dummyRef } from '../../nukleus';
import { Tooltip } from '../../ui/Tooltip';

// Player
export const Player = Entity.init(() => {
	// create cube
	const cube: THREE.Mesh<any, any> = new THREE.Mesh(
		new RoundedBoxGeometry(1, 1, 1, 6, 0.2).translate(0, 0, 0.5),
		new THREE.MeshStandardMaterial({ color: '#ff8f87', roughness: 0.2 })
	);
	cube.castShadow = true;
	cube.receiveShadow = false;

	return { object: cube };
})
	.use(Movement)
	.use(Jumping)
	.use(InterfaceAnchored(<Tooltip text="Player" />))
	.tick(({ keyboard, isJumping, age, object }) => {
		if (keyboard.interact) {
			dummyRef.actions.tickQuest();
		}
		if (keyboard.jump && !isJumping) {
			console.log('[Player]: I told the dummy to change color');
			const newColor = dummyRef.actions.tint();
			console.log('[Player]: I dummy said new color is: ' + newColor + '\n\n');

			return { isJumping: true, jumpStart: age };
		}
	});

export const Duje = Entity.init(() => {
	return { b: 5 };
})
	.init(() => {
		return {
			object: new THREE.Mesh(
				new THREE.BoxGeometry(1, 1, 1),
				new THREE.MeshBasicMaterial({ color: 'red' })
			)
		};
	})
	.tick(({ age, object }) => {
		object.position.z = Math.sin(age / 1000) * 2;
	})
	.action({
		foo: (state) => {
			console.log('foo');
			state.object.material.color.set('#00ff00');
			return { state };
		}
	});
