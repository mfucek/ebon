import { Entity, Nukleus, Scene } from '@nukleus/core';

console.clear();

const nukleus = new Nukleus();

// Entity

const Common = new Entity<{
	name: string;
	delta: number; // this will be resolved when time is implemented as a behaviour
}>()
	.init((state) => {
		console.warn(state);
		const { name } = state;
		// console.log(`[${name}]: Test common INIT setting test`);
		// add test property to state

		return { test: '42' };
	})
	.init((state) => {
		console.warn(state);
		const { test, name } = state;
		// console.log(`[${name}]: Test common INIT test:${test}`);

		return { test: test + '0' };
	})
	.tick((state) => {
		console.error(state);
		const { test, name } = state;
		// console.log(`[${name}]: Test common TICK test:${test}`);

		return {};
	});

const Skeleton = new Entity()
	.init((state) => {
		console.log(state);
		const name = 'Skeleton';
		const counter = 1;
		return { name, counter };
	})
	.use(Common)
	.init((state) => {
		const { name, test } = state;
		console.log(state);
		// console.log(`Boom! a ${name}. ${test}`);
		return {};
	})
	.tick((state) => {
		const { name, counter, delta } = state;
		console.log(state);
		const newCounter = counter + delta;
		// console.log(`[${name}]: I say ${newCounter}`);
		return { counter: newCounter };
	});

// const Zombie = new Entity()
// 	.init((state) => {
// 		const name = 'Zombie';
// 		const counter = 1;
// 		return { name, counter };
// 	})
// 	.use(Common)
// 	.init(({ name }) => {
// 		console.log(`Boom! a ${name}.`);
// 		return {};
// 	})
// 	.tick(({ counter, delta, name }) => {
// 		const newCounter = counter + delta;
// 		console.log(`[${name}]: I say ${newCounter}`);
// 		return { counter: newCounter };
// 	});

// Scene
const scene = new Scene();

scene.addEntity(Skeleton.create({ counter: 54 }));
// scene.addEntity(Zombie.create());

scene.tick(1);

scene.tick(2);

scene.tick(2);

// const interval = setInterval(() => {
// 	Skeleton.executeTick(1);
// }, 2000);

export { nukleus as game };
