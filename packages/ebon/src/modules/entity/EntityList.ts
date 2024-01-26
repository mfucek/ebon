import { Behavior } from '../behavior/Behavior';
import { LiveEntity } from './LiveEntity';

export class EntityList {
	entities: LiveEntity<any, any>[] = [];

	length = 0;

	constructor() {}

	add(entity: LiveEntity<any, any>) {
		this.entities.push(entity);
	}

	push(entity: LiveEntity<any, any>) {
		this.entities.push(entity);
		this.length += 1;
	}

	remove(entity: string | LiveEntity<any, any>) {
		if (typeof entity === 'string') {
			// Handle the case where entity is a string (id)
			this.entities = this.entities.filter((e) => {
				if (e._id === entity) {
					this.length -= 1;
				}
				return e._id !== entity;
			});
		} else {
			// Handle the case where entity is a Behavior
			this.entities = this.entities.filter((e) => {
				if (e === entity) {
					this.length -= 1;
				}
				return e !== entity;
			});
		}
	}

	*[Symbol.iterator]<S extends {}, A extends {}>(
		behavior: Behavior<S, A, any, any>
	): IterableIterator<LiveEntity<S, A>> {
		let i = 0;
		while (this.entities[i]) {
			const entity = this.entities[i];
			// if (entity.has(behavior)) {
			yield entity as LiveEntity<S, A>;
			// }
			i++;
		}
	}

	*filterByBehavior<S extends {}, A extends {}>(
		behavior: Behavior<S, A, any, any>
	): IterableIterator<LiveEntity<S, A>> {
		let i = 0;
		while (this.entities[i]) {
			const entity = this.entities[i];
			if (entity.has(behavior) || entity.is(behavior)) {
				yield entity as LiveEntity<S, A>;
			}
			i++;
		}
	}
}
