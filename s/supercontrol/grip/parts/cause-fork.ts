
import {Cause} from "./cause.js"
import {CauseSpoon} from "./cause-spoon.js"

/** group of spoons with an OR relationship */
export class CauseFork extends Cause {
	constructor(public spoons: Set<CauseSpoon>) {
		super()

		// forward tap events
		for (const spoon of spoons) {
			if (spoon.interpreter.style === "tap") {
				spoon.interpreter.tap.input.on(tapped => this.input.on.publish(tapped))
				spoon.interpreter.tap.pressed.on(tapped => this.pressed.on.publish(tapped))
			}
		}
	}

	update() {
		let input = 0
		let pressed = false

		for (const spoon of this.spoons) {
			spoon.update()
			input += spoon.amalgam.input.value
			pressed ||= spoon.amalgam.pressed.value
		}

		this.input.value = input
		this.pressed.value = pressed
	}
}

