import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';
import { AbsolutePosition } from '../behavior';
import { Behavior } from '../behavior/Behavior';
import { Age } from '../behavior/behaviors/Age';

const initializeThreeObject = new Behavior() //
	.init(() => {
		const cube: THREE.Mesh<any, any> = new THREE.Mesh(
			new RoundedBoxGeometry(1, 1, 1, 6, 0.2).translate(0, 0, 0.5),
			new THREE.MeshStandardMaterial({ color: '#ff8f87', roughness: 0.2 })
		);
		cube.castShadow = true;
		cube.receiveShadow = false;

		return { object: cube };
	});

export const Entity = new Behavior() //
	.use(Age)
	.use(initializeThreeObject)
	// .use(RelativePosition) @TODO fix this
	// .init((state) => {
	// 	const parent = undefined as LiveEntity<any, any> | undefined;
	// 	return {
	// 		position: new THREE.Vector3(),
	// 		parent: parent,
	// 		children: new EntityList(),
	// 		object: state.object || new THREE.Object3D()
	// 	};
	// })
	// .tick((state) => {
	// 	if (state.parent) {
	// 		const newPosition = new THREE.Vector3()
	// 			.copy(state.parent.state.position)
	// 			.add(state.position);
	// 		state.object.position.copy(newPosition);
	// 	} else {
	// 		state.object.position.copy(state.position);
	// 	}
	// })
	// .action({
	// 	addChild: (state, child: LiveEntity<any, any>) => {
	// 		state.children.push(child);
	// 		return { state };
	// 	},
	// 	removeChild: (state, child: LiveEntity<any, any>) => {
	// 		state.children.remove(child);
	// 		return { state };
	// 	},
	// 	setParent: (state, parent: LiveEntity<any, any>) => {
	// 		const newState = state;
	// 		newState.parent = parent;
	// 		return { state: newState };
	// 	}
	// })
	.use(AbsolutePosition);
