export class Scene {
	constructor() {
		console.log('Scene');
	}

	addEntity(entity: any) {
		console.log('Scene: ', entity);
	}

	init() {
		console.log('Scene: init');
	}

	tick() {
		console.log('Scene: tick');
	}
}
