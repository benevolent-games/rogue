
import {Map2} from "@benev/slate"

import {SimulaReturn, Simulas} from "./types.js"
import {GameState} from "../parts/game-state.js"
import {Lifecycles} from "../parts/lifecycles.js"
import {Entities, InputShell} from "../parts/types.js"

export class Simulator<xEntities extends Entities, xStation> {
	lifecycles: Lifecycles<SimulaReturn<any>>

	constructor(
			public station: xStation,
			public gameState: GameState<xEntities>,
			public simulas: Simulas<xEntities, xStation>,
		) {

		this.lifecycles = new Lifecycles<SimulaReturn<any>>(
			new Map2(Object.entries(simulas).map(([kind, simula]) => {
				const fn = (id: number, state: any) => simula(station, id, state)
				return [kind, fn]
			}))
		)
	}

	simulate(tick: number, inputs: InputShell<any>[]) {
		this.lifecycles.conform(this.gameState)

		for (const [id, entity] of this.lifecycles.entities) {
			const entityState = this.gameState.entityStates.require(id)
			const entityInputs = inputs.filter(input => input.entity === id)
			entity.simulate(tick, entityState, entityInputs)
		}
	}
}

