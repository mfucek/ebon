import { Object3D } from 'three';
import { useNukleusInterface } from '../../lib/zustand';
import { Behavior } from '../behavior/Behavior';

export const InterfaceAnchored = (element: JSX.Element) =>
	new Behavior<{ delta: number; object: Object3D }, {}>()
		.init(({ object }) => {
			const interfaceId = Math.random().toString(36).substr(2, 9);
			const offsetObject = object.clone();
			useNukleusInterface.getState().registerObject(interfaceId, offsetObject);
			useNukleusInterface.getState().setElement(interfaceId, element);
			return { interfaceId };
		})
		.tick(({ object, interfaceId }) => {
			const offsetObject = object.clone();
			offsetObject.position.z += 1.5;
			useNukleusInterface.getState().updateObject(interfaceId, offsetObject);
		});
