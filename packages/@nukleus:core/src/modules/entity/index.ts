import { Object3D } from 'three';

type Callback<T extends {}, P extends {}> = (a: T) => P;

type State = {
	[key: string]: any;
};

type InitialState = {
	entity: Object3D;
};

class Entity<T extends InitialState> {
	state: T = {
		entity: new Object3D()
	} as T;

	// state: T = {};

	initCallbacks: Callback<T, T>[] = [];
	tickCallbacks: Callback<T, T>[] = [];

	init = <P extends {}>(n: Callback<T, P>): Entity<T & P> => {
		this.state = { ...this.state };
		return this as unknown as Entity<T & P>;
	};

	tick = <P extends {}>(n: Callback<T, P>): Entity<T & P> => {
		this.state = { ...this.state };
		return this as unknown as Entity<T & P>;
	};

	createInstance = () => {
		console.log('executing all');
		this.initCallbacks.forEach((callback) => {
			const returnedState = callback(this.state);
			this.state = { ...this.state, returnedState };
			console.log('state now is: ', this.state);
		});
	};

	executeTick = (delta: number) => {
		this.tickCallbacks.forEach((callback) => {
			const returnedState = callback(this.state);
			this.state = { ...this.state, returnedState };
		});
	};
}

export { Entity };
