
import {Vec2} from "@benev/toolbox"

import {Station} from "../../station/station.js"
import {ReplicatorId} from "../../framework/types.js"
import {Coordinates} from "../../realm/utils/coordinates.js"
import {PlayerArchetype, PlayerConfig, PlayerInput} from "./types.js"
import {PlayerRollbackDriver} from "./utils/player-rollback-driver.js"
import {dataFromReplicator} from "../../framework/utils/feedback-utils.js"

export const playerSimula = Station.simula<PlayerArchetype>()(
	({owner, coordinates}: {
		owner: ReplicatorId
		coordinates: Coordinates
	}) => () => {

	const config: PlayerConfig = {
		speed: 5 / 100,
		speedSprint: 10 / 100,
	}

	const driver = new PlayerRollbackDriver({
		config,
		coordinates,
		maxChronicleEntries: 1,
	})

	const getFacts = (): PlayerArchetype["facts"] => ({
		config,
		coordinates: driver.coordinates.array(),
	})

	let input: PlayerInput = {
		sprint: false,
		intent: Vec2.zero(),
	}

	return {
		facts: getFacts(),
		simulate({feed, feedback}) {
			for (const data of dataFromReplicator(owner, feedback))
				input = data.input

			driver.simulate({input, obstacles: []})
			feed.facts = getFacts()
		},
		dispose() {},
	}
})

