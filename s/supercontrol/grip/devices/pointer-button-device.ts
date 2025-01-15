
import {ev} from "@benev/slate"
import {GripDevice} from "./device.js"
import {modprefix} from "../parts/modprefix.js"

export class PointerButtonDevice extends GripDevice {
	dispose: () => void

	static buttonCode(event: PointerEvent) {
		switch (event.button) {
			case 0: return "LMB"
			case 1: return "MMB"
			case 2: return "RMB"
			default: return `MB${event.button + 1}`
		}
	}

	static wheelCodes(event: WheelEvent) {
		const movements: [string, number][] = []

		if (event.deltaX)
			movements.push([
				event.deltaX > 0 ? "WheelRight" : "WheelLeft",
				event.deltaX,
			])
		else if (event.deltaY)
			movements.push([
				event.deltaY > 0 ? "WheelDown" : "WheelUp",
				event.deltaY,
			])

		return movements
	}

	constructor(target: EventTarget) {
		super()

		const dispatch = (code: string, value: number) =>
			this.onInput.publish(code, value)

		this.dispose = ev(target, {

			pointerdown: (event: PointerEvent) => {
				const code = PointerButtonDevice.buttonCode(event)
				dispatch(code, 1)
				dispatch(`${modprefix(event)}-${code}`, 1)
			},

			pointerup: (event: PointerEvent) => {
				const code = PointerButtonDevice.buttonCode(event)
				dispatch(code, 1)
				dispatch(`${modprefix(event)}-${code}`, 0)
			},

			wheel: (event: WheelEvent) => {
				for (const [code, value] of PointerButtonDevice.wheelCodes(event))
					dispatch(code, value)
			},
		})
	}
}

