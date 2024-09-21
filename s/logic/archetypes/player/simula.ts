
import {Vec2} from "@benev/toolbox"

import {PlayerArchetype} from "./types.js"
import {Station} from "../../station/station.js"
import {PlayerMovementSimulator} from "./utils.js"
import {ReplicatorId} from "../../framework/types.js"
import {dataFromReplicator} from "../../framework/utils/feedback-utils.js"

export const playerSimula = Station.simula<PlayerArchetype>()(
	({owner, coordinates}: {
		owner: ReplicatorId
		coordinates: Vec2
	}) => () => {

	const mover = new PlayerMovementSimulator()
	mover.coordinates.set(coordinates)

	const getFacts = (): PlayerArchetype["facts"] => ({
		coordinates: mover.coordinates.array(),
	})

	return {
		facts: getFacts(),
		simulate({feed, feedback}) {
			for (const data of dataFromReplicator(owner, feedback))
				mover.movement.set_(...data.movement)

			mover.simulate()

			feed.facts = getFacts()
		},
		dispose() {},
	}
})

