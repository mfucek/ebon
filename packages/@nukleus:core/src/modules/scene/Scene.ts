import * as THREE from 'three';
import { Behaveiour } from '../..';
import { LiveEntity } from '../entity/LiveEntity';

export class Scene {
	entities: LiveEntity<{}>[] = [];

	sceneThree = new THREE.Scene();

	constructor() {}

	addEntity(entity: Behaveiour<any>) {
		const liveEntity = entity.create();
		console.warn(`[Scene]: Added entity. ${this.entities.length}`);

		this.entities.push(liveEntity);
	}

	init() {
		// console.log('Scene: init');
	}

	tick(delta: number) {
		console.warn(
			`[Scene]: Ticking all ${this.entities.length} entities. ${delta}ms has passed since last tick.`
		);
		for (const entity of this.entities) {
			entity.executeTick(delta);
		}
	}
}
