
import {deep, Map2} from "@benev/slate"
import {Entities, EntityEntry, SnapshotData} from "./types.js"

export class GameState<xEntities extends Entities> {
	id = 0
	entities = new Map2<number, EntityEntry>()

	create<xKind extends keyof xEntities>(kind: xKind, state: xEntities[xKind]["state"]) {
		const id = this.id++
		this.entities.set(id, [kind as string, state])
		return id
	}

	delete(id: number) {
		this.entities.delete(id)
	}

	snapshot(): SnapshotData {
		return deep.clone({
			id: this.id,
			entities: [...this.entities.entries()],
		})
	}

	restore(snapshot: SnapshotData) {
		this.id = snapshot.id
		this.entities = new Map2(snapshot.entities)
	}
}

