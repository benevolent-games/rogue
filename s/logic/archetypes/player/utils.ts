
import {Vec2} from "@benev/toolbox"
import {Coordinates} from "../../realm/utils/coordinates.js"

export class PlayerMovementSimulator {
	speed = 0.1
	movement = Vec2.zero()
	coordinates = Coordinates.zero()

	simulate() {
		this.coordinates.add(
			this.movement
				.clone()
				.clampMagnitude(1)
				.multiplyBy(this.speed)
		)
	}
}

export class Backtracer<T> {
	max = 1000
	log: {timestamp: number, payload: T}[] = []

	add(payload: T) {
		const {log, max} = this
		log.unshift({timestamp: Date.now(), payload})
		while (log.length > max)
			log.pop()
	}

	rememberAgo(milliseconds: number) {
		for (const {timestamp, payload} of this.log) {
			const since = Date.now() - timestamp
			if (since >= milliseconds)
				return payload
		}
	}
}

