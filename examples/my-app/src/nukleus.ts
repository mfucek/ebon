import { Behaveiour, Entity, Nukleus, Scene } from '@nukleus/core';

console.clear();

const nukleus = new Nukleus();

// Entity

// const deltaBehaveiour = new Entity().init(() => {
// 	return { delta: 0 };
// });

const Common = new Behaveiour<{ counter: number; delta: number }>()
	.init((state) => {
		console.error('init c1', state);
		const { counter } = state;
		return { counter: counter + 10000 };
	})
	.init((state) => {
		console.error('init c2', state);
		// const { counter } = state;
		// return { counter: counter + 10000 };
	})
	.tick((state) => {
		console.error('tick c1', state);
		// const { counter } = state;
		// return { counter: counter + 1000 };
	})
	.tick((state) => {
		console.error('tick c2', state);
		const { counter } = state;
		return { counter: counter + 1000 };
	});

// const Skeleton = new Entity<{ Acounter: number; delta: number }>()
const skeleton = Entity.init((state) => {
	console.log(state.object.toJSON());
	console.log('init s1', state);
	return { counter: 10 };
})
	.init((state) => {
		console.log('init s2', state);
		// const { counter } = state;
		return {};
	})
	.tick((state) => {
		console.log('tick s1', state);
		const { counter } = state;
		return { counter: counter + 1, name: 'MARKO' };
	})
	.use(Common)
	.tick((state) => {
		console.log('tick s2', state);
		// const { counter } = state;
		return {};
	})
	.tick((state) => {
		console.log('tick s3 (final state)', state);
		return state;
	});

// Scene
const scene = new Scene();

scene.addEntity(skeleton);

scene.tick(1);
scene.tick(2);

nukleus.setScene(scene);

// nukleus.start();

// scene.tick(2);

// scene.tick(2);

// const interval = setInterval(() => {
// 	Skeleton.executeTick(1);
// }, 2000);

export { nukleus as game };
