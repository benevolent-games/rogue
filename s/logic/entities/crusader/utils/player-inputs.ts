
import {Trashbin} from "@benev/slate"
import {Degrees, Vec2} from "@benev/toolbox"

import {Realm} from "../../../realm/realm.js"
import {constants} from "../../../../constants.js"
import {cardinals} from "../../../../tools/directions.js"
import {CrusaderInputData, CrusaderState} from "../types.js"
import {Coordinates} from "../../../realm/utils/coordinates.js"

const {crusader} = constants
const {walkSpeed, sprintSpeed} = crusader.movement

export class PlayerInputs {
	attack = false
	block = false
	sprint = false
	rotation = 0
	movementIntent = Vec2.zero()

	mouse = true

	#trash = new Trashbin()

	constructor(
			public realm: Realm,
			public state: CrusaderState,
			public buddyCoordinates: Coordinates,
		) {

		this.#trash.disposer(
			this.realm.userInputs.devices.pointer.onInput(code => {
				switch (code) {
					case "LMB":
					case "MMB":
					case "RMB":
						this.mouse = true
				}
			})
		)
	}

	get(): CrusaderInputData {
		this.#lookButtonsDeactivateMouseMode()

		this.#updateCombat()
		this.#updateSprint()
		this.#updateMovementIntent()

		if (this.realm.userInputs.predilection.value === "keyboard" && this.mouse)
			this.#updateRotationViaCursor()
		else
			this.#updateRotationViaGripActions()

		return {
			attack: this.attack,
			block: this.block,
			sprint: this.sprint,
			rotation: this.rotation,
			movementIntent: this.movementIntent.array(),
		}
	}

	dispose() {
		this.#trash.dispose()
	}

	#lookButtonsDeactivateMouseMode() {
		const {normal} = this.realm.userInputs.grip.state
		const buttons = [
			normal.lookUp,
			normal.lookDown,
			normal.lookLeft,
			normal.lookRight,
		]
		if (buttons.some(b => b.pressed.changed && b.pressed.value)) {
			this.mouse = false
		}
	}

	#updateCombat() {
		const {normal} = this.realm.userInputs.grip.state
		this.attack = normal.attack.pressed.value
		this.block = normal.block.pressed.value
	}

	#updateSprint() {
		const {grip} = this.realm.userInputs
		const cancel = this.#lookIsPressed() || !this.#moveIsPressed() || this.#combatButtonIsPressed()
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

	#combatButtonIsPressed() {
		const {normal} = this.realm.userInputs.grip.state
		return (
			normal.attack.pressed.value ||
			normal.block.pressed.value
		)
	}

	#updateMovementIntent() {
		const {normal} = this.realm.userInputs.grip.state
		const walkSpeedFraction = walkSpeed / sprintSpeed
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

		if (this.#moveIsPressed())
			this.rotation = move.rotation() + Degrees.toRadians(90)
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
			this.rotation = look.rotation() + Degrees.toRadians(90)
	}

	#updateRotationViaCursor() {
		this.rotation = Degrees.toRadians(90) + this.realm.cursor.coordinates
			.clone()
			.subtract(this.buddyCoordinates)
			.rotation()
	}
}

