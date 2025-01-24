
import {Trashbin} from "@benev/slate"
import {Circular, Quat} from "@benev/toolbox"

import {Realm} from "../../realm/realm.js"
import {RogueEntities} from "../entities.js"
import {constants} from "../../../constants.js"
import {PlayerInputs} from "./utils/player-inputs.js"
import {Coordinates} from "../../realm/utils/coordinates.js"
import {replica} from "../../../archimedes/framework/replication/types.js"
import {Pimsley, PimsleyCharacteristics} from "../../realm/pimsley/pimsley.js"

const debug = false
const {crusader} = constants

export const crusaderReplica = replica<RogueEntities, Realm>()<"crusader">(
	({realm, state, replicator}) => {

	const trash = new Trashbin()
	const {lighting, pimsleyPallets} = realm
	const inControl = state.author === replicator.author

	const characteristics: PimsleyCharacteristics = {
		block: state.block,
		attack: !!state.attack,
		rotation: new Circular(state.rotation),
		coordinates: Coordinates.from(state.coordinates),
	}

	const pallet = pimsleyPallets.acquireCleanly(trash)
	const pimsley = new Pimsley(pallet, characteristics)

	const capsule = debug
		? trash.disposable(
			realm.debugCapsules.get(crusader.height, crusader.radius)
		)
		: null

	const playerInputs = trash.disposable(
		new PlayerInputs(realm, state, characteristics.coordinates)
	)

	if (inControl)
		realm.cameraman.pivotInstantly(characteristics.coordinates.clone())

	return {
		gatherInputs: () => inControl
			? [playerInputs.get()]
			: undefined,

		replicate: (tick, state) => {
			characteristics.coordinates.set_(...state.coordinates)
			characteristics.rotation.set(state.rotation)

			characteristics.attack = !!state.attack
			characteristics.block = state.block

			pimsley.update({
				tick,
				seconds: realm.seconds,
				...characteristics,
			})

			if (capsule)
				capsule
					.setPosition(characteristics.coordinates.position())
					.setRotation(Quat.rotate_(0, pimsley.displayRotation.x, 0))

			if (inControl) {
				const position = pimsley.coordinates.position()
				realm.cameraman.desired.pivot = pimsley.coordinates
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

