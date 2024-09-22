
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
		local: realm.instance(realm.env.guys.local),
		raw: realm.instance(realm.env.guys.raw),
		authentic: realm.instance(realm.env.guys.authentic),
		expected: realm.instance(realm.env.guys.expected),
		target: realm.instance(realm.env.guys.target),
	}

	guys.target.scaling.setAll(96 / 100)
	guys.expected.scaling.setAll(97 / 100)
	guys.raw.scaling.setAll(98 / 100)
	guys.authentic.scaling.setAll(99 / 100)

	function guyPosition(coordinates: Coordinates) {
		return coordinates
			.position()
			.add_(0, 1, 0)
			.array()
	}

	const backtracer = new Backtracer<Coordinates>()
	const authentic = Coordinates.zero()

	return {
		replicate({feed, feedback}) {
			const raw = Coordinates.array(feed.facts.coordinates)
			authentic.lerp(raw, 10 / 100)

			mover.movement.set(getMovement(realm.tact))
			mover.simulate()
			const local = mover.coordinates
			backtracer.add(local.clone())

			const expected = backtracer.rememberAgo(100) ?? raw.clone()

			const discrepancy = raw.clone().subtract(expected)
			const target = local.clone().add(discrepancy)

			local.lerp(target, 5 / 100)

			guys.local.position.set(...guyPosition(local))
			guys.raw.position.set(...guyPosition(raw))
			guys.authentic.position.set(...guyPosition(authentic))
			guys.expected.position.set(...guyPosition(expected))
			guys.target.position.set(...guyPosition(target))
			
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

