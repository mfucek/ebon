import { LiveEntity } from '../entity/LiveEntity';
import { Behavior } from './Behavior';

type GetStateFromBehavior<B extends Behavior<any, any, any, any>> =
	B extends Behavior<infer S, any, any, any> ? S : never;
type GetStateFromLiveEntity<B extends LiveEntity<any, any>> =
	B extends LiveEntity<infer S, any> ? S : never;

export type GetState<B> = B extends Behavior<any, any, any, any>
	? GetStateFromBehavior<B>
	: B extends LiveEntity<any, any>
	? GetStateFromLiveEntity<B>
	: never;

export type GetActions<B extends Behavior<any, any, any, any>> =
	B extends Behavior<any, infer A, any, any> ? A : never;

export type AnyBehavior = Behavior<any, any, any, any>;
export type AnyLiveEntity = LiveEntity<any, any>;
