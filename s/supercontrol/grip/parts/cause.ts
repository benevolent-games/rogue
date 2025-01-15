
import {pubsub} from "@benev/slate"
import {isPressed} from "../utils/is-pressed.js"

export class Cause {
	#value = 0
	#previous = 0
	#time = Date.now()

	onValueChange = pubsub<[Cause]>()
	onPressChange = pubsub<[Cause]>()

	get value() {
		return this.#value
	}

	set value(value: number) {
		this.#time = Date.now()
		this.#previous = this.#value
		this.#value = value
		if (this.valueChanged)
			this.onValueChange.publish(this)
		if (this.pressedChanged)
			this.onPressChange.publish(this)
	}

	get time() {
		return this.#time
	}

	get pressed() {
		return isPressed(this.#value)
	}

	get valueChanged() {
		return this.#value !== this.#previous
	}

	get pressedChanged() {
		return isPressed(this.#value) !== isPressed(this.#previous)
	}
}

