import * as THREE from 'three';
import { useEbonInterface } from '../../lib/zustand';
import { Ebon } from '../ebon';
import { EntityList } from '../entity/EntityList';
import { LiveEntity } from '../entity/LiveEntity';

export class Scene {
	// entities: LiveEntity<any, any>[] = [];
	entities: EntityList = new EntityList();
	ebon: Ebon | null = null;

	sceneThree: THREE.Scene;
	rendererThree: THREE.WebGLRenderer;

	activeCamera: THREE.PerspectiveCamera;

	constructor() {
		this.sceneThree = new THREE.Scene();

		this.rendererThree = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true
		});
		this.rendererThree.shadowMap.enabled = true;
		this.rendererThree.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

		this.rendererThree.setSize(100, 100);
		// this.rendererThree.setClearColor(0x000000, 1);
		// this.rendererThree.setPixelRatio(window.devicePixelRatio);

		this.activeCamera = new THREE.PerspectiveCamera(75, 0.5, 0.1, 1000);
		this.activeCamera.up.set(0, 0, 1);
		this.activeCamera.position.set(-2, 5, 3).multiplyScalar(2);
		this.activeCamera.lookAt(0, 0, 0);
		this.sceneThree.add(this.activeCamera);
		useEbonInterface.getState().setCamera(this.activeCamera);

		const light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set(-2, 1, 2); //default; light shining from top
		light.castShadow = true; // default false
		this.sceneThree.add(light);

		//Set up shadow properties for the light
		light.shadow.mapSize.width = 512; // default
		light.shadow.mapSize.height = 512; // default
		light.shadow.camera.near = 0.5; // default
		light.shadow.camera.far = 500; // default

		const light3 = new THREE.PointLight(0xffffff, 10);
		light3.position.set(3, -2, 3);
		this.sceneThree.add(light3);

		const light2 = new THREE.AmbientLight(0xffffff, 0.7);
		this.sceneThree.add(light2);
	}

	addLiveEntity = <
		State extends { object: THREE.Object3D },
		Actions extends {}
	>(
		liveEntity: LiveEntity<State, Actions>
		// { create: () => LiveEntity<any> }
	) => {
		console.warn(`[Scene]: Added entity. ${this.entities.length}`);

		this.entities.push(liveEntity);
		this.sceneThree.add(liveEntity.state.object);
		return liveEntity;
	};

	setCamera(camera: THREE.PerspectiveCamera) {
		if (!this.ebon) return;

		this.activeCamera = camera;
		this.ebon.resizeRendererToDisplaySize();
		useEbonInterface.getState().setCamera(this.activeCamera);
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

	makeActive = (ebon: Ebon) => {
		this.ebon = ebon;
		ebon.setScene(this);
	};
}
