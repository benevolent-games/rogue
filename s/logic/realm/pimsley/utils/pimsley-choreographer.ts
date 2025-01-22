
import {Ambler} from "./ambler.js"
import {PimsleyAnimState} from "../types.js"
import {Pallet} from "../../../../tools/babylon/logistics/pallet.js"
import {choosePimsleyAnims, PimsleyAnims} from "./choose-pimsley-anims.js"
import {BucketShare, BucketStack} from "../../../../tools/buckets/buckets.js"

export class PimsleyChoreographer {
	#anims: PimsleyAnims
	#graph: BucketStack
	#ambler: Ambler

	constructor(pallet: Pallet) {
		const anims = this.#anims = choosePimsleyAnims(pallet)

		this.#graph = new BucketStack([
			anims.attack,
			new BucketShare([
				anims.forward,
				anims.backward,
				anims.leftward,
				anims.rightward,
			]),
			anims.idle,
		])

		anims.attack.capacity = 0

		this.#ambler = new Ambler(anims)
	}

	animate(state: PimsleyAnimState) {
		this.#ambler.animate(state)
		this.#graph.dump()
		this.#graph.fill(1)
	}
}

