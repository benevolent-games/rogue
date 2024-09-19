
import {Vec2} from "@benev/toolbox"

import {PlayerArchetype} from "./types.js"
import {Station} from "../../station/station.js"
import {ReplicatorId} from "../../framework/types.js"
import {handleFeedbackFrom} from "../../framework/utils/handle-feedback-from.js"

export const playerSimula = Station.simula<PlayerArchetype>()(
	({owner, position}: {
		owner: ReplicatorId
		position: Vec2
	}) => () => {

	console.log("yolo hello", position.toString())
	console.log("yolo hello2", position.array())

	return {
		facts: {position: position.array()},

		simulate({feed, feedback}) {
			handleFeedbackFrom(owner, feedback, f => {
				const movement = Vec2.array(f.data.movement)
					.normalize()

				const position = Vec2.array(feed.facts.position)
					.addV(movement)

				feed.facts = {
					position: position.array(),
				}
			})
		},

		dispose() {},
	}
})

