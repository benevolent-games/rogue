
/** group of spoons with an OR relationship */
export class CauseFork {
	value = 0
	previous = 0
	spoons = new Set<CauseSpoon>()
	on = pubsub<[CauseFork]>()

	update() {
		this.previous = this.value
		for (const spoon of this.spoons) {
			spoon.update()
			this.value += spoon.value
		}
		if (this.previous !== this.value)
			this.on.publish(this)
	}
}

