
import {Vec2} from "@benev/toolbox"
import {Realm} from "../../realm/realm.js"
import {PlayerArchetype} from "./types.js"
import {Coordinates} from "../../realm/utils/coordinates.js"
import {getMovement} from "../../realm/utils/get-movement.js"

export const playerReplica = Realm.replica<PlayerArchetype>(
	({id, replicator, realm}) => {

	return {
		replicate({feed, feedback}) {
			const position = Vec2.array(feed.facts.position)
			const worldPosition = Coordinates.planarToWorld(position)
				.add_(0, 1, 0)
			realm.env.guy.position.set(...worldPosition.array())

			const movement = getMovement(realm.tact)
			feedback.sendData({movement: movement.array()})
		},
		dispose() {},
	}
})

