import { Camera, Vector3 } from 'three';
import { create } from 'zustand';

const projectWorldToScreen = (p: Vector3, camera: THREE.Camera) => {
	var vector = p.clone().project(camera);

	vector.x = (vector.x + 1) / 2;
	vector.y = -(vector.y - 1) / 2;

	return vector;
};

type CounterStore = {
	camera: Camera | null;
	setCamera: (camera: Camera) => void;
	objects: {
		[key: string]: {
			object: THREE.Object3D;
			element?: JSX.Element;
			position?: Vector3;
		};
	};
	registerObject: (id: string, object: THREE.Object3D) => void;
	setElement: (id: string, element: JSX.Element) => void;
	updateObject: (id: string, object: THREE.Object3D) => void;
};
// using the create with generics
export const useNukleusInterface = create<CounterStore>((set) => ({
	camera: null,
	setCamera: (camera) => {
		return set((state) => ({ ...state, camera }));
	},
	objects: {},
	registerObject: (id, object) => {
		return set((state) => ({
			...state,
			objects: {
				...state.objects,
				[id]: {
					object,
					position: state.camera
						? projectWorldToScreen(object.position, state.camera)
						: undefined
				}
			}
		}));
	},
	setElement: (id, element) => {
		return set((state) => ({
			...state,
			objects: { ...state.objects, [id]: { ...state.objects[id], element } }
		}));
	},
	updateObject: (id, object) => {
		return set((state) => ({
			...state,
			objects: {
				...state.objects,
				[id]: {
					...state.objects[id],
					object,
					position: state.camera
						? projectWorldToScreen(object.position, state.camera)
						: undefined
				}
			}
		}));
	}
}));
