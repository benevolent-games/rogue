
import {SmoothVector, Vec2, Vec3Array} from "@benev/toolbox"
import {Realm} from "../../realm/realm.js"
import {PlayerArchetype} from "./types.js"
import {Coordinates} from "../../realm/utils/coordinates.js"
import {getMovement} from "../../realm/utils/get-movement.js"

export const playerReplica = Realm.replica<PlayerArchetype>(
	({realm}) => {

	const camposition = new SmoothVector<Vec3Array>(30, [0, 0, 0])

	return {
		replicate({feed, feedback}) {
			const position = Vec2.array(feed.facts.position)
			const p = Coordinates
				.planarToWorld(position)
				.add_(0, 1, 0)
				.array()

			realm.env.guy.position.set(...p)
			camposition.target = p
			realm.env.camera.target.set(...camposition.tick())

			const movement = getMovement(realm.tact)
			feedback.sendData({movement: movement.array()})
		},
		dispose() {},
	}
})

