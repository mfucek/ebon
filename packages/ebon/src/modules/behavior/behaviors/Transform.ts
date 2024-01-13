import { LiveEntity } from '@/modules/entity/LiveEntity';
import * as THREE from 'three';
import { Behavior, GetActions, GetState } from '../Behavior';
import { Delta } from './Delta';

const Position = new Behavior() //
	.init(() => {
		return {
			position: new THREE.Vector3(),
			velocity: new THREE.Vector3(),
			acceleration: new THREE.Vector3(),
			friction: new THREE.Vector3()
		};
	});

const Rotation = new Behavior() //
	.init(() => {
		return {
			rotation: new THREE.Euler(),
			angularVelocity: new THREE.Euler(),
			angularAcceleration: new THREE.Euler(),
			angularFriction: new THREE.Euler()
		};
	});

const Scale = new Behavior() //
	.init(() => {
		return {
			scale: new THREE.Vector3(),
			scaleVelocity: new THREE.Vector3(),
			scaleAcceleration: new THREE.Vector3(),
			scaleFriction: new THREE.Vector3()
		};
	});

const Parent = new Behavior() //
	.require(Position)
	.init(() => {
		const newState = {
			parent: null
		} as {
			// parent: typeof Position | null;
			parent: LiveEntity<
				GetState<typeof Position>,
				GetActions<typeof Position>
			> | null;
		};
		return { ...newState };
	})
	.tick((state) => {
		state.parent;
	})
	.action({
		setParent: (
			state,
			parent: LiveEntity<GetState<typeof Position>, GetActions<typeof Position>>
		) => {
			return { state: { ...state, parent: parent } };
		},
		unparent: (state, keepRelativePosition?: boolean) => {
			const newState = state;
			return { state: { ...newState, parent: null } };
		}
	});

export const Transform = new Behavior() //
	.require(Delta)
	.use(Position)
	.use(Rotation)
	.use(Scale)
	.use(Parent)
	.tick((state) => {
		const {
			delta,
			position,
			velocity,
			acceleration,
			friction,
			rotation,
			angularVelocity,
			angularAcceleration,
			angularFriction,
			scale,
			scaleVelocity,
			scaleAcceleration,
			scaleFriction
		} = state;
	})
	.action({
		test: (state) => {
			return { state };
		}
	});

// 	import { ThreeObject } from '@/lib/three/behaviors/ThreeObject';
// import { EntityList } from '@/modules/entity/EntityList';
// import { LiveEntity } from '@/modules/entity/LiveEntity';
// import * as THREE from 'three';
// import { Behavior, GetState } from '../Behavior';

// import { Position } from './Position';
// import { Translation } from './Translation';

// export const RelativePosition = new Behavior() //
// 	.require(ThreeObject)
// 	.use(Translation)
// 	.init<{
// 		parent: LiveEntity<GetState<typeof Position>, any> | null;
// 		children: EntityList;
// 	}>(() => {
// 		return {
// 			parent: null,
// 			children: new EntityList()
// 		};
// 	})
// 	.tick(({ parent, position, object }) => {
// 		if (parent) {
// 			const newPosition = new THREE.Vector3()
// 				.copy(parent.state.position)
// 				.add(position);
// 			object.position.copy(newPosition);
// 		} else {
// 			object.position.copy(position);
// 		}
// 	})
// 	.action({
// 		test: (state, a: number) => {
// 			return { state, output: a };
// 		},
// 		addChild: (state, child: LiveEntity<any, any>) => {
// 			state.children.push(child);
// 			return { state };
// 		},
// 		removeChild: (state, child: LiveEntity<any, any>) => {
// 			state.children.remove(child);
// 			return { state };
// 		},
// 		setParent: (state, parent: LiveEntity<any, any>) => {
// 			console.log('setParent', parent);
// 			const newState = state;
// 			state.parent = parent;
// 			return { state };
// 			// return { state: { ...state, parent: parent } };
// 		},
// 		unparent: (state, keepRelativePosition?: boolean) => {
// 			state.parent = null;
// 			if (keepRelativePosition) {
// 				state.position = new THREE.Vector3().copy(state.object.position);
// 			}
// 			return { state };
// 		}
// 	});
