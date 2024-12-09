
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

	const guy = realm.instance(realm.env.guys.target)
	const initial = Coordinates.from(state.coordinates)
	const guyCoordinates = initial.clone()
	const cameraCoordinates = initial.clone()

	return {
		replicate: (_, state) => {
			guyCoordinates.set_(...state.coordinates)
			cameraCoordinates.lerp(guyCoordinates, 10 / 100)

			guy.position.set(...guyPosition(guyCoordinates))

			realm.env.camera.target.set(
				...cameraCoordinates
					.position()
					.array()
			)

			if (inControl) {
				const data = getPlayerInput(realm.tact)
				return {input: {data, messages: []}}
			}
			else {
				return {input: undefined}
			}
		},
		dispose: () => {
			guy.dispose()
		},
	}
})

