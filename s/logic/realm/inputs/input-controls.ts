
import {ev} from "@benev/slate"
import {Arcseconds} from "@benev/toolbox"
import {Cameraman} from "../utils/cameraman.js"
import {DragQueen} from "./pointer/drag-queen.js"

const wheelSensitivity = 1 / 100

export class InputControls {
	sensitivityApd = 720
	dragQueen: DragQueen

	constructor(public cameraman: Cameraman) {
		const isRightMouse = (event: PointerEvent) => event.button === 2
		const isMiddleMouse = (event: PointerEvent) => event.button === 1
		const sensitivityRadians = Arcseconds.toRadians(this.sensitivityApd)

		this.dragQueen = new DragQueen({
			predicate: event => (
				isRightMouse(event) ||
				isMiddleMouse(event)
			),
			onAnyDrag: () => {},
			onAnyClick: () => {},
			onIntendedDrag: event => {
				cameraman.desired.swivel -= event.movementX * sensitivityRadians
				cameraman.desired.tilt -= event.movementY * sensitivityRadians
			},
			onIntendedClick: () => {},
		})
	}

	#wheelCamera(element: HTMLElement) {
		return ev(element, {
			wheel: (event: WheelEvent) => {
				this.cameraman.desired.distance += event.deltaY * wheelSensitivity
			},
		})
	}

	attach(element: HTMLElement) {
		const unattach1 = this.dragQueen.attach(element)
		const unattach2 = this.#wheelCamera(element)
		return () => {
			unattach1()
			unattach2()
		}
	}
}

