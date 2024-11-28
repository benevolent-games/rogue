
import {Signal} from "@benev/slate"

import {LagProfile} from "../tools/fake-lag.js"
import {playerHostFlow} from "./player-host.js"
import {Identity} from "../logic/multiplayer/types.js"

export async function levelTestFlow(o: {
		lag: LagProfile | null
		identity: Signal<Identity>
	}) {

	const flow = await playerHostFlow(o)

	flow.host.simulator.create("level", {
		seed: 6,
		gridExtents: {
			cells: [3, 3],
			tiles: [24, 24],
		},
		sectorWalk: {
			stepCount: 2,
			horizonDirection: [0, 1],
		},
	})

	return flow
}

