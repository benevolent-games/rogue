
import {GameState} from "../game-state.js"
import {InputHistory} from "../input-history.js"

export class Simulator<xStation, xSimulas> {
	constructor(
		public gameState: GameState,
		public inputHistory: InputHistory,
	) {}

	simulator(tick: number) {}
}

