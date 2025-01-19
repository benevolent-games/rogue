
import {Trashbin} from "@benev/slate"
import {Degrees, Scalar, Vec2} from "@benev/toolbox"
import {Quaternion} from "@babylonjs/core/Maths/math.vector.js"

import {Realm} from "../../realm/realm.js"
import {RogueEntities} from "../entities.js"
import {constants} from "../../../constants.js"
import {PlayerInputs} from "./utils/player-inputs.js"
import {Circular} from "../../../tools/temp/circular.js"
import {Coordinates} from "../../realm/utils/coordinates.js"
import {replica} from "../../../archimedes/framework/replication/types.js"
import { Speedometer } from "./utils/speedometer.js"
import { Anglemeter } from "./utils/anglemeter.js"

const {smoothing, rotationSmoothing} = constants.crusader

export const crusaderReplica = replica<RogueEntities, Realm>()<"crusader">(
	({realm, state, replicator}) => {

	const {lighting, buddies, materials, pimsleyFactory} = realm
	const inControl = state.author === replicator.author

	function buddyPosition(coordinates: Coordinates) {
		return coordinates
			.position()
			.add_(0, 0, 0)
	}

	const [pimsley, pimsleyRelease] = pimsleyFactory.acquire()
	const rotationOffset = Degrees.toRadians(180)

	console.log(pimsley)

	// const buddy = inControl
	// 	? buddies.create(materials.cyan)
	// 	: buddies.create(materials.yellow)

	const initial = Coordinates.from(state.coordinates)
	const buddyCoordinates = initial.clone()
	const smoothedRotation = new Scalar(state.rotation)

	const trashbin = new Trashbin()
	const playerInputs = new PlayerInputs(realm, state, buddyCoordinates)

	if (inControl) {
		realm.cameraman.pivotInstantly(buddyCoordinates.clone())
	}

	const speedometer = new Speedometer(buddyCoordinates)
	const anglemeter = new Anglemeter(smoothedRotation.x)

	return {
		gatherInputs: () => inControl ? [playerInputs.get()] : undefined,
		replicate: (_tick, state) => {
			buddyCoordinates.lerp_(...state.coordinates, smoothing)
			const position = buddyPosition(buddyCoordinates)

			smoothedRotation.x = Circular.lerp(smoothedRotation.x, state.rotation, rotationSmoothing)
			const correctedRotation = smoothedRotation.x + rotationOffset

			pimsley.root.position.set(...position.array())
			pimsley.root.rotationQuaternion = Quaternion.RotationYawPitchRoll(correctedRotation, 0, 0)

			const angularVelocity = anglemeter
				.update(smoothedRotation.x)

			const relativeVelocity = speedometer
				.update(buddyCoordinates)
				.rotate(-correctedRotation)

			pimsley.anims.amble.animate(relativeVelocity, angularVelocity)

			if (inControl) {
				realm.cameraman.desired.pivot = buddyCoordinates
				realm.playerPosition = position
				lighting.torch.position.set(
					...buddyCoordinates
						.position()
						.add_(0, 3, 0)
						.array()
				)
			}
		},

		dispose: () => {
			pimsleyRelease()
			trashbin.dispose()
		},
	}
})

