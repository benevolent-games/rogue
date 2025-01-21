
import {Trashbin} from "@benev/slate"
import {Circular, Quat} from "@benev/toolbox"

import {Realm} from "../../realm/realm.js"
import {RogueEntities} from "../entities.js"
import {constants} from "../../../constants.js"
import {PlayerInputs} from "./utils/player-inputs.js"
import {Pimsley} from "../../realm/pimsley/pimsley.js"
import {Coordinates} from "../../realm/utils/coordinates.js"
import {replica} from "../../../archimedes/framework/replication/types.js"

const debug = false
const {crusader} = constants

export const crusaderReplica = replica<RogueEntities, Realm>()<"crusader">(
	({realm, state, replicator}) => {

	const trash = new Trashbin()
	const {lighting, pimsleyPallets} = realm
	const inControl = state.author === replicator.author

	const rotation = new Circular(state.rotation)
	const coordinates = Coordinates.from(state.coordinates)

	const pallet = pimsleyPallets.acquireCleanly(trash)
	const pimsley = new Pimsley({pallet, rotation, coordinates})

	const capsule = debug
		? trash.disposable(
			realm.debugCapsules.get(crusader.height, crusader.radius)
		)
		: null

	const playerInputs = trash.disposable(
		new PlayerInputs(realm, state, coordinates)
	)

	if (inControl)
		realm.cameraman.pivotInstantly(coordinates.clone())

	return {
		gatherInputs: () => inControl
			? [playerInputs.get()]
			: undefined,

		replicate: (tick, state) => {
			coordinates.set_(...state.coordinates)
			rotation.set(state.rotation)

			pimsley.update(tick)

			if (capsule)
				capsule
					.setPosition(coordinates.position())
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

