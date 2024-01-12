import { ThreeObject } from '@/lib/three/behaviors/ThreeObject';
import { EntityList } from '@/modules/entity/EntityList';
import { LiveEntity } from '@/modules/entity/LiveEntity';
import * as THREE from 'three';
import { Behavior, GetState } from '../Behavior';

import { Position } from './Position';
import { Translation } from './Translation';

export const RelativePosition = new Behavior() //
	.require(ThreeObject)
	.use(Translation)
	.init<{
		parent: LiveEntity<GetState<typeof Position>, any> | null;
		children: EntityList;
	}>(() => {
		return {
			parent: null,
			children: new EntityList()
		};
	})
	.tick(({ parent, position, object }) => {
		if (parent) {
			const newPosition = new THREE.Vector3()
				.copy(parent.state.position)
				.add(position);
			object.position.copy(newPosition);
		} else {
			object.position.copy(position);
		}
	})
	.action({
		addChild: (state, child: LiveEntity<any, any>) => {
			state.children.push(child);
			return { state };
		},
		removeChild: (state, child: LiveEntity<any, any>) => {
			state.children.remove(child);
			return { state };
		},
		setParent: (state, parent: LiveEntity<any, any>) => {
			console.log('setParent', parent);
			const newState = state;
			state.parent = parent;
			return { state };
			// return { state: { ...state, parent: parent } };
		},
		unparent: (state, keepRelativePosition?: boolean) => {
			state.parent = null;
			if (keepRelativePosition) {
				state.position = new THREE.Vector3().copy(state.object.position);
			}
			return { state };
		}
	});
