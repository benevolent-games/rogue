
import {Vec2} from "@benev/toolbox"
import {constants} from "../../../../constants.js"
import {PlayerConfig, PlayerWorld} from "../types.js"
import {Coordinates} from "../../../realm/utils/coordinates.js"

export class PlayerRollbackDriver {
	coordinates: Coordinates

	private chronicle: {
		timestamp: number,
		world: PlayerWorld,
		coordinates: Coordinates,
	}[] = []

	constructor(private options: {
			config: PlayerConfig
			coordinates: Coordinates
			maxChronicleEntries: number
		}) {
		this.coordinates = options.coordinates
	}

	simulate(world: PlayerWorld) {
		this.#applyMovement(world)
		this.#saveToChronicle(world, this.coordinates.clone())
	}

	rememberCoordinatesAtTime(timestamp: number) {
		for (const entry of this.chronicle) {
			if (entry.timestamp >= timestamp)
				return entry.coordinates
		}
	}

	rollbackAndCatchUp(timestamp: number, coordinates: Coordinates) {
		this.coordinates.set(coordinates)

		let rollbackIndex = this.chronicle.findIndex(entry => entry.timestamp >= timestamp)
		if (rollbackIndex === -1)
			return

		for (let i = rollbackIndex; i < this.chronicle.length; i++) {
			const {world} = this.chronicle[i]
			this.#applyMovement(world)
		}
	}

	#saveToChronicle(world: PlayerWorld, coordinates: Coordinates) {
		this.chronicle.push({
			timestamp: Date.now(),
			world,
			coordinates,
		})

		while (this.chronicle.length > this.options.maxChronicleEntries)
			this.chronicle.shift()
	}

	#applyMovement({input, physics}: PlayerWorld) {
		const radius = constants.game.crusaderRadius

		const {config} = this.options
		const effectiveSpeed = input.sprint
			? config.speedSprint
			: config.speed

		const movement = Vec2.array(input.intent)
			.clampMagnitude(1)
			.multiplyBy(effectiveSpeed)

		const newlyProposedCoordinates = this.coordinates.clone().add(movement)

		if (physics.isWalkable(newlyProposedCoordinates, radius))
			this.coordinates.set(newlyProposedCoordinates)
	}
}

