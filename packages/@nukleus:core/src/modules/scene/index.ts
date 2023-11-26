import { LiveEntity } from '../entity/LiveEntity';

export class Scene {
	entities: LiveEntity<{}>[] = [];

	constructor() {}

	addEntity(entity: LiveEntity<any>) {
		console.log(`\n\n\n[Scene]: Added entity. ${this.entities.length}\n`);
		this.entities.push(entity);
	}

	init() {
		// console.log('Scene: init');
	}

	tick(delta: number) {
		console.warn(
			`\n\n\n[Scene]: Ticking all ${this.entities.length} entities. ${delta}ms has passed since last tick.\n`
		);
		for (const entity of this.entities) {
			entity.executeTick(delta);
		}
	}
}
