
import {Trashbin} from "@benev/slate"
import {Quaternion} from "@babylonjs/core/Maths/math.vector.js"

import {Realm} from "../../realm/realm.js"
import {RogueEntities} from "../entities.js"
import {replica} from "../../../archimedes/exports.js"
import {getPlayerInput} from "./utils/get-player-input.js"
import {Coordinates} from "../../realm/utils/coordinates.js"

export const crusaderReplica = replica<RogueEntities, Realm>()<"crusader">(
	({realm, state, replicator}) => {

	const {lighting, buddies, materials, tact, cameraman, cursor} = realm
	const inControl = state.author === replicator.author

	function buddyPosition(coordinates: Coordinates) {
		return coordinates
			.position()
			.add_(0, 1, 0)
	}

	const buddy = inControl
		? buddies.create(materials.cyan)
		: buddies.create(materials.yellow)

	const initial = Coordinates.from(state.coordinates)
	const buddyCoordinates = initial.clone()

	const trashbin = new Trashbin()

	if (inControl) {
		realm.cameraman.pivotInstantly(buddyCoordinates.clone())
	}

	return {
		gatherInputs: () => {
			if (inControl) {
				const input = getPlayerInput(tact, cameraman, cursor, buddyCoordinates)
				return [input]
			}
		},

		replicate: (_tick, state) => {
			buddyCoordinates.lerp_(...state.coordinates, 30 / 100)
			const position = buddyPosition(buddyCoordinates)
			buddy.position.set(...position.array())
			buddy.rotationQuaternion = Quaternion.RotationYawPitchRoll(state.rotation, 0, 0)

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
			buddy.dispose()
			trashbin.dispose()
		},
	}
})

