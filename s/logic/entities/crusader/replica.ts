
import {Trashbin} from "@benev/slate"
import {Degrees, Circular, Scalar} from "@benev/toolbox"
import {Quaternion} from "@babylonjs/core/Maths/math.vector.js"

import {Realm} from "../../realm/realm.js"
import {RogueEntities} from "../entities.js"
import {constants} from "../../../constants.js"
import {Anglemeter} from "./utils/anglemeter.js"
import {Speedometer} from "./utils/speedometer.js"
import {PlayerInputs} from "./utils/player-inputs.js"
import {Coordinates} from "../../realm/utils/coordinates.js"
import {DrunkHeading} from "../../realm/pimsley/utils/drunk-heading.js"
import {replica} from "../../../archimedes/framework/replication/types.js"

const {smoothing} = constants.crusader

export const crusaderReplica = replica<RogueEntities, Realm>()<"crusader">(
	({realm, state, replicator}) => {

	const {lighting, pimsleyFactory} = realm
	const inControl = state.author === replicator.author

	function buddyPosition(coordinates: Coordinates) {
		return coordinates
			.position()
			.add_(0, 0, 0)
	}

	const [pimsley, pimsleyRelease] = pimsleyFactory.acquire()
	const rotationOffset = Degrees.toRadians(180)
	const drunkHeading = new DrunkHeading()

	// const buddy = inControl
	// 	? buddies.create(materials.cyan)
	// 	: buddies.create(materials.yellow)

	const initial = Coordinates.from(state.coordinates)
	const buddyCoordinates = initial.clone()

	const trashbin = new Trashbin()
	const playerInputs = new PlayerInputs(realm, state, buddyCoordinates)

	if (inControl) {
		realm.cameraman.pivotInstantly(buddyCoordinates.clone())
	}

	const turningSpeed = new Scalar(Degrees.toRadians(240))
	const rotation = new Circular(state.rotation)
	const speedometer = new Speedometer(buddyCoordinates)
	const anglemeter = new Anglemeter(rotation.x)

	return {
		gatherInputs: () => inControl
			? [playerInputs.get()]
			: undefined,

		replicate: (tick, state) => {
			const deltaTime = 1 / constants.sim.tickRate

			buddyCoordinates.lerp_(...state.coordinates, smoothing)
			const position = buddyPosition(buddyCoordinates)
			const absoluteVelocity = speedometer.update(buddyCoordinates)

			const speed = absoluteVelocity.magnitude()

			const turningSpeedTarget = speed < 1
				? Scalar.remap(
					speed,
					0, 1,
					Degrees.toRadians(1000), Degrees.toRadians(540),
					true,
				)
				: Scalar.remap(
					speed,
					1, constants.crusader.speedSprint,
					Degrees.toRadians(540), Degrees.toRadians(180),
					true,
				)

			turningSpeed.lerp(turningSpeedTarget, 0.03)
			rotation.lerp(state.rotation, 0.4, turningSpeed.x * deltaTime)

			const rotationTweakFactor = Scalar.remap(
				speed,
				0, constants.crusader.speedSprint,
				0, 1,
				true,
			)

			const rotationTweak = rotationTweakFactor * drunkHeading.update(tick) * Degrees.toRadians(60)
			const correctedRotation = rotation.x + rotationOffset + rotationTweak

			pimsley.root.position.set(...position.array())
			pimsley.root.rotationQuaternion = Quaternion.RotationYawPitchRoll(correctedRotation, 0, 0)

			const angularVelocity = anglemeter.update(rotation.x)
			const relativeVelocity = absoluteVelocity.rotate(-correctedRotation)

			pimsley.anims.amble.animate(tick, relativeVelocity, angularVelocity)

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

