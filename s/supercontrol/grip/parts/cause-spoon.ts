
import {Cause} from "./cause.js"

/** group of causes with an AND relationship, they must activate together */
export class CauseSpoon {
	value = 0
	previous = 0
	causes = new Set<Cause>()

	update() {
		this.previous = this.value
		this.value = 0
		let value = 0
		let count = 0

		for (const cause of this.causes) {
			count += 1
			value += cause.value
		}

		if (count === this.causes.size)
			this.value = value
	}
}

