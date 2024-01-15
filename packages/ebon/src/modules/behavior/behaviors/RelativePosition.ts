import { EntityList } from '@/modules/entity/EntityList';
import { LiveEntity } from '@/modules/entity/LiveEntity';
import * as THREE from 'three';
import { Behavior } from '../Behavior';

export const RelativePosition = new Behavior()
	// <
	// 	DefaultState & { object: { position: THREE.Vector3 } },
	// 	{}
	// > //
	.init((state) => {
		const parent = undefined as LiveEntity<any, any, any> | undefined;
		return {
			position: new THREE.Vector3(),
			parent: parent,
			children: new EntityList(),
			// @ts-ignore
			object: state.object || new THREE.Object3D()
		};
	})
	.tick((state) => {
		if (state.parent) {
			const newPosition = new THREE.Vector3()
				.copy(state.parent.state.position)
				.add(state.position);
			state.object.position.set(newPosition);
		} else {
			state.object.position.copy(state.position);
		}
	})
	.action({
		addChild: (state, child: LiveEntity<any, any, any>) => {
			state.children.push(child);
			return { state };
		},
		removeChild: (state, child: LiveEntity<any, any, any>) => {
			state.children.remove(child);
			return { state };
		},
		setParent: (state, parent: LiveEntity<any, any, any>) => {
			console.log('setParent');
			console.log('setParent', parent);
			const newState = state;
			state.parent = parent;
			return { state };
			// return { state: { ...state, parent: parent } };
		}
	});
