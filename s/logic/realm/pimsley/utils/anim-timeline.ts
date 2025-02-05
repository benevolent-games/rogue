
import { deferPromise } from "@benev/slate"
import {Scalar} from "@benev/toolbox"

export type Animlike = {
	to: number
	from: number
}

export class AnimTimeline {
	playhead = 0
	loopsPerSecond = 1

	#last = performance.now()

	#waiter = deferPromise<void>()

	get wait() {
		return this.#waiter.promise
	}

	update() {
		const now = performance.now()
		const milliseconds = now - this.#last
		const seconds = milliseconds / 1000
		this.#last = now

		const traversal = seconds * this.loopsPerSecond

		let was = this.playhead
		this.playhead = Scalar.wrap(this.playhead + traversal)
		const looped = (this.playhead < was)

		if (looped) {
			this.#waiter.resolve()
			this.#waiter = deferPromise()
		}

		return looped
	}

	setSpeed(anim: Animlike, speedRatio = 1, framerate = 60) {
		const duration = anim.to - anim.from
		const durationInSeconds = duration / (framerate * speedRatio)
		this.loopsPerSecond = 1 / durationInSeconds
		return this
	}
}

