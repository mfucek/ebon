import { EmptyObject } from '@/lib/three/behaviors/EmptyObject';
import { LiveEntity } from '@/modules/entity/LiveEntity';
import * as THREE from 'three';
import { GetActions, GetState } from '..';
import { Behavior } from '../Behavior';
import { Delta } from './Delta';

export const Position = new Behavior() //
	.require(Delta)
	.init(() => {
		return {
			position: new THREE.Vector3(),
			velocity: new THREE.Vector3(),
			acceleration: new THREE.Vector3(),
			friction: new THREE.Vector3(),
			maxVelocity: new THREE.Vector3(Infinity, Infinity, Infinity)
		};
	})
	.tick((state) => {
		const { position, velocity, acceleration, delta, maxVelocity, friction } =
			state;

		const deltaSeconds = delta / 1000;

		velocity.add(acceleration.clone().multiplyScalar(deltaSeconds));

		velocity.y =
			Math.max(Math.abs(velocity.y) - friction.y * deltaSeconds, 0) *
			Math.sign(velocity.y);

		velocity.x =
			Math.max(Math.abs(velocity.x) - friction.x * deltaSeconds, 0) *
			Math.sign(velocity.x);

		velocity.clampLength(-maxVelocity.x, maxVelocity.x);

		position.add(velocity.clone().multiplyScalar(deltaSeconds));
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
	.require(EmptyObject)
	.use(Position)
	.use(Rotation)
	.use(Scale)
	// .use(Parent)
	.tick((state) => {
		const { position, object } = state;
		object.position.copy(position);
	});
