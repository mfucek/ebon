import { CleanActionDict } from '@/modules/entity/types/action-helpers';
import { _Behavior } from './_Behavior';

type _MergeTwo<A, B> = Omit<A, keyof B> & B;

export type Merge<T extends any[]> = T extends [infer A, infer B, ...infer Rest]
	? Merge<[_MergeTwo<A, B>, ...Rest]>
	: T extends [infer A]
	? A
	: never;

// ---------------------------------------

export type RawActionsParameters<T> = T extends (
	state: any,
	...args: infer P
) => any
	? P
	: never;

export type RawActionOutput<T> = T extends (...args: any[]) => {
	output: infer R;
}
	? R
	: never;

export type ActionsNewState<Actions, NewS> = {
	[K in keyof Actions]: Actions[K] extends (...args: any[]) => any
		? (
				state: NewS,
				...args: RawActionsParameters<Actions[K]> extends [...infer P]
					? P
					: never
		  ) => RawActionOutput<Actions[K]> extends infer O
				? { state: Partial<NewS>; output: O }
				: never
		: Actions[K];
};

// ---------------------------------------

type StateA = { a: string };
type StateB = { a: string; b: number };

type Actions = {
	a: (state: StateA, a: string) => { state: {}; output: string };
	b: (state: StateA, a: string, b: number) => { state: {}; output: number };
};

type NewActions = ActionsNewState<Actions, StateB>;

const a = {} as Actions;
a.a({ a: 'a' }, 'a');
a.b({ a: 'a' }, 'a', 1);
// @ts-expect-error
a.b({ a: 'a' }, 1);

const cleanA = {} as CleanActionDict<StateA, Actions>;
cleanA.a('a');
cleanA.b('a', 1);
// @ts-expect-error
cleanA.b(1);

const b = {} as NewActions;
b.a({ a: 'a', b: 2 }, 'a');
b.b({ a: 'a', b: 2 }, 'a', 1);
// @ts-expect-error
b.b({ a: 'a', b: 2 }, 1);

const cleanB = {} as CleanActionDict<StateB, NewActions>;
cleanB.a('a');
cleanB.b('a', 1);
// @ts-expect-error
cleanB.b(1);

const c = {} as {
	a: (state: StateA, a: string) => { state: {}; output: string };
	b: (state: StateA, a: string, b: number) => { state: {}; output: number };
};
const d = {} as {
	c: (state: StateB, a: string) => { state: {}; output: string };
	d: (state: StateB, a: string, b: number) => { state: {}; output: number };
};
const mergedCD = { ...(c as ActionsNewState<typeof c, StateB>), ...d };
mergedCD.a({ a: 'a', b: 2 }, 'a');
mergedCD.b({ a: 'a', b: 2 }, 'a', 1);
mergedCD.c({ a: 'a', b: 2 }, 'a');
mergedCD.d({ a: 'a', b: 2 }, 'a', 1);

const acA = {} as {
	a: (state: StateA, a: string) => { state: StateA; output: 1 };
	b: (state: StateA, b: number) => { state: StateA; output: 2 };
};
const acB = {} as {
	c: (state: StateB, a: number) => { state: StateB; output: 3 };
	d: (state: StateB, a: number, b: string) => { state: StateB; output: 4 };
};

// merge all keys of two objects, and override all the states with type of merged type

const mergedAB = {} as Merge<[typeof acA, typeof acB]>;

const mergedAB2 = {} as ActionsNewState<
	Merge<[typeof acA, typeof acB]>,
	Merge<[StateA, StateB]>
>;

// const mergedAB = {} as MergeActions<[typeof acA, typeof acB]>

export type GetState<T extends _Behavior<any, any, any, any>> =
	T extends _Behavior<infer State, any, any, any> ? State : never;

export type GetRequiredState<T extends _Behavior<any, any, any, any>> =
	T extends _Behavior<any, infer RequiredState, any, any>
		? RequiredState
		: never;

export type GetActions<T extends _Behavior<any, any, any, any>> =
	T extends _Behavior<any, any, infer Actions, any> ? Actions : never;

export type GetRequiredActions<T extends _Behavior<any, any, any, any>> =
	T extends _Behavior<any, any, any, infer RequiredActions>
		? RequiredActions
		: never;

export type GetAllGenerics<T extends _Behavior<any, any, any, any>> = {
	state: GetState<T>;
	requiredState: GetRequiredState<T>;
	actions: GetActions<T>;
	requiredActions: GetRequiredActions<T>;
};
