
import {Randy} from "@benev/toolbox"

export class Chronex {
	static duration = 60
	offset: number

	tick = 0
	phase = 0
	randy = new Randy(0)

	constructor(public id: number, coreRandy: Randy) {
		this.offset = coreRandy.range(0, Chronex.duration)
	}

	update(tick: number) {
		this.tick = tick
		this.phase = this.id + Math.floor(this.offset + (tick / Chronex.duration))
		this.randy = new Randy(this.phase)
	}
}

