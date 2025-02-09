
import {GripDevice} from "./device.js"
import {Cause} from "../parts/cause.js"
import {isPressed} from "../utils/is-pressed.js"
import {splitAxis} from "../utils/split-axis.js"
import {applyDeadzone} from "../utils/apply-deadzone.js"
import {GamepadTracker} from "../utils/gamepad-tracker.js"

export class GamepadDevice extends GripDevice {
	deadzone = 0.2
	tracker = new GamepadTracker()
	anyButton = new Cause()
	dispose = () => this.tracker.dispose()

	dispatch(code: string, input: number) {
		this.onInput.publish(code, input)
	}

	poll() {
		const {deadzone} = this

		let anyButtonValue = 0
		let anyButtonPressed = false

		const dispatch = (code: string, input: number) => {
			anyButtonPressed ||= isPressed(input)
			this.dispatch(code, input)
		}

		for (const gamepad of this.tracker.gamepads) {
			gamepadButtonCodes.forEach((code, index) => {
				const value = gamepad.buttons.at(index)?.value ?? 0
				anyButtonValue += value
				anyButtonPressed ||= isPressed(value)
				dispatch(code, value)
			})

			const [leftY, leftX, rightY, rightX] = gamepad.axes

			const [leftUp, leftDown] = splitAxis(leftX)
			const [leftLeft, leftRight] = splitAxis(leftY)
			dispatch("g.stick.left.up", applyDeadzone(leftUp, deadzone))
			dispatch("g.stick.left.down", applyDeadzone(leftDown, deadzone))
			dispatch("g.stick.left.left", applyDeadzone(leftLeft, deadzone))
			dispatch("g.stick.left.right", applyDeadzone(leftRight, deadzone))

			const [rightUp, rightDown] = splitAxis(rightX)
			const [rightLeft, rightRight] = splitAxis(rightY)
			dispatch("g.stick.right.up", applyDeadzone(rightUp, deadzone))
			dispatch("g.stick.right.down", applyDeadzone(rightDown, deadzone))
			dispatch("g.stick.right.left", applyDeadzone(rightLeft, deadzone))
			dispatch("g.stick.right.right", applyDeadzone(rightRight, deadzone))
		}

		this.anyButton.set(anyButtonValue, anyButtonPressed)
	}
}

const gamepadButtonCodes = [
	"g.a",
	"g.b",
	"g.x",
	"g.y",
	"g.bumper.left",
	"g.bumper.right",
	"g.trigger.left",
	"g.trigger.right",
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

