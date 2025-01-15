
import {pubsub} from "@benev/slate"
import {CauseSpoon} from "./cause-spoon.js"

/** group of spoons with an OR relationship */
export class CauseFork {
	value = 0
	previous = 0
	spoons = new Set<CauseSpoon>()
	on = pubsub<[CauseFork]>()

	get pressed() {
		return Math.abs(this.value) >= 0.5
	}

	update() {
		this.previous = this.value
		this.value = 0
		for (const spoon of this.spoons) {
			spoon.update()
			this.value += spoon.value
		}
		if (this.previous !== this.value)
			this.on.publish(this)
	}
}

