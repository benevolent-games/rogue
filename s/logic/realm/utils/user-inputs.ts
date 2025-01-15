
import {Tact} from "@benev/toolbox"
import {ev, signal, Trashbin} from "@benev/slate"
import {Stick} from "@benev/toolbox/x/tact/nubs/stick/device.js"

import {Grip} from "../../../supercontrol/grip/grip.js"
import {gameBindings2, GameBindings2} from "../inputs/game-bindings.js"
import {GamepadDevice} from "../../../supercontrol/grip/devices/gamepad-device.js"
import {KeyboardDevice} from "../../../supercontrol/grip/devices/keyboard-device.js"
import {PointerButtonDevice} from "../../../supercontrol/grip/devices/pointer-button-device.js"

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

export type InputPredilection = "touch" | "keyboard"

export class UserInputs {
	predilection = signal<InputPredilection>("keyboard")

	grip: Grip<GameBindings2>
	devices = {
		keyboard: new KeyboardDevice(window),
		pointer: new PointerButtonDevice(window),
		gamepad: new GamepadDevice(),
	}

	stick = new Stick("movestick")
	keyboard = new Tact.devices.Keyboard(window)
	mouseButtons = new Tact.devices.MouseButtons(window)
	pointerMovements = new Tact.devices.PointerMovements(window, "mouse")
	tact: Tact<GameBindings>

	#trash = new Trashbin()

	constructor(target: EventTarget) {

		// grip
		this.grip = new Grip(gameBindings2())
		this.grip.modes.add("normal")
		this.grip
			.attachDevice(this.devices.keyboard)
			.attachDevice(this.devices.pointer)
			.attachDevice(this.devices.gamepad)

		this.tact = new Tact(target, makeBindings())

		// prevent all preventable default browser hotkeys
		this.keyboard.onInput(input => input.event?.preventDefault())

		this.tact.modes.enable("basic")

		this.tact.devices
			.add(this.stick)
			.add(this.keyboard)
			.add(this.pointerMovements)
			.add(this.mouseButtons)

		this.#trash.disposer(
			ev(target, {
				pointerdown: ({pointerType}: PointerEvent) => {
					if (pointerType === "touch") {
						this.predilection.value = "touch"
					}
					else if (pointerType === "mouse") {
						this.predilection.value = "keyboard"
					}
				},
			})
		)
	}

	dispose() {
		this.tact.dispose()
	}
}

