
import {Signal} from "@benev/slate"

import {LagProfile} from "../tools/fake-lag.js"
import {playerHostFlow} from "./player-host.js"
import {Identity} from "../logic/multiplayer/types.js"

export async function levelTestFlow(o: {
		lag: LagProfile | null
		identity: Signal<Identity>
	}) {

	const flow = await playerHostFlow(o)

	console.log("CREATE LEVEL")
	flow.host.simulator.create("level", {
		seed: 1,
		gridExtents: {
			cells: [3, 3],
			tiles: [11, 11],
		},
		sectorWalk: {
			stepCount: 10,
			horizonDirection: [0, 1],
		},
	})

	return flow
}

