
import {Trashbin} from "@benev/slate"

import {Realm} from "../../realm/realm.js"
import {RogueEntities} from "../entities.js"
import {constants} from "../../../constants.js"
import {BipedRep} from "../../commons/biped/rep.js"
import {PlayerInputs} from "./utils/player-inputs.js"
import {replica} from "../../../archimedes/framework/replication/types.js"

const debug = false
const {crusader} = constants

export const crusaderReplica = replica<RogueEntities, Realm>()<"crusader">(
	({realm, state, replicator}) => {

	const {biped} = state
	const trash = new Trashbin()
	const {lighting} = realm
	const inControl = state.author === replicator.author

	const bipedRep = trash.disposable(
		new BipedRep(realm, biped, {...crusader, debug})
	)

	const playerInputs = trash.disposable(
		new PlayerInputs(realm, bipedRep.characteristics.coordinates)
	)

	if (inControl)
		realm.cameraman.pivotInstantly(bipedRep.characteristics.coordinates.clone())

	return {
		gatherInputs: () => inControl
			? [playerInputs.get()]
			: undefined,

		replicate: (tick, {biped}) => {
			bipedRep.characteristics.coordinates.set_(...biped.coordinates)
			bipedRep.characteristics.rotation.set(biped.rotation)
			bipedRep.characteristics.attack = !!biped.attack
			bipedRep.characteristics.block = biped.block

			bipedRep.replicate(tick)

			if (inControl) {
				const position = bipedRep.pimsley.coordinates.position()
				realm.cameraman.desired.pivot = bipedRep.pimsley.coordinates
				realm.playerPosition = position
				lighting.torch.position.set(
					...position.clone()
						.add_(0, crusader.torchHeight, 0)
						.array()
				)
			}
		},

		dispose: () => {
			trash.dispose()
		},
	}
})

