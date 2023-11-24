import { Entity, Nukleus, Scene } from '@nukleus/core';

const nukleus = new Nukleus();

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
		return {};
	});

// Scene
const scene = new Scene();

scene.addEntity(Skeleton);

scene.init();
scene.tick();

// const interval = setInterval(() => {
// 	Skeleton.executeTick(1);
// }, 2000);

export { nukleus as game };
