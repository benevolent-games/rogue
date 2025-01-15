
import {Cause} from "./cause.js"

/**
 * group of causes with an AND relationship.
 *  - they must activate together
 *  - the spoon adopts the value of the first cause
 */
export class CauseSpoon extends Cause {
	causes = new Set<Cause>()

	update() {
		let pressed = 0
		const [first] = [...this.causes]

		for (const cause of this.causes) {
			if (cause.pressed)
				pressed += 1
		}

		this.value = (pressed === this.causes.size)
			? first.value
			: 0
	}
}

