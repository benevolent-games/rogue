
import {ev, signal} from "@benev/slate"

export class GamepadTracker {
	gamepadsSignal = signal<Gamepad[]>([])
	#connected = new Set<GamepadInfo>()

	dispose = ev(window, {
		gamepadconnected: () => this.#refreshGamepads(),
		gamepaddisconnected: () => this.#refreshGamepads(),
	})

	constructor() {
		this.#refreshGamepads()
	}

	get gamepads() {
		const gamepads = navigator.getGamepads()
		return [...this.#connected].map(info => gamepads.at(info.index)!)
	}

	#refreshGamepads() {
		this.#connected.clear()
		navigator.getGamepads()
			.filter(g => !!g)
			.filter(g => g.connected)
			.forEach(g => this.#connected.add(new GamepadInfo(g)))
		this.gamepadsSignal.value = [...this.gamepads]
	}
}

export class GamepadInfo {
	index: number
	label: string

	constructor(gamepad: Gamepad) {
		this.index = gamepad.index
		this.label = gamepad.id
	}
}

