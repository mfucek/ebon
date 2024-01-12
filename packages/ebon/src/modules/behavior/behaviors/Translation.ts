import { Behavior } from '../Behavior';
import { Acceleration } from './Acceleration';
import { Delta } from './Delta';
import { Friction } from './Friction';
import { Position } from './Position';
import { Velocity } from './Velocity';

export const Translation = new Behavior() //
	.use(Delta)
	.use(Position)
	.use(Velocity)
	.use(Friction)
	.use(Acceleration);
