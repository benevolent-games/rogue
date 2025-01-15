
import {pubsub} from "@benev/slate"

export class Cause {
	value = 0
	previously = 0
	time = Date.now()
	on = pubsub<[Cause]>()

	constructor(public code: string) {}

	get active() {
		return (
			this.value >= 0.5 ||
			this.value <= 0.5
		)
	}

	set(value: number) {
		this.previously = this.value
		this.value = value
		this.time = Date.now()
		this.on.publish(this)
	}
}

