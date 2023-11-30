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
		this.rendererThree.shadowMap.enabled = true;
		this.rendererThree.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

		this.rendererThree.setSize(100, 100);
		// this.rendererThree.setClearColor(0x000000, 1);
		// this.rendererThree.setPixelRatio(window.devicePixelRatio);

		this.activeCamera = new THREE.PerspectiveCamera(75, 0.5, 0.1, 1000);
		this.activeCamera.up.set(0, 0, 1);
		this.activeCamera.position.set(-2, 5, 5);
		this.activeCamera.lookAt(0, 0, 0);
		this.sceneThree.add(this.activeCamera);

		const light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set(-2, 1, 2); //default; light shining from top
		light.castShadow = true; // default false
		this.sceneThree.add(light);

		//Set up shadow properties for the light
		light.shadow.mapSize.width = 512; // default
		light.shadow.mapSize.height = 512; // default
		light.shadow.camera.near = 0.5; // default
		light.shadow.camera.far = 500; // default

		const light2 = new THREE.AmbientLight(0xffffff, 0.7);
		this.sceneThree.add(light2);
	}

	addEntity(entity: typeof Entity) {
		const liveEntity = entity.create();
		console.warn(`[Scene]: Added entity. ${this.entities.length}`);

		this.entities.push(liveEntity);
		this.sceneThree.add(liveEntity.state.object);
	}

	setCamera(camera: THREE.PerspectiveCamera) {
		this.activeCamera = camera;
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
