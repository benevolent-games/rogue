
import {Stick} from "@benev/toolbox/x/tact/nubs/stick/device.js"

import {GamepadDevice} from "../../../packs/grip/devices/gamepad-device.js"
import {breakupStickInputs} from "../../utils/breakup-stick-inputs.js"
import {GamepadInputs, gamepadInputs} from "./utils/gamepad-inputs.js"

export class VirtualGamepadDevice extends GamepadDevice {
	stickLeft = new Stick("stickLeft")
	stickRight = new Stick("stickRight")

	realInputs: GamepadInputs = gamepadInputs()
	virtualInputs: GamepadInputs = gamepadInputs()

	dispatch(code: string, input: number) {
		this.realInputs[code as keyof GamepadInputs] = input
	}

	poll() {
		const combinedInputs = gamepadInputs()

		super.poll()
		this.#updateStickInputs()

		for (const [code, input] of Object.entries(this.realInputs))
			combinedInputs[code as keyof GamepadInputs] += input

		for (const [code, input] of Object.entries(this.virtualInputs))
			combinedInputs[code as keyof GamepadInputs] += input

		for (const [code, input] of Object.entries(combinedInputs))
			this.onInput.publish(code, input)
	}

	#updateStickInputs() {
		const {virtualInputs: inputs} = this

		const [leftX, leftY] = this.stickLeft.vector
		const left = breakupStickInputs(leftX, leftY)
		inputs["g.stick.left.up"] = left.up
		inputs["g.stick.left.down"] = left.down
		inputs["g.stick.left.left"] = left.left
		inputs["g.stick.left.right"] = left.right

		const [rightX, rightY] = this.stickRight.vector
		const right = breakupStickInputs(rightX, rightY)
		inputs["g.stick.right.up"] = right.up
		inputs["g.stick.right.down"] = right.down
		inputs["g.stick.right.left"] = right.left
		inputs["g.stick.right.right"] = right.right
	}

	dispose = () => {}
}

