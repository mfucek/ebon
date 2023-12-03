import { Behavior } from '../behavior/Behavior';
import { Nukleus } from '../nukleus/Nukleus';

export class KeyboardController {
	// static singleton: KeyboardController;
	// constructor() {
	// 	if (KeyboardController.singleton) {
	// 		return KeyboardController.singleton;
	// 	}
	// 	console.log('KeyboardController');
	// 	KeyboardController.singleton = this;
	// }

	keys: Record<string, boolean> = {};

	// getEventListeners = (): Partial<HTMLAttributes<HTMLCanvasElement>> => {
	getKeyboardCallbacks = (): Record<string, (ev: KeyboardEvent) => void> => {
		return {
			onKeyDown: (ev) => {
				this.keys[ev.key] = true;
				console.log('onKeyDown', ev.key);
			},
			onKeyUp: (ev) => {
				this.keys[ev.key] = false;
				console.log('onKeyUp', ev.key);
			}
		};
	};
}

export class Keyboard<Bind extends string> {
	bindKey: Record<Bind, string>;
	bindState: Record<Bind, boolean>;

	nukleus: Nukleus;

	/**
	 * @param bindKeys - Define which actions should be bound to which keys
	 * @example { 'jump': 'Space', 'up': 'ArrowUp' }
	 * @returns a Behavior that can be used in an entity
	 */
	constructor(nukleus: Nukleus, bindKey: Record<Bind, string>) {
		console.log('KeyboardManager');

		this.nukleus = nukleus;
		this.bindKey = bindKey;

		this.bindState = {} as Record<Bind, boolean>;
		for (const bind in bindKey) {
			this.bindState[bind] = false;
		}
	}

	updateStates = () => {
		for (const bind in this.bindKey) {
			this.bindState[bind] =
				this.nukleus.keyboardController.keys[this.bindKey[bind]];
		}
	};

	register() {
		const keyboardBehavior = new Behavior()
			.init(() => {
				return { keyboard: this.bindState };
			})
			.tick(() => {
				this.updateStates();
				return { keyboard: this.bindState };
			});

		return keyboardBehavior;
	}
}
