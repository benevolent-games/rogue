
import {Station} from "./station.js"
import {simulas} from "../entities/simulas.js"
import {RogueEntities} from "../entities/entities.js"
import {InputShell} from "../../archimedes/framework/parts/types.js"
import {GameState} from "../../archimedes/framework/parts/game-state.js"
import {Simulator} from "../../archimedes/framework/simulation/simulator.js"

export class Simtron {
	station = new Station()
	gameState = new GameState()
	simulator = new Simulator<RogueEntities, Station>(
		this.station,
		this.gameState,
		simulas,
	)

	simulate(tick: number, inputs: InputShell<any>[]) {
		this.simulator.simulate(tick, inputs)
		if (this.station.dungeon) {
			this.station.dungeon.phys.simulate()
		}
	}
}

