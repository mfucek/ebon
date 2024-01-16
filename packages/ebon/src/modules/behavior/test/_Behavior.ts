import { ActionDict, CleanActionDict } from '../../entity/types/action-helpers';
import { ActionsNewState, Merge } from './test-types';

export class _Behavior<
	State extends {},
	RequiredState extends {},
	Actions extends {},
	RequiredActions extends {}
> {
	constructor() {}

	init = <NewS extends {}>(
		initFunction: (state: Merge<[State, RequiredState]>) => NewS | void
	) => {
		type MergedS = Merge<[State, NewS]>;
		type MergedRS = RequiredState;
		type MergedA = ActionsNewState<Actions, MergedS>;
		type MergedRA = ActionsNewState<RequiredActions, MergedS>;

		return new _Behavior<MergedS, MergedRS, MergedA, MergedRA>();
	};

	tick = (
		tickFunction: (
			state: Merge<[State, RequiredState]>
		) => Partial<State> | void
	) => {
		type MergedS = State;
		type MergedRS = RequiredState;
		type MergedA = Actions;
		type MergedRA = RequiredActions;

		return new _Behavior<MergedS, MergedRS, MergedA, MergedRA>();
	};

	_rawactions: Actions = {} as Actions;
	actions = {} as CleanActionDict<State, Actions>;

	action = <NewA extends ActionDict<State>>(newRawActions: NewA) => {
		type MergedS = State;
		type MergedRS = RequiredState;
		type MergedA = Merge<[Actions, NewA]>;
		type MergedRA = RequiredActions;

		return new _Behavior<MergedS, MergedRS, MergedA, MergedRA>();
	};

	use = <
		NewS extends {},
		NewRS extends {},
		NewA extends ActionDict<NewS>,
		NewRA extends ActionDict<NewS>,
		CastActions = ActionsNewState<Actions, {}>,
		CastNewActions = ActionsNewState<NewRA, {}>
	>(
		newBeh: State extends NewRS
			? ActionsNewState<Actions, {}> extends ActionsNewState<NewRA, {}>
				? _Behavior<NewS, NewRS, NewA, NewRA>
				: "The current behavior does not satisfy the new behavior' requirements! (Actions) Please check your console for more details."
			: "The current behavior does not satisfy the new behavior' requirements! (State) Please check your console for more details."
	) => {
		type MergedS = Merge<[State, NewS]>;
		type MergedRS = {}; // RequiredState;
		type MergedA = ActionsNewState<Merge<[Actions, NewA]>, MergedS>; // Merge<[Actions, NewA]>;
		type MergedRA = {}; // RequiredActions;

		return new _Behavior<MergedS, MergedRS, MergedA, MergedRA>();
	};

	require = <
		NewS extends {},
		NewRS extends {},
		NewA extends ActionDict<NewS>,
		NewRA extends ActionDict<NewS>
	>(
		newBeh: _Behavior<NewS, NewRS, NewA, NewRA>
	) => {
		type MergedS = Merge<[State, NewRS, NewS]>;
		type MergedRS = Merge<[RequiredState, NewS]>;
		type MergedA = ActionsNewState<
			Merge<[Actions, NewRA, NewA]>,
			Merge<[MergedS, MergedRS]>
		>;
		type MergedRA = ActionsNewState<
			Merge<[RequiredActions, NewA]>,
			Merge<[MergedS, MergedRS]>
		>;

		return new _Behavior<MergedS, MergedRS, MergedA, MergedRA>();
	};
}
