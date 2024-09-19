
import {vec2, Vec2} from "@benev/toolbox"

import {PlayerArchetype} from "./types.js"
import {Station} from "../../station/station.js"
import {ReplicatorId} from "../../framework/types.js"
import {handleFeedbackFrom} from "../../framework/utils/handle-feedback-from.js"

export const playerSimula = Station.simula<PlayerArchetype>()(
	({owner, position}: {
		owner: ReplicatorId
		position: Vec2
	}) => () => {

	return {
		facts: {position},

		simulate({feed, feedback}) {
			handleFeedbackFrom(owner, feedback, f => {
				const {movement} = f.data
				feed.facts = {
					position: vec2.add(
						feed.facts.position,
						vec2.normalize(vec2.clamp(movement, -1, 1)),
					),
				}
			})
		},

		dispose() {},
	}
})

