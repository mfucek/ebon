import { Object3D } from 'three';
import { useEbonInterface } from '../../lib/zustand';
import { Behavior } from '../behavior/Behavior';
import { LiveEntity } from '../entity/LiveEntity';
import { Scene } from '../scene/Scene';

export const InterfaceAnchored = (element: JSX.Element) =>
	new Behavior<
		{
			delta: number;
			object: Object3D;
			scene: Scene;
			this: LiveEntity<any, any>;
		},
		{},
		{}
	>()
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
