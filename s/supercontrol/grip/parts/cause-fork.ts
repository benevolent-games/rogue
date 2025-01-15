
import {pubsub} from "@benev/slate"
import {CauseSpoon} from "./cause-spoon.js"
import {isPressed} from "../utils/is-pressed.js"

/** group of spoons with an OR relationship */
export class CauseFork {
	value = 0
	previous = 0
	spoons = new Set<CauseSpoon>()
	on = pubsub<[CauseFork]>()

	get pressed() {
		return isPressed(this.value)
	}

	get valueChanged() {
		return this.value === this.previous
	}

	get pressedChanged() {
		return isPressed(this.value) !== isPressed(this.previous)
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

