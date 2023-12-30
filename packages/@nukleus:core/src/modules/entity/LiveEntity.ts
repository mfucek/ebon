import { nanoid } from 'nanoid';
import { Behavior, DefaultState } from '../behavior/Behavior';

type FinalInitCallback<State> = (initialState?: Partial<State>) => State;
type FinalTickCallback<State> = (state: State) => Partial<State>;

export class LiveEntity<State extends DefaultState> {
	state: State;
	_id = nanoid();
	actions: Record<string, () => void> = {};

	private tickCallback: FinalTickCallback<State>;

	constructor(behavior: Behavior<State>, initialState?: Partial<State>) {
		this.tickCallback = behavior._tickCb;

		// Execute initialization
		const state = behavior._initCb(initialState);
		this.state = state;

		// Generate action methods
		for (const action in behavior.actions) {
			this.actions[action] = () => {
				const returnedState = behavior.actions[action](this.state);
				this.state = { ...this.state, ...returnedState };
			};
		}
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
