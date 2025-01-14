
import {deep, ev, signal} from "@benev/slate"
import {Input} from "@benev/toolbox/x/tact/types/input.js"
import {Device} from "@benev/toolbox/x/tact/parts/device.js"

export class SuperController extends Device {
	gamepadsSignal = signal<Gamepad[]>([])

	vectors = {
		GP_RStick: null as any as Input.Vector,
		GP_LStick: null as any as Input.Vector,
	}

	buttons = {
		GP_A: null as any as Input.Button,
		GP_B: null as any as Input.Button,
		GP_X: null as any as Input.Button,
		GP_Y: null as any as Input.Button,
		GP_LB: null as any as Input.Button,
		GP_RB: null as any as Input.Button,
		GP_LT: null as any as Input.Button,
		GP_RT: null as any as Input.Button,
		GP_Alpha: null as any as Input.Button,
		GP_Beta: null as any as Input.Button,
		GP_LStickClick: null as any as Input.Button,
		GP_RStickClick: null as any as Input.Button,
		GP_Up: null as any as Input.Button,
		GP_Down: null as any as Input.Button,
		GP_Left: null as any as Input.Button,
		GP_Right: null as any as Input.Button,
		GP_Gamma: null as any as Input.Button,
	}

	#temp = {
		vectors: deep.clone(this.vectors),
		buttons: deep.clone(this.buttons),
	}

	#gamepads = new Map<number, Gamepad>()
	#dispose: () => void

	constructor(target: EventTarget, public channel: string) {
		super()
		this.#initializeInputs(channel)
		this.#dispose = this.#attachEventListeners(target)
	}

	#initializeInputs(channel: string) {
		for (const key of Object.keys(this.vectors))
			this.vectors[key as keyof typeof this.vectors] = {
				kind: "vector",
				channel,
				event: null,
				vector: [0, 0],
			} as Input.Vector

		for (const key of Object.keys(this.buttons))
			this.buttons[key as keyof typeof this.buttons] = {
				kind: "button",
				channel,
				event: null,
				code: key,
				down: false,
				mods: {alt: false, ctrl: false, meta: false, shift: false},
				repeat: false
			} as Input.Button
	}

	#attachEventListeners(target: EventTarget) {
		return ev(target, {
			gamepadconnected: ({gamepad}: GamepadEvent) => {
				this.#gamepads.set(gamepad.index, gamepad)
				this.gamepadsSignal.value = this.list()
			},
			gamepaddisconnected: ({gamepad}: GamepadEvent) => {
				this.#gamepads.delete(gamepad.index)
				this.gamepadsSignal.value = this.list()
			},
		})
	}

	list() {
		return [...this.#gamepads.values()]
	}

	poll() {
		for (const gamepad of this.list()) {
			const rstick = 
		}
	}

	dispose = () => {
		this.#dispose()
		this.#gamepads.clear()
	}
}

