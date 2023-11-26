import { Entity, Nukleus, Scene } from '@nukleus/core';

console.clear();

const nukleus = new Nukleus();

// Entity

const Common = new Entity<{
	counter: number;
	delta: number; // this will be resolved when time is implemented as a behaviour
}>()
	.init((state) => {
		console.error('init c1', state);
		const { counter } = state;
		return { counter: counter + 10000 };
	})
	.init((state) => {
		console.error('init c2', state);
		const { counter } = state;
		return { counter: counter + 10000 };
	})
	.tick((state) => {
		console.error('tick c1', state);
		const { counter } = state;
		return { counter: counter + 1000 };
	})
	.tick((state) => {
		console.error('tick c2', state);
		const { counter } = state;
		return { counter: counter + 1000 };
	});

const Skeleton = new Entity<{ Acounter: number; delta: number }>()
	.init((state) => {
		console.log('init s1', state);
		return { counter: 10 };
	})
	.init((state) => {
		console.log('init s2', state);
		const { counter } = state;
		return { counter: counter + 10 };
	})
	.tick((state) => {
		console.log('tick s1', state);
		const { counter } = state;
		return { counter: counter + 1, name: 'MARKO' };
	})
	.use(Common)
	.tick((state) => {
		console.log('tick s2', state);
		const { counter } = state;
		return { counter: counter + 1 };
	})
	.tick((state) => {
		console.log('tick s3 (final state)', state);
		return state;
	});

// Scene
const scene = new Scene();

scene.addEntity(Skeleton.create({ Acounter: 54 }));
// scene.addEntity(Zombie.create());

scene.tick(1);
scene.tick(2);

// scene.tick(2);

// scene.tick(2);

// const interval = setInterval(() => {
// 	Skeleton.executeTick(1);
// }, 2000);

export { nukleus as game };