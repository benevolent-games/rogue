
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

	const interpolatedCoordinates = Coordinates.zero()

	const expectedDelay = 45
	const backtracer = new Backtracer<Coordinates>()
	const alpha = Coordinates.zero()

	return {
		replicate({feed, feedback}) {
			const factualCoordinates = Coordinates.array(feed.facts.coordinates)
			interpolatedCoordinates.lerp(factualCoordinates, 1 / 10)

			mover.movement.set(getMovement(realm.tact))
			mover.simulate()
			backtracer.add(mover.coordinates.clone())

			const oldPrediction = backtracer.rememberAgo(expectedDelay)
				?? factualCoordinates.clone()

			alpha.lerp(oldPrediction, 1 / 10)

			const projection = interpolatedCoordinates
				.clone()
				.add(mover.coordinates.clone().subtract(alpha))

			const discrepancy = projection.distance(mover.coordinates)
			console.log("discrepancy", discrepancy)

			const predictedCoordinates = mover.coordinates

			// // CORRECTIVE DRIFT :/
			// if (discrepancy > 1)
			// 	mover.coordinates.lerp(interpolatedCoordinates, 5 / 100)

			guys.raw.position.set(...guyPosition(factualCoordinates))
			guys.predicted.position.set(...guyPosition(predictedCoordinates))
			guys.interpolated.position.set(...guyPosition(interpolatedCoordinates))
			guys.backtrace.position.set(...guyPosition(projection))
			
			realm.env.camera.target.set(
				...cameraPosition
					.lerp(predictedCoordinates.position(), 1 / 10)
					.array()
			)

			feedback.sendData({movement: mover.movement.array()})
		},
		dispose() {},
	}
})

