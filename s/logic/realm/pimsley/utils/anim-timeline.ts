
import { Map2 } from "@benev/slate"
import {Chronometer} from "../../../../tools/chronometer.js"

export type Animlike = {
	to: number
	from: number
	speedRatio: number
}

class Animstate {
	constructor(
		public playhead: number,
		public last: number,
	) {}
}

export class AnimTimeline extends Chronometer {
	readonly framerate = 60
	#states = new Map2<Animlike, Animstate>()

	constructor() {
		super()
		this.start()
	}

	frame(anim: Animlike) {
		const {to, from, speedRatio} = anim
		const {framerate, seconds} = this
		const state = this.#states.guarantee(anim, () => new Animstate(0, seconds))

		const deltaSeconds = seconds - state.last
		state.last = seconds

		const durationSeconds = (to - from) / framerate
		state.playhead = (state.playhead + (deltaSeconds * speedRatio)) % durationSeconds
		return from + (state.playhead * framerate)
	}
}

