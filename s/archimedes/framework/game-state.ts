
import {deep, Map2} from "@benev/slate"

export class GameState {
	entities = new Map2<number, any>()

	snapshot() {
		return deep.clone([...this.entities.entries()])
	}

	restore(snapshot: [number, any][]) {
		this.entities = new Map2(snapshot)
	}
}

