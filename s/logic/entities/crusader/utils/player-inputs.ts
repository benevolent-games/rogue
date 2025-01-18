
import {Degrees, Vec2} from "@benev/toolbox"
import {Realm} from "../../../realm/realm.js"
import {cardinals} from "../../../../tools/directions.js"
import {rotation} from "../../../../tools/temp/rotation.js"
import {CrusaderInputData, CrusaderState} from "../types.js"
import {Coordinates} from "../../../realm/utils/coordinates.js"

export class PlayerInputs {
	sprint = false
	rotation = 0
	movementIntent = Vec2.zero()

	constructor(
		public realm: Realm,
		public state: CrusaderState,
		public buddyCoordinates: Coordinates,
	) {}

	get(): CrusaderInputData {
		this.#updateSprint()
		this.#updateMovementIntent()

		if (this.realm.userInputs.predilection.value === "keyboard")
			this.#updateRotationViaCursor()
		else
			this.#updateRotationViaGripActions()

		return {
			sprint: this.sprint,
			rotation: this.rotation,
			movementIntent: this.movementIntent.array(),
		}
	}

	#updateSprint() {
		const {grip} = this.realm.userInputs
		const cancel = this.#lookIsPressed() || !this.#moveIsPressed()
		const sprint = grip.state.normal.sprint.pressed.value

		if (cancel)
			this.sprint = false
		else if (sprint)
			this.sprint = true
	}

	#moveIsPressed() {
		const {normal} = this.realm.userInputs.grip.state
		return (
			normal.moveUp.pressed.value ||
			normal.moveDown.pressed.value ||
			normal.moveLeft.pressed.value ||
			normal.moveRight.pressed.value
		)
	}

	#lookIsPressed() {
		const {normal} = this.realm.userInputs.grip.state
		return (
			normal.lookUp.pressed.value ||
			normal.lookDown.pressed.value ||
			normal.lookLeft.pressed.value ||
			normal.lookRight.pressed.value
		)
	}

	#updateMovementIntent() {
		const {normal} = this.realm.userInputs.grip.state
		const walkSpeedFraction = this.state.speed / this.state.speedSprint
		const move = Vec2.zero()
		const directions = [
			normal.moveUp.input.value,
			normal.moveRight.input.value,
			normal.moveDown.input.value,
			normal.moveLeft.input.value,
		]

		directions.forEach((value, index) => {
			move.add(
				cardinals.at(index)!
					.clone()
					.multiplyBy(value)
			)
		})

		move
			.clampMagnitude(this.sprint ? 1 : walkSpeedFraction)
			.rotate(this.realm.cameraman.smoothed.swivel)

		this.movementIntent.set(move)

		if (this.#moveIsPressed()) {
			this.rotation = rotation(move) + Degrees.toRadians(90)
		}
	}

	#updateRotationViaGripActions() {
		const {normal} = this.realm.userInputs.grip.state
		const look = Vec2.zero()

		const directions = [
			normal.lookUp.input.value,
			normal.lookRight.input.value,
			normal.lookDown.input.value,
			normal.lookLeft.input.value,
		]

		directions.forEach((value, index) => {
			look.add(
				cardinals.at(index)!
					.clone()
					.multiplyBy(value)
			)
		})

		look
			.normalize()
			.rotate(this.realm.cameraman.smoothed.swivel)

		if (this.#lookIsPressed())
			this.rotation = rotation(look) + Degrees.toRadians(90)
	}

	#updateRotationViaCursor() {
		this.rotation = Degrees.toRadians(90) + rotation(
			this.realm.cursor.coordinates
				.clone()
				.subtract(this.buddyCoordinates)
		)
	}
}

