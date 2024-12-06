
import {Map2} from "@benev/slate"
import {GameState} from "./game-state.js"

export class Lifecycles<T extends {dispose: () => void}> {
	entities = new Map2<number, T>

	constructor(
		public instancers: Map2<string, (id: number, entityState: any) => T>,
	) {}

	conform(gameState: GameState<any>) {

		// creations
		for (const [id, [kind, state]] of gameState.entityStates) {
			if (!this.entities.has(id)) {
				const instancer = this.instancers.require(kind)
				this.entities.set(id, instancer(id, state))
			}
		}

		// deletions
		for (const [id, entityInstance] of this.entities) {
			if (!gameState.entityStates.has(id)) {
				entityInstance.dispose()
				this.entities.delete(id)
			}
		}
	}
}

