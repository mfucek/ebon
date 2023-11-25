import { FinalInitCallback, FinalTickCallback } from './types/Callback';

export class LiveEntity<State extends {}> {
	state: State;

	private tickCallback: FinalTickCallback<State>;

	constructor(behaveiour: {
		init: FinalInitCallback<State>;
		tick: FinalTickCallback<State>;
	}) {
		this.tickCallback = behaveiour.tick;

		// Execute initialization
		const initialState = behaveiour.init();

		this.state = initialState;
	}

	executeTick = (delta: number) => {
		const returnedState = this.tickCallback({ ...this.state, delta });

		this.state = { ...this.state, ...returnedState, delta };
		// Merge returned state with current state
		// for (const key in returnedState) {
		// 	this.state[key] = returnedState[key];
		// }
	};
}
