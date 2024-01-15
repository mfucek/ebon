import { LiveEntity } from '@/modules/entity/LiveEntity';
import * as THREE from 'three';
import { GetActions, GetState } from '..';
import { Behavior } from '../Behavior';
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
	// .use(Parent)
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
