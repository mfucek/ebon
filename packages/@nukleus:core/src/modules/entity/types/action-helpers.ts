export type Action<State> = (
	state: State,
	...a: any[]
) => { state: Partial<State>; output?: any };

export type ActionDict<State> = { [name: string]: Action<State> };

// clean fn removes first parameter in function (state)
type _CleanAction<State, Fn extends Action<State>> = Fn extends (
	state: any,
	...args: infer P
) => infer R
	? (...args: P) => R
	: never;

// change function output to be the type of 'output' key in returned object
// export type CleanActionReturn<State, Fn extends Action<State>> = Fn extends (
export type CleanAction<State, Fn extends Action<State>> = Fn extends (
	state: any,
	...args: infer P
) => { state: Partial<State>; output: infer R }
	? (...args: P) => R
	: Fn extends (state: any, ...args: infer P) => { state: Partial<State> }
	? (...args: P) => void
	: never;

type A = CleanAction<
	{},
	(state: {}, b: number) => { state: {}; output: { a: string; b: number } }
>;
//   ^?
type B = _CleanAction<
	{},
	(state: {}, b: number) => { state: {}; output: { a: string; b: number } }
>;
//   ^?

export type CleanActionDict<State, F extends ActionDict<State>> = {
	[K in keyof F]: CleanAction<State, F[K]>;
};

class Entity<State extends {}, Actions extends {}> {
	_rawActions: Actions = {} as Actions;
	actions: CleanActionDict<State, Actions> = {} as CleanActionDict<
		State,
		Actions
	>;

	constructor(oldActions?: ActionDict<State>) {
		if (oldActions) {
			this._rawActions = oldActions as Actions;
		}
		this.actions = this._clean(this._rawActions);
	}

	_clean = (rawActions: Actions): CleanActionDict<State, Actions> => {
		const cleanActions = {} as CleanActionDict<State, Actions>;
		for (const key in rawActions) {
			const fn = rawActions[key] as Function;
			cleanActions[key] = ((...args: any) => {
				return fn({}, ...args);
			}) as any;
		}
		return cleanActions;
	};

	action = <G extends ActionDict<State>>(actions: G) => {
		type NewType = Omit<Actions, keyof G> & G;
		return new Entity<State, NewType>(actions);
	};
}

const e = new Entity<{ a: 2 }, {}>()
	.action({
		log: (state) => {
			return { state };
		},
		log2: (state, a: string) => {
			return { state, output: a };
		}
	})
	.action({
		log2: (state, a: number) => {
			return { state, output: 2 * a };
		},
		log3: (state, a: string) => {
			return { state, output: a };
		}
	});

const r1 = e._rawActions.log({ a: 2 });
const r2 = e._rawActions.log2({ a: 2 }, 5);
const r3 = e._rawActions.log3({ a: 2 }, 'a');

const a1 = e.actions.log();
const a2 = e.actions.log2(5);
const a3 = e.actions.log3('a');
