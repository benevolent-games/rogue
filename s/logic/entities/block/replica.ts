
import {MeshBuilder} from "@babylonjs/core"

import {readBlock} from "./state.js"
import {Realm} from "../../realm/realm.js"
import {RogueEntities} from "../entities.js"
import {Coordinates} from "../../realm/utils/coordinates.js"
import {replica} from "../../../archimedes/framework/replication/types.js"

export const blockReplica = replica<RogueEntities, Realm>()<"block">(
	({realm, state}) => {

	const {coordinates, dimensions, height} = readBlock(state)

	const mesh = MeshBuilder.CreateBox("block", {size: 1})
	mesh.material = realm.materials.pearl
	mesh.scaling.set(dimensions.x, height, dimensions.y)

	function setPosition(coordinates: Coordinates) {
		mesh.position.set(
			...coordinates
				.position()
				.add_(0, height / 2, 0)
				.array()
		)
	}

	setPosition(coordinates)

	return {
		gatherInputs: () => undefined,

		replicate: (_, state) => {
			const {coordinates} = readBlock(state)
			setPosition(coordinates)
		},

		dispose: () => {
		},
	}
})

