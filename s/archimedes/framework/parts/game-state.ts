
import {deep, Map2} from "@benev/slate"
import {Entities, EntityEntry} from "./types.js"
import {IdCounter} from "../../../tools/id-counter.js"

export class GameState<xEntities extends Entities> {
	#ids = new IdCounter()

	entityStates = new Map2<number, EntityEntry>()

	create<xKind extends keyof xEntities>(kind: xKind, state: xEntities[xKind]["state"]) {
		const id = this.#ids.next()
		this.entityStates.set(id, [kind as string, state])
		return id
	}

	delete(id: number) {
		this.entityStates.delete(id)
	}

	snapshot() {
		return deep.clone([...this.entityStates.entries()])
	}

	restore(snapshot: [number, EntityEntry][]) {
		this.entityStates = new Map2(snapshot)
	}
}

