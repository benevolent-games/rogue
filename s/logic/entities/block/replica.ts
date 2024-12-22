
import {MeshBuilder} from "@babylonjs/core"

import {readBlock} from "./state.js"
import {Realm} from "../../realm/realm.js"
import {RogueEntities} from "../entities.js"
import {replica} from "../../../archimedes/framework/replication/types.js"

export const blockReplica = replica<RogueEntities, Realm>()<"block">(
	({realm, state}) => {

	const {coordinates, dimensions, height} = readBlock(state)
	const mesh = MeshBuilder.CreateBox("block", {size: 1})
	mesh.material = realm.materials.pearl
	mesh.scaling.set(dimensions.x, height, dimensions.y)
	mesh.position.set(...coordinates.position().array())

	return {
		gatherInputs: () => undefined,

		replicate: (_, state) => {
			const {coordinates} = readBlock(state)
			mesh.position.set(...coordinates.position().array())
		},

		dispose: () => {
		},
	}
})

