
import {pubsub} from "@benev/slate"

export class Cause {
	static isPressed(value: number) {
		return Math.abs(value) >= 0.5
	}

	value = 0
	previous = 0
	time = Date.now()
	on = pubsub<[Cause]>()

	constructor(public code: string) {}

	get pressed() {
		return Cause.isPressed(this.value)
	}

	get valueChanged() {
		return this.value !== this.previous
	}

	get pressedChanged() {
		return Cause.isPressed(this.value) !== Cause.isPressed(this.previous)
	}

	set(value: number) {
		this.previous = this.value
		this.value = value
		this.time = Date.now()
		this.on.publish(this)
	}
}

