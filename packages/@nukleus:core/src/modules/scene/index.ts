import { LiveEntity } from '../entity/LiveEntity';

export class Scene {
	entities: LiveEntity<{}>[] = [];

	constructor() {}

	addEntity(entity: LiveEntity<{}>) {
		this.entities.push(entity);
	}

	init() {
		// console.log('Scene: init');
	}

	tick(delta: number) {
		for (const entity of this.entities) {
			entity.executeTick(delta);
		}
	}
}
