
import {pubsub} from "@benev/slate"
import {Cause} from "./cause.js"
import {CauseSpoon} from "./cause-spoon.js"

/** group of spoons with an OR relationship */
export class CauseFork {
	value = 0
	previous = 0
	spoons = new Set<CauseSpoon>()
	on = pubsub<[CauseFork]>()

	get pressed() {
		return Cause.isPressed(this.value)
	}

	get valueChanged() {
		return this.value === this.previous
	}

	get pressedChanged() {
		return Cause.isPressed(this.value) !== Cause.isPressed(this.previous)
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

