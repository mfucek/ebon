import { Scene } from 'ebon';
import { Dummy } from './entities/Dummy';
import { ebon } from './lib/ebon/ebon';

console.clear();

// Floor
// const Floor = new Behavior() //
// 	.use(MeshObject)
// 	.use(Transform)
// 	.init(() => {
// 		const plane = new THREE.Mesh(
// 			new THREE.CircleGeometry(4, 64),
// 			new THREE.MeshPhongMaterial({
// 				color: '#222222'
// 			})
// 		);
// 		plane.receiveShadow = true;
// 		plane.castShadow = false;
// 		return { object: plane };
// 	});

// Scene
const scene = new Scene();

// Player.create(scene);
// Floor.create(scene);

export const dummyRef = Dummy.create(scene);

ebon.setScene(scene);

const game = ebon;

export { game };
