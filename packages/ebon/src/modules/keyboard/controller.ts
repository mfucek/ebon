export class KeyboardController {
	keys: Record<string, boolean> = {};

	getKeyboardCallbacks = (): Record<string, (ev: KeyboardEvent) => void> => {
		return {
			onKeyDown: (ev) => {
				this.keys[ev.key] = true;
			},
			onKeyUp: (ev) => {
				this.keys[ev.key] = false;
			}
		};
	};
}
