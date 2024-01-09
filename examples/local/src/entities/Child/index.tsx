import { Entity } from 'ebon';
import { ExampleCube } from '../../behaviors/ExampleCube';

export const Child = Entity.use(ExampleCube)
	.init((state) => {
		state.position.z = 0.5;
		state.object.scale.set(0.5, 0.5, 0.5);
		state.object.material.color.set('#87bfff');
		return {};
	})
	.tick((state) => {
		const t = Math.sin(state.age / 1000) * 10 + state.age / 200;
		state.position.x = Math.sin(t) * 1;
		state.position.y = Math.cos(t) * 1;
	});
