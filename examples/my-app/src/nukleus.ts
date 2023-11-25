import { Entity, Nukleus, Scene } from '@nukleus/core';

console.clear();

const nukleus = new Nukleus();

// Entity

const Skeleton = new Entity()
	.init((state) => {
		const name = 'Skeleton';
		const counter = 1;
		return { name, counter };
	})
	.init(({ name }) => {
		console.log('Boom! a ' + name);
		return {};
	})
	.tick(({ counter, delta, name }) => {
		const newCounter = counter + delta;
		console.log("I'm a " + name + ' and I say ' + counter);
		return { counter: newCounter };
	});

const Zombie = new Entity()
	.init((state) => {
		const name = 'Zombie';
		const counter = 1;
		return { name, counter };
	})
	.init(({ name }) => {
		console.log('Boom! a ' + name);
		return {};
	})
	.tick(({ counter, delta, name }) => {
		const newCounter = counter + delta;
		console.log("I'm a " + name + ' and I say ' + counter);
		return { counter: newCounter };
	});

// .tick((state) => {
// 	console.log('tick first');
// 	return { counter: state.counter + 1 };
// })
// .tick((state) => {
// 	console.log('tick second');
// 	console.log(state);
// 	return {};
// });

// Scene
const scene = new Scene();

scene.addEntity(Skeleton.create());
scene.addEntity(Zombie.create());

// scene.init();
scene.tick(1);

scene.tick(2);

scene.tick(2);

// const interval = setInterval(() => {
// 	Skeleton.executeTick(1);
// }, 2000);

export { nukleus as game };
