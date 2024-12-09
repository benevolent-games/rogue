
import {interval} from "@benev/slate"

import {constants} from "../../constants.js"
import {Station} from "../station/station.js"
import {simulas} from "../entities/simulas.js"
import {LagProfile} from "../../tools/fake-lag.js"
import {RogueEntities} from "../entities/entities.js"
import {Coordinates} from "../realm/utils/coordinates.js"
import {DungeonLayout} from "../dungeons/dungeon-layout.js"
import {GameState, Simulator} from "../../archimedes/exports.js"
import {Cathedral} from "../../archimedes/net/relay/cathedral.js"
import {stdDungeonOptions} from "../dungeons/layouting/options.js"
import {MultiplayerHost} from "../../archimedes/net/multiplayer/multiplayer-host.js"

export async function dedicatedHostFlow({lag}: {lag: LagProfile | null}) {
	const station = new Station()
	const gameState = new GameState()
	const simulator = new Simulator<RogueEntities, Station>(station, gameState, simulas)

	const dungeonOptions = stdDungeonOptions()
	const dungeon = new DungeonLayout(dungeonOptions)
	const getSpawnpoint = dungeon.makeSpawnpointGetterFn()

	simulator.create("dungeon", {options: dungeonOptions})

	const cathedral = new Cathedral({
		lag,
		onBundle: ({author}) => {
			const playerId = simulator.create("crusader", {
				author,
				speed: 5 / 100,
				speedSprint: 10 / 100,
				coordinates: Coordinates.import(getSpawnpoint()).array(),
			})
			return () => simulator.delete(playerId)
		},
	})

	let tick = 0

	const stopSnapshots = interval(1000, () => {
		const data = simulator.gameState.snapshot()
		cathedral.broadcastSnapshot({tick, data})
	})

	const stopTicks = interval.hz(constants.game.tickRate, () => {
		const {inputs} = cathedral.collectivize()
		simulator.simulate(tick++, inputs)
		if (inputs.length > 0)
			cathedral.broadcastInputs(inputs)
	})

	async function startMultiplayer() {
		return MultiplayerHost.host(cathedral)
	}

	const dispose = () => {
		stopSnapshots()
		stopTicks()
		cathedral.dispose()
	}

	return {cathedral, station, simulator, startMultiplayer, dispose}
}

