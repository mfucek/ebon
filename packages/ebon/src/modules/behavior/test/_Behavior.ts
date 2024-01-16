import { ActionDict, CleanActionDict } from '../../entity/types/action-helpers';
import { ActionsNewState, Merge } from './test-types';

export class _Behavior<
	State extends {},
	Actions extends {},
	RequiredState extends {},
	RequiredActions extends {}
> {
	constructor() {}

	init = <NewS extends {}>(
		initFunction: (state: Merge<[State, RequiredState]>) => NewS | void
	) => {
		type MergedS = Merge<[State, NewS]>;
		type MergedA = ActionsNewState<Actions, MergedS>;
		type MergedRS = RequiredState;
		type MergedRA = ActionsNewState<RequiredActions, MergedS>;

		return new _Behavior<MergedS, MergedA, MergedRS, MergedRA>();
	};

	tick = (
		tickFunction: (
			state: Merge<[State, RequiredState]>
		) => Partial<State> | void
	) => {
		type MergedS = State;
		type MergedA = Actions;
		type MergedRS = RequiredState;
		type MergedRA = RequiredActions;

		return new _Behavior<MergedS, MergedA, MergedRS, MergedRA>();
	};

	_rawactions: Actions = {} as Actions;
	actions = {} as CleanActionDict<State, Actions>;

	action = <NewA extends ActionDict<State>>(newRawActions: NewA) => {
		type MergedS = State;
		type MergedA = Merge<[Actions, NewA]>;
		type MergedRS = RequiredState;
		type MergedRA = RequiredActions;

		return new _Behavior<MergedS, MergedA, MergedRS, MergedRA>();
	};

	use = <
		NewS extends {},
		NewA extends ActionDict<NewS>,
		NewRS extends {},
		NewRA extends ActionDict<NewS>,
		CastActions = ActionsNewState<Actions, {}>,
		CastNewActions = ActionsNewState<NewRA, {}>
	>(
		newBeh: State extends NewRS
			? ActionsNewState<Actions, {}> extends ActionsNewState<NewRA, {}>
				? _Behavior<NewS, NewA, NewRS, NewRA>
				: "The current behavior does not satisfy the new behavior' requirements! (Actions) Please check your console for more details."
			: "The current behavior does not satisfy the new behavior' requirements! (State) Please check your console for more details."
	) => {
		type MergedS = Merge<[State, NewS]>;
		type MergedA = ActionsNewState<Merge<[Actions, NewA]>, MergedS>; // Merge<[Actions, NewA]>;
		type MergedRS = {}; // RequiredState;
		type MergedRA = {}; // RequiredActions;

		return new _Behavior<MergedS, MergedA, MergedRS, MergedRA>();
	};

	require = <
		NewS extends {},
		NewA extends ActionDict<NewS>,
		NewRS extends {},
		NewRA extends ActionDict<NewS>
	>(
		newBeh: _Behavior<NewS, NewA, NewRS, NewRA>
	) => {
		type MergedS = Merge<[State, NewRS, NewS]>;
		type MergedA = ActionsNewState<
			Merge<[Actions, NewRA, NewA]>,
			Merge<[MergedS, MergedRS]>
		>;
		type MergedRS = Merge<[RequiredState, NewS]>;
		type MergedRA = ActionsNewState<
			Merge<[RequiredActions, NewA]>,
			Merge<[MergedS, MergedRS]>
		>;

		return new _Behavior<MergedS, MergedA, MergedRS, MergedRA>();
	};
}

const Camera = new _Behavior() //
	.init(() => ({ focus: null as null | number }))
	.action({
		focus: (state, newFocus: number | null) => ({ state, output: newFocus })
	});
