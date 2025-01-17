
import {Cause} from "./cause.js"
import {isPressed} from "../utils/is-pressed.js"
import {InputInterpreter, InputStyle} from "./input-interpreter.js"

/**
 * group of causes with an AND relationship.
 *  - they must activate together
 *  - the spoon adopts the value of the first cause
 */
export class CauseSpoon {
	with = new Set<Cause>()
	without = new Set<Cause>()
	sensitivity = 1
	interpreter: InputInterpreter

	constructor(public primary: Cause, style: InputStyle) {
		this.interpreter = new InputInterpreter(style)
	}

	get amalgam() {
		return this.interpreter.canonical
	}

	update() {
		if (this.#preconditionsAreSatisfied()) {
			const input = this.primary.input.value * this.sensitivity
			const pressed = isPressed(this.primary.input.value)
			this.interpreter.set(input, pressed)
		}
		else {
			this.interpreter.set(0, false)
		}
	}

	#preconditionsAreSatisfied() {
		let pressedWiths = 0
		let pressedWithouts = 0

		for (const cause of this.with)
			if (cause.pressed.value)
				pressedWiths += 1

		for (const cause of this.without)
			if (cause.pressed.value)
				pressedWithouts += 1

		const satisfiedWith = pressedWiths === this.with.size
		const satisfiedWithout = pressedWithouts === 0

		return satisfiedWith && satisfiedWithout
	}
}

