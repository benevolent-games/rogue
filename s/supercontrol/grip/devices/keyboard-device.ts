
import {ev} from "@benev/slate"
import {GripDevice} from "./device.js"
import {modprefix} from "../parts/modprefix.js"

export class KeyboardDevice extends GripDevice {
	dispose: () => void

	constructor(target: EventTarget) {
		super()

		const dispatch = (code: string, value: number) =>
			this.onInput.publish(code, value)

		this.dispose = ev(target, {

			keydown: (event: KeyboardEvent) => {
				dispatch(event.code, 1)
				dispatch(`${modprefix(event)}-${event.code}`, 1)
			},

			keyup: (event: KeyboardEvent) => {
				dispatch(event.code, 0)
				dispatch(`${modprefix(event)}-${event.code}`, 0)
			},
		})
	}
}

