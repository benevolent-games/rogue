
import {pubsub} from "@benev/slate"
import {Cause} from "./cause.js"
import {CauseSpoon} from "./cause-spoon.js"

/** group of spoons with an OR relationship */
export class CauseFork extends Cause {
	spoons = new Set<CauseSpoon>()
	on = pubsub<[CauseFork]>()

	update() {
		let value = 0
		for (const spoon of this.spoons) {
			spoon.update()
			value += spoon.value
		}
		this.value = value
	}
}

