
import {constants} from "../../../constants.js"

export class Awakened {
	lastTime = Date.now()

	get isSleepy() {
		const since = Date.now() - this.lastTime
		return since > constants.physics.timeTillSleep
	}

	poke() {
		this.lastTime = Date.now()
		return this
	}
}

