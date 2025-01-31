
import {Circular, Vec2} from "@benev/toolbox"
import {Mentality} from "../parts/mentality.js"
import {BipedActivity} from "../../../../commons/biped/types.js"

/** totally randomly walking around */
export class Wandering extends Mentality {
	rotation = new Circular(0)
	movementIntent = new Vec2(0, 0)

	think(): BipedActivity {
		const {randy} = this.mind.chronex

		const lookingAt = this.#getRandomPointNearby()
		const ambulationGoal = this.#getRandomPointNearby()
		const selfCoordinates = this.mind.perception.self.coordinates

		const sprint = randy.roll(0.3)

		const movementIntent = randy.roll(0.2)
			? Vec2.zero()
			: ambulationGoal
				.clone()
				.subtract(selfCoordinates)
				.clampMagnitude(
					sprint
						? 1
						: randy.range(0, 1)
				)

		const rotation = lookingAt
			.clone()
			.subtract(selfCoordinates)
			.rotation()

		this.rotation.lerp(rotation, 1 / 100)
		this.movementIntent.lerp(
			movementIntent,
			sprint
				? (10 / 100)
				: (1 / 100),
		)

		const block = (!sprint && randy.roll(0.1)) ? 1 : 0
		const attack = randy.roll(0.1)

		return {
			sprint,
			block,
			attack,
			rotation: this.rotation.x,
			movementIntent: this.movementIntent,
		}
	}

	#getRandomPointNearby() {
		const {perception} = this.mind
		const {randy} = this.mind.chronex
		const offset = new Vec2(
			randy.range(-10, 10),
			randy.range(-10, 10),
		)
		return perception.self.coordinates.clone().add(offset)
	}
}

