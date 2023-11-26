import { Object3D } from 'three';
import { Behaveiour } from '../behaviour/Behaveiour';

// type DefaultState = {
// 	delta: number;
// };

// export class Entity<State extends DefaultState> extends Behaveiour<State> {
// 	constructor() {
// 		super();
// 		console.log('ASD');
// 		this.init((state) => {
// 			console.log('hehe im an entity');

// 			const object = new Object3D();
// 			return { object, a: 5 };
// 		});
// 	}
// }

// const a = new Entity().tick((state) => {
// 	const { object } = state;
// });

const initializeThreeObject = new Behaveiour().init(() => {
	const object = new Object3D();
	return { object };
});

export const Entity = new Behaveiour().use(initializeThreeObject);
