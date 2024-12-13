
import {Realm} from "../../realm/realm.js"
import {RogueEntities} from "../entities.js"
import {replica} from "../../../archimedes/exports.js"
import {getPlayerInput} from "./utils/get-player-input.js"
import {Coordinates} from "../../realm/utils/coordinates.js"

export const crusaderReplica = replica<RogueEntities, Realm>()<"crusader">(
	({realm, state, replicator}) => {

	const inControl = state.author === replicator.author

	function guyPosition(coordinates: Coordinates) {
		return coordinates
			.position()
			.add_(0, 1, 0)
			.array()
	}

	const guy = realm.instance(
		inControl
			? realm.env.guys.local
			: realm.env.guys.remote
	)

	const initial = Coordinates.from(state.coordinates)
	const guyCoordinates = initial.clone()
	const cameraCoordinates = initial.clone()

	return {
		gatherInputs: () => {
			if (inControl) {
				const input = getPlayerInput(realm.tact)
				return [input]
			}
		},

		replicate: (_, state) => {
			guyCoordinates.lerp_(...state.coordinates, 30 / 100)
			guy.position.set(...guyPosition(guyCoordinates))
			if (inControl) {
				cameraCoordinates.lerp(guyCoordinates, 10 / 100)
				realm.cameraman.coordinates = cameraCoordinates
				realm.env.torch.position.set(...guyCoordinates.position().add_(0, 3, 0).array())
			}
		},

		dispose: () => {
			guy.dispose()
		},
	}
})

