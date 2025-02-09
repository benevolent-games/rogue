
import {Vec2} from "@benev/toolbox"

export class DemoStation {
	#mines = new Set<MineTicket>()

	registerLandmine(mine: MineTicket) {
		this.#mines.add(mine)
		return () => this.#mines.delete(mine)
	}

	checkForDetonations(location: Vec2) {
		const detonated = [...this.#mines].filter(mine =>
			mine.location.distance(location)
				<=
			mine.detonationProximity
		)

		for (const mine of detonated)
			mine.onExploded()

		return detonated
	}
}

export class MineTicket {
	constructor(
		public location: Vec2,
		public detonationProximity: number,
		public onExploded: () => void,
	) {}
}

