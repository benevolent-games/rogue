
import {Tact} from "@benev/toolbox"

export type GameTact = ReturnType<typeof makeTact>

export const makeTact = ((target: EventTarget) => {
	const tact = new Tact(target, Tact.bindings(({buttons, b}) => ({
		basic: {
			vectors: {},
			buttons: {
				sprint: buttons(b("ShiftLeft")),
				moveNorth: buttons(b("KeyW")),
				moveEast: buttons(b("KeyD")),
				moveSouth: buttons(b("KeyS")),
				moveWest: buttons(b("KeyA")),
			},
		},
	})))


	tact.modes.enable("basic")

	const keyboard = new Tact.devices.Keyboard(window)

	// prevent all preventable default browser hotkeys
	keyboard.onInput(input => input.event?.preventDefault())

	tact.devices
		.add(keyboard)
		.add(new Tact.devices.PointerMovements(window, "mouse"))
		.add(new Tact.devices.MouseButtons(window))

	return tact
})

