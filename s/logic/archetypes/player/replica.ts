
import {Realm} from "../../realm/realm.js"
import {PlayerArchetype} from "./types.js"
import {Coordinates} from "../../realm/utils/coordinates.js"
import {getMovement} from "../../realm/utils/get-movement.js"

export const playerReplica = Realm.replica<PlayerArchetype>(
	({id, replicator, realm}) => {

	return {
		data: {movement: [0, 0]},

		replicate({feed, feedback}) {
			realm.env.guy.position.set(
				...Coordinates.planarToWorld(feed.facts.position),
			)

			feedback.data = {movement: getMovement(realm.tact)}
		},

		dispose() {},
	}
})

