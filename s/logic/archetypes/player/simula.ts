
import {Vec2} from "@benev/toolbox"

import {PlayerArchetype} from "./types.js"
import {Station} from "../../station/station.js"
import {ReplicatorId} from "../../framework/types.js"
import {dataFromReplicator} from "../../framework/utils/feedback-utils.js"

export const playerSimula = Station.simula<PlayerArchetype>()(
	({owner, coordinates}: {
		owner: ReplicatorId
		coordinates: Vec2
	}) => () => {

	const speed = 0.1
	const movement = Vec2.zero()

	return {
		facts: {coordinates: coordinates.array()},
		simulate({feed, feedback}) {
			for (const data of dataFromReplicator(owner, feedback)) {
				movement
					.set_(...data.movement)
					.normalize()
					.multiplyBy(speed)
			}

			const coordinates = Vec2.array(feed.facts.coordinates)
				.add(movement)

			feed.facts = {
				coordinates: coordinates.array(),
			}
		},
		dispose() {},
	}
})

