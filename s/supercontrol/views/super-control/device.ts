
import {Stick} from "@benev/toolbox/x/tact/nubs/stick/device.js"

import {GripDevice} from "../../grip/devices/device.js"
import {breakupStickInputs} from "../../utils/breakup-stick-inputs.js"

export type GamepadInputs = ReturnType<typeof initGamepadInputs>

export function initGamepadInputs() {
	return {
		"g.stick.left.up": 0,
		"g.stick.left.down": 0,
		"g.stick.left.left": 0,
		"g.stick.left.right": 0,

		"g.stick.right.up": 0,
		"g.stick.right.down": 0,
		"g.stick.right.left": 0,
		"g.stick.right.right": 0,

		"g.stick.left.click": 0,
		"g.stick.right.click": 0,

		"g.a": 0,
		"g.b": 0,
		"g.x": 0,
		"g.y": 0,

		"g.up": 0,
		"g.down": 0,
		"g.left": 0,
		"g.right": 0,

		"g.trigger.left": 0,
		"g.trigger.right": 0,

		"g.bumper.left": 0,
		"g.bumper.right": 0,

		"g.alpha": 0,
		"g.beta": 0,
		"g.gamma": 0,
	}
}

export class SuperDevice extends GripDevice {
	stickLeft = new Stick("stickLeft")
	stickRight = new Stick("stickRight")

	inputs: GamepadInputs = initGamepadInputs()

	poll() {
		this.#updateStickInputs()
		for (const [code, input] of Object.entries(this.inputs))
			this.onInput.publish(code, input)
	}

	#updateStickInputs() {
		const {inputs} = this

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

