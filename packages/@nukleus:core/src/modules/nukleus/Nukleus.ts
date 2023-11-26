import { Scene } from '../scene/Scene';
import { NukleusContainer } from './container';

class Nukleus {
	activeScene: Scene | null = null;

	constructor() {
		console.log('Nukleus');
	}

	private lastTick = Date.now();

	tickInterval: NodeJS.Timer | null = null;
	start = () => {
		if (this.tickInterval) {
			this.stop();
		}
		this.tickInterval = setInterval(this.tickActiveScene, 0);
	};

	stop = () => {
		if (this.tickInterval) {
			clearInterval(this.tickInterval);
			this.tickInterval = null;
		}
	};

	private tickActiveScene = () => {
		const now = Date.now();
		if (this.activeScene) {
			this.activeScene.tick(now - this.lastTick);
		}
		this.lastTick = now;
	};

	setScene = (scene: Scene) => {
		this.activeScene = scene;
	};

	cleanup = () => {
		this.activeScene = null;
	};
}

export { Nukleus, NukleusContainer };
