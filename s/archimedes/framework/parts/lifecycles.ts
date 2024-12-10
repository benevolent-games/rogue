
import {Map2} from "@benev/slate"
import {GameState} from "./game-state.js"

export class Lifecycles<T extends {dispose: () => void}> {
	entities = new Map2<number, T>

	constructor(
		public instancers: Map2<string, (id: number, entityState: any) => T>,
	) {}

	add(id: number, kind: string, state: any) {
		const instancer = this.instancers.require(kind)
		const instance = instancer(id, state)
		this.entities.set(id, instance)
		return instance
	}

	delete(id: number) {
		const instance = this.entities.get(id)
		if (instance) {
			instance.dispose()
			this.entities.delete(id)
		}
	}

	conform(gameState: GameState<any>) {

		// creations
		for (const [id, [kind, state]] of gameState.entities) {
			if (!this.entities.has(id))
				this.add(id, kind, state)
		}

		// deletions
		for (const [id, entityInstance] of this.entities) {
			if (!gameState.entities.has(id)) {
				entityInstance.dispose()
				this.entities.delete(id)
			}
		}
	}
}

