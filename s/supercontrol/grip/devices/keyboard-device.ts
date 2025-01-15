
import {ev} from "@benev/slate"
import {GripDevice} from "./device.js"
import {modprefix} from "../utils/modprefix.js"

export class KeyboardDevice extends GripDevice {
	dispose: () => void

	constructor(target: EventTarget, fn = (_event: KeyboardEvent) => {}) {
		super()

		const dispatch = (event: KeyboardEvent, value: number) => {
			const {code} = event
			fn(event)
			this.onInput.publish(code, value)
			this.onInput.publish(`${modprefix(event)}-${code}`, value)
		}

		this.dispose = ev(target, {
			keydown: (event: KeyboardEvent) => dispatch(event, 1),
			keyup: (event: KeyboardEvent) => dispatch(event, 0),
		})
	}
}

