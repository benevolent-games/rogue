
import {Tact} from "@benev/toolbox"

export type GameTact = ReturnType<typeof makeTact>

export const makeTact = ((target: EventTarget) => {
	const tact = new Tact(target, Tact.bindings(({buttons, b}) => ({
		basic: {
			vectors: {},
			buttons: {
				moveNorth: buttons(b("KeyW")),
				moveEast: buttons(b("KeyD")),
				moveSouth: buttons(b("KeyS")),
				moveWest: buttons(b("KeyA")),
			},
		},
	})))

	tact.modes.enable("basic")
	tact.devices.add(new Tact.devices.Keyboard(window))
	tact.devices.add(new Tact.devices.PointerMovements(window, "mouse"))
	tact.devices.add(new Tact.devices.MouseButtons(window))

	return tact
})

