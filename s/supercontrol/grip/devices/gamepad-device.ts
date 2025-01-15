
import {ev, signal} from "@benev/slate"

import {GripDevice} from "./device.js"
import {Cause} from "../parts/cause.js"
import {splitAxis} from "../utils/split-axis.js"

export class GamepadDevice extends GripDevice {
	#gamepads = new Set<Gamepad>()

	dispose: () => void
	anyButton = new Cause()
	gamepadsSignal = signal<Gamepad[]>([])

	constructor() {
		super()
		this.#refreshGamepads()
		this.dispose = this.#attachEventListeners(window)
	}

	#refreshGamepads() {
		for (const gamepad of navigator.getGamepads()) {
			if (gamepad)
				this.#gamepads.add(gamepad)
		}
		this.gamepadsSignal.value = [...this.#gamepads]
	}

	#attachEventListeners(target: EventTarget) {
		return ev(target, {
			gamepadconnected: () => this.#refreshGamepads(),
			gamepaddisconnected: () => this.#refreshGamepads(),
		})
	}

	get gamepads() {
		return [...this.#gamepads.values()]
	}

	poll() {
		const dispatch = (code: string, value: number) =>
			void this.onInput.publish(code, value)

		let anyButtonValue = 0

		for (const gamepad of this.gamepads) {
			gamepadButtonCodes.forEach((code, index) => {
				const value = gamepad.buttons.at(index)?.value ?? 0
				anyButtonValue += value
				dispatch(code, value)
			})

			const [leftY, leftX, rightY, rightX] = gamepad.axes

			const [leftUp, leftDown] = splitAxis(leftX)
			const [leftLeft, leftRight] = splitAxis(leftY)
			dispatch("g.stick.left.up", leftUp)
			dispatch("g.stick.left.down", leftDown)
			dispatch("g.stick.left.left", leftLeft)
			dispatch("g.stick.left.right", leftRight)

			const [rightUp, rightDown] = splitAxis(rightX)
			const [rightLeft, rightRight] = splitAxis(rightY)
			dispatch("g.stick.right.up", rightUp)
			dispatch("g.stick.right.down", rightDown)
			dispatch("g.stick.right.left", rightLeft)
			dispatch("g.stick.right.right", rightRight)
		}

		this.anyButton.value = anyButtonValue
	}
}

const gamepadButtonCodes = [
	"g.a",
	"g.b",
	"g.x",
	"g.y",
	"g.lb",
	"g.rb",
	"g.lt",
	"g.rt",
	"g.alpha",
	"g.beta",
	"g.stick.left.click",
	"g.stick.right.click",
	"g.up",
	"g.down",
	"g.left",
	"g.right",
	"g.gamma",
]

