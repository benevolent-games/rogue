
import {Ambler} from "./ambler.js"
import {PimsleyAnimState} from "../types.js"
import {choosePimsleyAnims} from "./choose-pimsley-anims.js"
import {AnimMixer, AnimStack} from "../../../../tools/anims.js"
import {Pallet} from "../../../../tools/babylon/logistics/pallet.js"

export class PimsleyChoreographer {
	#graph: AnimStack
	#ambler: Ambler

	constructor(pallet: Pallet) {
		const anims = choosePimsleyAnims(pallet)

		this.#graph = new AnimStack([
			anims.attack,
			new AnimMixer([
				anims.forward,
				anims.backward,
				anims.leftward,
				anims.rightward,
			]),
			anims.idle,
		])

		this.#ambler = new Ambler(anims)
	}

	animate(state: PimsleyAnimState) {
		this.#ambler.animate(state)
		this.#graph.update()
	}
}

