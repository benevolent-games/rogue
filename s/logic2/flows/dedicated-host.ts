
import {deep, interval} from "@benev/slate"

import {Station} from "../station/station.js"
import {simulas} from "../entities/simulas.js"
import {LagProfile} from "../../tools/fake-lag.js"
import {GameState, Simulator} from "../../archimedes/exports.js"
import {RogueEntities} from "../entities/entities.js"
import {stdDungeonOptions} from "../dungeons/layouting/options.js"
import {DungeonLayout} from "../dungeons/dungeon-layout.js"

export async function dedicatedHostFlow({lag}: {lag: LagProfile | null}) {
	const station = new Station()
	const gameState = new GameState()
	const simulator = new Simulator<RogueEntities, Station>(station, gameState, simulas)

	const dungeonOptions = stdDungeonOptions()
	const dungeon = new DungeonLayout(dungeonOptions)
	const getSpawnpoint = dungeon.makeSpawnpointGetterFn()

	simulator.create("dungeon", {options: dungeonOptions})

	// TODO

	// const cathedral = new Cathedral({
	// 	lag,
	// 	onBundle: ({replicatorId}) => {
	// 		const playerId = simulator.create("player", {
	// 			owner: replicatorId,
	//
	// 			coordinates: Coordinates.import(getSpawnpoint()),
	//
	// 			// // TODO
	// 			// coordinates: Coordinates.new(0.5, 0.5),
	// 		})
	// 		return () => simulator.destroy(playerId)
	// 	},
	// })
	//
	// const stopSnapshots = interval(1000, () => {
	// 	const snapshot = deep.clone(simulator.snapshot())
	// 	cathedral.broadcastSnapshot(snapshot)
	// })
	//
	// const stopTicks = interval.hz(60, () => {
	// 	const feedbacks = cathedral.collectAllFeedbacks()
	// 	simulator.simulate(feedbacks)
	// 	const feed = deep.clone(simulator.collector.take())
	// 	cathedral.broadcastFeed(feed)
	// })
	//
	// async function startMultiplayer() {
	// 	return MultiplayerHost.host(cathedral)
	// }
	//
	// const dispose = () => {
	// 	stopSnapshots()
	// 	stopTicks()
	// 	cathedral.dispose()
	// }
	//
	// return {cathedral, station, simulator, startMultiplayer, dispose}
}


