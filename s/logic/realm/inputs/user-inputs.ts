
import {ev, signal, Trashbin} from "@benev/slate"
import {Stick} from "@benev/toolbox/x/tact/nubs/stick/device.js"

import {Grip} from "../../../supercontrol/grip/grip.js"
import {gameBindings, GameBindings} from "../inputs/game-bindings.js"
import {PointerDevice} from "../../../supercontrol/grip/devices/pointer-device.js"
import {KeyboardDevice} from "../../../supercontrol/grip/devices/keyboard-device.js"
import {VirtualGamepadDevice} from "../../../supercontrol/views/virtual-gamepad/device.js"

export type InputPredilection = "touch" | "keyboard" | "gamepad"

export class UserInputs {
	grip: Grip<GameBindings>
	stick = new Stick("movestick")
	predilection = signal<InputPredilection>("keyboard")

	devices = {
		keyboard: new KeyboardDevice(window, e => e.preventDefault()),
		pointer: new PointerDevice(window),
		gamepad: new VirtualGamepadDevice(),
	}

	#trash = new Trashbin()

	constructor(target: EventTarget) {
		this.grip = new Grip(gameBindings())
		this.grip.enableMode("normal")
		this.grip
			.attachDevice(this.devices.keyboard)
			.attachDevice(this.devices.pointer)
			.attachDevice(this.devices.gamepad)

		this.#trash.disposer(
			this.devices.gamepad.anyButton.pressed.on(pressed => {
				if (pressed)
					this.predilection.value = "gamepad"
			})
		)

		this.#trash.disposer(
			ev(target, {
				pointerdown: ({pointerType}: PointerEvent) => {
					if (pointerType === "touch")
						this.predilection.value = "touch"
					else if (pointerType === "mouse")
						this.predilection.value = "keyboard"
				},
			})
		)
	}

	poll() {
		this.grip.poll()
	}

	dispose() {
		this.grip.dispose()
	}
}

