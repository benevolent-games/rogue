
import {Tact} from "@benev/toolbox"
import {Stick} from "@benev/toolbox/x/tact/nubs/stick/device.js"

export type GameBindings = ReturnType<typeof makeBindings>

const makeBindings = () => Tact.bindings(({buttons, b}) => ({
	basic: {
		vectors: {
			move: ["movestick"],
		},
		buttons: {
			sprint: buttons(b("ShiftLeft")),
			moveNorth: buttons(b("KeyW")),
			moveEast: buttons(b("KeyD")),
			moveSouth: buttons(b("KeyS")),
			moveWest: buttons(b("KeyA")),
		},
	},
}))

export class UserInputs {
	stick = new Stick("movestick")
	keyboard = new Tact.devices.Keyboard(window)
	mouseButtons = new Tact.devices.MouseButtons(window)
	pointerMovements = new Tact.devices.PointerMovements(window, "mouse")

	tact: Tact<GameBindings>

	constructor(target: EventTarget) {
		this.tact = new Tact(target, makeBindings())

		// prevent all preventable default browser hotkeys
		this.keyboard.onInput(input => input.event?.preventDefault())

		this.tact.modes.enable("basic")

		this.tact.devices
			.add(this.stick)
			.add(this.keyboard)
			.add(this.pointerMovements)
			.add(this.mouseButtons)
	}
}

