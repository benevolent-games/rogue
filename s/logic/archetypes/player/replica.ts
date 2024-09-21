
import {Vec3} from "@benev/toolbox"
import {Realm} from "../../realm/realm.js"
import {PlayerArchetype} from "./types.js"
import {Backtracer, PlayerMovementSimulator} from "./utils.js"
import {Coordinates} from "../../realm/utils/coordinates.js"
import {getMovement} from "../../realm/utils/get-movement.js"

export const playerReplica = Realm.replica<PlayerArchetype>(
	({realm}) => {

	const cameraPosition = Vec3.zero()
	const mover = new PlayerMovementSimulator()

	const guys = {
		predicted: realm.instance(realm.env.guys.happy),
		interpolated: realm.instance(realm.env.guys.spicy),
		raw: realm.instance(realm.env.guys.angry),
		backtrace: realm.instance(realm.env.guys.sad),
	}

	guys.backtrace.scaling.setAll(97 / 100)
	guys.raw.scaling.setAll(98 / 100)
	guys.interpolated.scaling.setAll(99 / 100)

	function guyPosition(coordinates: Coordinates) {
		return coordinates
			.position()
			.add_(0, 1, 0)
			.array()
	}

	const backtracer = new Backtracer<Coordinates>()
	const authoritative = Coordinates.zero()
	const expected = Coordinates.zero()

	return {
		replicate({feed, feedback}) {
			const raw = Coordinates.array(feed.facts.coordinates)
			authoritative.lerp(raw, 2 / 10)

			mover.movement.set(getMovement(realm.tact))
			mover.simulate()
			const local = mover.coordinates
			backtracer.add(local.clone())

			const expectedRaw = backtracer.rememberAgo(45) ?? raw.clone()
			expected.lerp(expectedRaw, 2 / 10)

			const discrepancy = raw.clone().subtract(expected)
			local.add(discrepancy.multiplyBy(.05))

			guys.raw.position.set(...guyPosition(raw))
			guys.predicted.position.set(...guyPosition(local))
			guys.interpolated.position.set(...guyPosition(authoritative))
			guys.backtrace.position.set(...guyPosition(expected))
			
			realm.env.camera.target.set(
				...cameraPosition
					.lerp(local.position(), 1 / 10)
					.array()
			)

			feedback.sendData({movement: mover.movement.array()})
		},
		dispose() {},
	}
})

