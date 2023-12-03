import { KeyboardController } from '../keyboard/KeyboardManager';
import { Scene } from '../scene/Scene';
import { NukleusContainer } from './container';

class Nukleus {
	activeScene: Scene | null = null;

	constructor() {
		console.log('Nukleus');
	}

	private lastTick = Date.now();

	private isActive = false;
	start = () => {
		this.isActive = true;
		this.render();
	};

	private render = () => {
		if (!this.activeScene) {
			console.error('No active scene!');
			this.isActive = false;
			return false;
		}
		if (!this.isActive) {
			return false;
		}
		requestAnimationFrame(this.render);
		this.tickActiveScene();
		this.activeScene.render();
	};

	stop = () => {
		this.isActive = false;
	};

	private tickActiveScene = () => {
		const now = Date.now();
		if (!this.activeScene) {
			console.error('No active scene');
			return;
		}
		this.activeScene.tick(now - this.lastTick);
		this.lastTick = now;
	};

	container: HTMLDivElement | null = null;
	keyboardController = new KeyboardController();

	initialize = (container: HTMLDivElement) => {
		this.container = container;
		while (this.container.firstChild) {
			this.container.removeChild(this.container.firstChild);
		}

		const keyboardCallbacks = this.keyboardController.getKeyboardCallbacks();

		if (!this.activeScene) {
			throw new Error('No active scene');
		}

		const renderer = this.activeScene.rendererThree;
		const canvas = renderer.domElement;

		canvas.style.width = '100%';
		canvas.style.height = '100%';
		canvas.tabIndex = 1;

		canvas.addEventListener('keydown', keyboardCallbacks.onKeyDown);
		canvas.addEventListener('keyup', keyboardCallbacks.onKeyUp);

		this.container.appendChild(canvas);
		canvas.focus();

		const handleResize = () => {
			if (!this.container) {
				return false;
			}
			this.resizeRendererToDisplaySize(this.container);
		};

		const cleanup = () => {
			window.removeEventListener('resize', handleResize);
		};

		handleResize();
		window.addEventListener('resize', handleResize);

		return cleanup;
	};

	resizeRendererToDisplaySize = (container: HTMLDivElement) => {
		if (!this.activeScene) {
			return false;
		}
		const renderer = this.activeScene.rendererThree;
		const camera = this.activeScene.activeCamera;
		const canvas = renderer.domElement;
		const width = container.clientWidth;
		const height = container.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if (needResize) {
			renderer.setSize(width, height, false);
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
		}
		return needResize;
	};

	setScene = (scene: Scene) => {
		this.activeScene = scene;
	};

	cleanup = () => {
		this.activeScene = null;
	};
}

// class LiveNukleus {}

export { Nukleus, NukleusContainer };
