
import {Trashbin} from "@benev/slate"
import {Degrees, Circular, Scalar, Quat} from "@benev/toolbox"

import {Realm} from "../../realm/realm.js"
import {RogueEntities} from "../entities.js"
import {constants} from "../../../constants.js"
import {Anglemeter} from "./utils/anglemeter.js"
import {Speedometer} from "./utils/speedometer.js"
import {PlayerInputs} from "./utils/player-inputs.js"
import {Pimsley} from "../../realm/pimsley/pimsley.js"
import {Coordinates} from "../../realm/utils/coordinates.js"
import {DrunkHeading} from "../../realm/pimsley/utils/drunk-heading.js"
import {replica} from "../../../archimedes/framework/replication/types.js"

const {crusader} = constants

const debug = false

export const crusaderReplica = replica<RogueEntities, Realm>()<"crusader">(
	({realm, state, replicator}) => {

	const trash = new Trashbin()
	const {lighting, pimsleyPallets} = realm
	const inControl = state.author === replicator.author
	const coordinates = Coordinates.from(state.coordinates)

	const pallet = pimsleyPallets.acquireCleanly(trash)
	const pimsley = new Pimsley({pallet})

	const rotationOffset = Degrees.toRadians(180)
	const drunkHeading = new DrunkHeading()

	const playerInputs = trash.disposable(
		new PlayerInputs(realm, state, coordinates)
	)

	if (inControl) {
		realm.cameraman.pivotInstantly(coordinates.clone())
	}

	const turningSpeed = new Scalar(Degrees.toRadians(240))
	const rotation = new Circular(state.rotation)
	const speedometer = new Speedometer(coordinates)
	const anglemeter = new Anglemeter(rotation.x)

	const capsule = debug
		? trash.disposable(
			realm.debugCapsules.get(crusader.height, crusader.radius)
		)
		: null

	return {
		gatherInputs: () => inControl
			? [playerInputs.get()]
			: undefined,

		replicate: (tick, state) => {
			const deltaTime = 1 / constants.sim.tickRate

			const rawCoordinates = Coordinates.from(state.coordinates)
			const rawPosition = rawCoordinates.position()

			coordinates.lerp(rawCoordinates, crusader.smoothing)
			const position = coordinates.position()

			const absoluteVelocity = speedometer.update(coordinates)
			const speed = absoluteVelocity.magnitude()

			const turningSpeedTarget = Scalar.remap(
				speed,
				0, constants.crusader.speedSprint,
				constants.crusader.turnCaps.standstill, constants.crusader.turnCaps.fullsprint,
				true,
			)

			turningSpeed.lerp(turningSpeedTarget, 0.03)
			rotation.lerp(state.rotation, 0.4, turningSpeed.x * deltaTime)

			const rotationTweakFactor = Scalar.remap(
				speed,
				0, crusader.speedSprint,
				0, 1,
				true,
			)

			const rotationTweak = rotationTweakFactor * drunkHeading.update(tick) * crusader.sprintRotationMaxDeviation
			const correctedRotation = rotation.x + rotationOffset + rotationTweak

			if (capsule)
				capsule
					.setPosition(rawPosition)
					.setRotation(Quat.rotate_(0, correctedRotation, 0))

			pimsley.pallet.applySpatial({
				position,
				rotation: Quat.rotate_(0, correctedRotation, 0),
			})

			const angularVelocity = anglemeter.update(rotation.x)
			const relativeVelocity = absoluteVelocity.rotate(-correctedRotation)

			pimsley.anims.amble.animate(tick, relativeVelocity, angularVelocity)

			if (inControl) {
				realm.cameraman.desired.pivot = coordinates
				realm.playerPosition = position
				lighting.torch.position.set(
					...coordinates
						.position()
						.add_(0, 3, 0)
						.array()
				)
			}
		},

		dispose: () => {
			trash.dispose()
		},
	}
})

