import { Object3D } from 'three';

// type Callback<I, R extends I> = (a: I) => R;
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

	init = <P>(n: Callback<T, P>): Entity<T & P> => {
		this.state = { ...this.state };
		return this as unknown as Entity<T & P>;
	};

	tick = <P>(n: Callback<T, P>): Entity<T & P> => {
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

// Entity

const Skeleton = new Entity()
	.init(() => {
		console.log('init first');
		const counter = 0;
		return { counter };
	})
	.init(({ counter }) => {
		console.log('init second');
		counter = 2;
		return { counter };
	})
	.tick(({ counter }) => {
		console.log('tick first');
		return { counter: counter + 1 };
	})
	.tick((state) => {
		console.log('tick second');
		console.log(state);
	});

// Scene

Skeleton.createInstance();

const interval = setInterval(() => {
	Skeleton.executeTick(1);
}, 2000);
