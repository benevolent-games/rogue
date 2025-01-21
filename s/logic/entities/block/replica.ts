
import {readBlock} from "./state.js"
import {Realm} from "../../realm/realm.js"
import {RogueEntities} from "../entities.js"
import {replica} from "../../../archimedes/framework/replication/types.js"

export const blockReplica = replica<RogueEntities, Realm>()<"block">(
	({realm, state}) => {

	const {coordinates, dimensions} = readBlock(state)

	const block = realm.stuff.makeBlockGraphic()
	block.setDimensions(dimensions)
	block.setCoordinates(coordinates)

	const smoothCoordinates = coordinates.clone()

	return {
		gatherInputs: () => undefined,

		replicate: (_, state) => {
			const {coordinates} = readBlock(state)
			block.setCoordinates(
				smoothCoordinates.approach(coordinates, 8, realm.seconds)
			)
		},

		dispose: () => {
			block.dispose()
		},
	}
})

