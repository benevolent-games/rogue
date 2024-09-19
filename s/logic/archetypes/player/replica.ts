
import {Realm} from "../../realm/realm.js"
import {PlayerArchetype} from "./types.js"
import {getMovement} from "../../realm/utils/get-movement.js"

export const playerReplica = Realm.replica<PlayerArchetype>(
	({id, replicator, realm}) => {

	const stop = realm.tact.inputs.basic.buttons.moveNorth.on(() => {
		console.log("north?")
	})

	return {
		data: {movement: [0, 0]},

		replicate({feed, feedback}) {
			feedback.data = {movement: getMovement(realm.tact)}
		},

		dispose() {
			stop()
		},
	}
})

