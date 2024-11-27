
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
		seed: 4,
		gridExtents: {
			cells: [3, 3],
			tiles: [24, 24],
		},
		sectorWalk: {
			stepCount: 5,
			horizonDirection: [0, 1],
		},
	})

	return flow
}

