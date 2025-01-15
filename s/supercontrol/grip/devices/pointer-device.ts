
import {ev} from "@benev/slate"
import {GripDevice} from "./device.js"
import {modprefix} from "../utils/modprefix.js"
import {splitAxis} from "../utils/split-axis.js"

export class PointerDevice extends GripDevice {
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

		const dispatch = (event: PointerEvent, code: string, value: number) => {
			this.onInput.publish(code, value)
			this.onInput.publish(`${modprefix(event)}-${code}`, value)
		}

		this.dispose = ev(target, {

			pointerdown: (event: PointerEvent) => {
				const code = PointerDevice.buttonCode(event)
				dispatch(event, code, 1)
			},

			pointerup: (event: PointerEvent) => {
				const code = PointerDevice.buttonCode(event)
				dispatch(event, code, 0)
			},

			pointermove: (event: PointerEvent) => {
				const {movementX, movementY} = event
				const [left, right] = splitAxis(movementX)
				const [down, up] = splitAxis(movementY)
				if (movementX) {
					if (movementX >= 0)
						dispatch(event, `PointerMoveRight`, Math.abs(right))
					else
						dispatch(event, `PointerMoveLeft`, Math.abs(left))
				}
				if (movementY) {
					if (movementY >= 0)
						dispatch(event, `PointerMoveUp`, Math.abs(up))
					else
						dispatch(event, `PointerMoveDown`, Math.abs(down))
				}
			},

			wheel: (event: WheelEvent) => {
				for (const [code, value] of PointerDevice.wheelCodes(event))
					this.onInput.publish(code, value)
			},
		})
	}
}

