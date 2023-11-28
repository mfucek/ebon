import { Behaveiour, Entity, Nukleus, Scene } from '@nukleus/core';

console.clear();

const nukleus = new Nukleus();

// Entity

// const deltaBehaveiour = new Entity().init(() => {
// 	return { delta: 0 };
// });

const Common = new Behaveiour<{ counter: number; delta: number }>().init(
	(state) => {
		const speedZ = 0.5;
		const speedRot = 0.1;
		return { speedZ, speedRot };
	}
);

const AgeTracker = new Behaveiour()
	.init((state) => {
		return { age: 0 };
	})
	.tick((state) => {
		return { age: state.age + state.delta };
	});

const skeleton = Entity.use(AgeTracker)
	.use(Common)
	.init((state) => {
		console.log(state);
	})
	.tick((state) => {
		const { object, age, speedRot, speedZ } = state;

		object.rotation.z += 0.1;
		object.position.y = Math.sin((age / 100) * speedRot) * 2.5;
		object.position.x = Math.cos((age / 100) * speedRot) * 2.5;
		object.position.z = Math.cos((age / 100) * speedZ) * 1 + 1;
	});

// Scene
const scene = new Scene();

scene.addEntity(skeleton);

nukleus.setScene(scene);

export { nukleus as game };
