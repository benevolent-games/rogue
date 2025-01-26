
import {Map2} from "@benev/slate"

import {GameState} from "../parts/game-state.js"
import {Lifecycles} from "../parts/lifecycles.js"
import {Entities, InputShell} from "../parts/types.js"
import {SimulaPack, SimulaReturn, Simulas} from "./types.js"
import {inputsFromAuthor} from "./utils/inputs-from-author.js"

export class Simulator<xEntities extends Entities, xStation> {
	lifecycles: Lifecycles<SimulaReturn<any>>

	constructor(
			public station: xStation,
			public gameState: GameState<xEntities>,
			public simulas: Simulas<xEntities, xStation>,
		) {

		this.lifecycles = new Lifecycles<SimulaReturn<any>>(
			new Map2(Object.entries(simulas).map(([kind, simula]) => {
				const fn = (id: number) => simula({
					simulator: this,
					gameState,
					station,
					id,
					getState: () => gameState.entities.require(id)[1],
					fromAuthor: (author, inputs) => inputsFromAuthor(author, inputs),
				} as SimulaPack<any, any, xStation>)
				return [kind, fn]
			}))
		)
	}

	create<xKind extends keyof xEntities>(kind: xKind, state: xEntities[xKind]["state"]) {
		const id = this.gameState.create(kind, state)
		this.lifecycles.add(id, kind as string)
		return id
	}

	delete(id: number) {
		this.lifecycles.delete(id)
		this.gameState.delete(id)
	}

	simulate(tick: number, inputs: InputShell<any>[]) {
		this.lifecycles.conform(this.gameState)

		for (const [id, entity] of this.lifecycles.entities) {
			const relevantInputs = inputs.filter(shell => shell.entity === id)
			entity.simulate(tick, relevantInputs)
		}
	}
}

