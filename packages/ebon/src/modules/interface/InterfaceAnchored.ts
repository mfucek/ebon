import { ThreeObject } from '@/lib/three/behaviors';
import { useEbonInterface } from '../../lib/zustand';
import { Behavior } from '../behavior/Behavior';

export const InterfaceAnchored = (element: JSX.Element) =>
	new Behavior() //
		.require(ThreeObject)
		.init(({ object }) => {
			const interfaceId = Math.random().toString(36).substr(2, 9);
			const offsetObject = object.clone();
			useEbonInterface.getState().registerObject(interfaceId, offsetObject);
			useEbonInterface.getState().setElement(interfaceId, element);
			return { interfaceId };
		})
		.tick(({ object, interfaceId }) => {
			const offsetObject = object.clone();
			offsetObject.position.z += 1.5;
			useEbonInterface.getState().updateObject(interfaceId, offsetObject);
		});
