
import {Vec3} from "@benev/toolbox"
import {Realm} from "../../realm/realm.js"
import {PlayerArchetype} from "./types.js"
import {Coordinates} from "../../realm/utils/coordinates.js"
import {getMovement} from "../../realm/utils/get-movement.js"

export const playerReplica = Realm.replica<PlayerArchetype>(
	({realm}) => {

	const cameraPosition = Vec3.zero()

	return {
		replicate({feed, feedback}) {
			const position = Coordinates.array(feed.facts.coordinates)
				.position()
				.add_(0, 1, 0)

			realm.env.guy.position.set(...position.array())
			
			realm.env.camera.target.set(
				...cameraPosition
					.lerp(position, 1 / 100)
					.array()
			)

			const movement = getMovement(realm.tact)
			feedback.sendData({movement: movement.array()})
		},
		dispose() {},
	}
})

