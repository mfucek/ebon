import { Behavior } from '../behavior/Behavior';
import { Ebon } from '../ebon';

export class Keyboard<Bind extends string> {
	bindKey: Record<Bind, string>;
	bindState: Record<Bind, boolean>;

	ebon: Ebon;

	/**
	 * @param bindKeys - Define which actions should be bound to which keys
	 * @example { 'jump': 'Space', 'up': 'ArrowUp' }
	 * @returns a Behavior that can be used in an entity
	 */
	constructor(ebon: Ebon, bindKey: Record<Bind, string>) {
		console.log('KeyboardManager');

		this.ebon = ebon;
		this.bindKey = bindKey;

		this.bindState = {} as Record<Bind, boolean>;
		for (const bind in bindKey) {
			this.bindState[bind] = false;
		}
	}

	updateStates = () => {
		for (const bind in this.bindKey) {
			this.bindState[bind] =
				this.ebon.keyboardController.keys[this.bindKey[bind]];
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
