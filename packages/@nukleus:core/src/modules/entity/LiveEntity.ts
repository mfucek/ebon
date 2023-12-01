import { nanoid } from 'nanoid';

type FinalInitCallback<State> = (initialState?: Partial<State>) => State;
type FinalTickCallback<State> = (state: State) => Partial<State>;

export class LiveEntity<State extends {}> {
	state: State;
	id: string;

	private tickCallback: FinalTickCallback<State>;

	constructor(
		behaveiour: {
			init: FinalInitCallback<State>;
			tick: FinalTickCallback<State>;
		},
		initialState?: Partial<State>
	) {
		this.tickCallback = behaveiour.tick;

		// Execute initialization
		const state = behaveiour.init({ ...initialState });

		this.state = state;

		this.id = nanoid();
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
