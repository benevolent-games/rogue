
import {Signal} from "@benev/slate"

import {LagProfile} from "../tools/fake-lag.js"
import {playerHostFlow} from "./player-host.js"
import {Identity} from "../logic/multiplayer/types.js"
import {stdDungeonOptions} from "../logic/dungeons/std-dungeon-options.js"

export async function levelTestFlow(o: {
		lag: LagProfile | null
		identity: Signal<Identity>
	}) {

	const flow = await playerHostFlow(o)
	// flow.host.simulator.create("level", stdDungeonOptions())
	return flow
}

