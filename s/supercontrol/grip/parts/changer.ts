
import {pubsub} from "@benev/slate"

export class Changer<X> {
	#value: X
	#previous: X

	on = pubsub<[X]>()

	constructor(value: X) {
		this.#value = value
		this.#previous = value
	}

	get value() {
		return this.#value
	}

	set value(value: X) {
		this.#previous = this.#value
		this.#value = value
		if (this.changed)
			this.on.publish(value)
	}

	get previous() {
		return this.#previous
	}

	get changed() {
		return this.#value !== this.#previous
	}
}

