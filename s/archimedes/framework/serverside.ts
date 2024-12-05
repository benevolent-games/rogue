
export class Serverside {
	currentTick = 0
	simulator = new Simulator()
	gameState = new GameState()
	inputStream = new InputStream()

	addInput(inputs: GameInput[]) {}

	tick(inputs: GameInput[]) {
		const tick = this.currentTick++
		const {simulator, gameState, inputStream} = this
		simulator.simulate(tick, gameState, inputStream)
	}
}

