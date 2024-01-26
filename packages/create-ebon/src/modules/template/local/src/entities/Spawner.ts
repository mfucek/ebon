import { Behavior, Delta, SceneReference } from 'ebon';
import { Enemy } from './Enemy';

export const Spawner = new Behavior() //
	.use(Delta)
	.use(SceneReference)
	.init(() => {
		return {
			spawnInterval: 5000,
			lastSpawn: 0
		};
	})
	.tick(({ scene, spawnInterval, lastSpawn, age }) => {
		if (age > lastSpawn + spawnInterval) {
			Enemy.create(scene);
			return { lastSpawn: age };
		}
	});
