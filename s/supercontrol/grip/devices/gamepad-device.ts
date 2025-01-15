
import {ev, signal} from "@benev/slate"
import {GripDevice} from "./device.js"

export class GamepadDevice extends GripDevice {
	dispose: () => void
	gamepadsSignal = signal<Gamepad[]>([])
	#gamepads = new Set<Gamepad>()

	constructor(target: EventTarget) {
		super()
		this.dispose = this.#attachEventListeners(target)
	}

	#attachEventListeners(target: EventTarget) {
		return ev(target, {

			gamepadconnected: ({gamepad}: GamepadEvent) => {
				this.#gamepads.add(gamepad)
				this.gamepadsSignal.value = this.gamepads
			},

			gamepaddisconnected: ({gamepad}: GamepadEvent) => {
				this.#gamepads.delete(gamepad)
				this.gamepadsSignal.value = this.gamepads
			},
		})
	}

	get gamepads() {
		return [...this.#gamepads.values()]
	}

	poll() {
		const dispatch = (code: string, value: number) =>
			void this.onInput.publish(code, value)

		for (const gamepad of this.gamepads) {
			gamepadButtons.forEach((code, index) =>
				dispatch(code, gamepad.buttons.at(index)?.value ?? 0)
			)

			const [leftX, leftY, rightX, rightY] = gamepad.axes

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
	}
}

function splitAxis(n: number) {
	return (n >= 0)
		? [0, n]
		: [Math.abs(n), 0]
}

const gamepadButtons = [
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

