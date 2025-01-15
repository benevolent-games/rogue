
import { Scalar } from "@benev/toolbox"
import {Cause} from "./cause.js"

/**
 * group of causes with an AND relationship.
 *  - they must activate together
 *  - the spoon adopts the value of the first cause
 */
export class CauseSpoon extends Cause {
	with = new Set<Cause>()
	without = new Set<Cause>()
	sensitivity = 1
	deadzone = 0.2

	constructor(public cause: Cause) {
		super()
	}

	#applyDeadzone(value: number) {
		if (value < this.deadzone)
			return 0

		if (value > 1)
			return value

		return Scalar.remap(
			value,
			this.deadzone, 1,
			0, 1,
		)
	}

	update() {
		let pressedWiths = 0
		let pressedWithouts = 0

		for (const cause of this.with)
			if (cause.pressed)
				pressedWiths += 1

		for (const cause of this.without)
			if (cause.pressed)
				pressedWiths += 1

		const satisfiedWith = pressedWiths === this.with.size
		const satisfiedWithout = pressedWithouts === 0
		const satisfied = satisfiedWith && satisfiedWithout

		this.value = satisfied
			? this.#applyDeadzone(this.cause.value) * this.sensitivity
			: 0
	}
}

