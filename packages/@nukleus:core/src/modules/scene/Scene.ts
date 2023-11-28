import * as THREE from 'three';
import { Entity } from '../..';
import { LiveEntity } from '../entity/LiveEntity';

export class Scene {
	entities: LiveEntity<any>[] = [];

	sceneThree: THREE.Scene;
	rendererThree: THREE.WebGLRenderer;

	activeCamera: THREE.PerspectiveCamera;

	constructor() {
		this.sceneThree = new THREE.Scene();
		this.rendererThree = new THREE.WebGLRenderer({ antialias: true });
		this.activeCamera = new THREE.PerspectiveCamera(75, 0.5, 0.1, 1000);

		this.rendererThree.setSize(100, 100);
		// this.rendererThree.setClearColor(0x000000, 1);
		// this.rendererThree.setPixelRatio(window.devicePixelRatio);

		this.activeCamera.position.set(0, -5, 5);
		this.activeCamera.lookAt(0, 0, 0);

		this.activeCamera.position.set(0, -5, 5);
		this.activeCamera.lookAt(0, 0, 0);
		this.sceneThree.add(this.activeCamera);

		const light = new THREE.DirectionalLight(0xffffff);
		light.position.set(10, 0, 10);
		this.sceneThree.add(light);

		const light2 = new THREE.AmbientLight(0xffffff, 0.5);
		this.sceneThree.add(light2);

		const plane = new THREE.Mesh(
			new THREE.PlaneGeometry(10, 10),
			new THREE.MeshPhongMaterial({ color: 0xffffff })
		);
		this.sceneThree.add(plane);
	}

	addEntity(entity: typeof Entity) {
		const liveEntity = entity.create();
		console.warn(`[Scene]: Added entity. ${this.entities.length}`);

		this.entities.push(liveEntity);
		this.sceneThree.add(liveEntity.state.object);
	}

	render() {
		this.rendererThree.render(this.sceneThree, this.activeCamera);
	}

	tick(delta: number) {
		// console.warn(
		// 	`[Scene]: Ticking all ${this.entities.length} entities. ${delta}ms has passed since last tick.`
		// );
		for (const entity of this.entities) {
			entity.executeTick(delta);
		}
	}
}
