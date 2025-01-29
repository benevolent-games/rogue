
import {Trashbin} from "@benev/slate"
import {Circular} from "@benev/toolbox"

import {Realm} from "../../realm/realm.js"
import {RogueEntities} from "../entities.js"
import {constants} from "../../../constants.js"
import {BipedRep} from "../../commons/biped/rep.js"
import {Coordinates} from "../../realm/utils/coordinates.js"
import {PimsleyCharacteristics} from "../../realm/pimsley/pimsley.js"
import {replica} from "../../../archimedes/framework/replication/types.js"

const debug = false
const {crusader} = constants

export const botReplica = replica<RogueEntities, Realm>()<"bot">(
	({realm, getState}) => {

	const {biped} = getState()
	const trash = new Trashbin()

	const characteristics: PimsleyCharacteristics = {
		block: biped.block,
		attack: !!biped.attack,
		rotation: new Circular(biped.rotation),
		coordinates: Coordinates.from(biped.coordinates),
	}

	const bipedRep = trash.disposable(
		new BipedRep(realm, () => getState().biped, {...crusader, debug})
	)

	return {
		gatherInputs: () => undefined,

		replicate: tick => {
			const {biped} = getState()
			characteristics.coordinates.set_(...biped.coordinates)
			characteristics.rotation.set(biped.rotation)
			characteristics.attack = !!biped.attack
			characteristics.block = biped.block
			bipedRep.replicate(tick)
		},

		dispose: () => {
			trash.dispose()
		},
	}
})

