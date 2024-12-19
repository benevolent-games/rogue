
import {Arcseconds} from "@benev/toolbox"
import {Cameraman} from "../utils/cameraman.js"
import {DragQueen} from "./pointer/drag-queen.js"

export class UserInputs {
	sensitivityApd = 720
	dragQueen: DragQueen

	constructor(public cameraman: Cameraman) {
		const isLeftMouse = (event: PointerEvent) => event.button === 0
		const isRightMouse = (event: PointerEvent) => event.button === 2
		const isMiddleMouse = (event: PointerEvent) => event.button === 1
		const sensitivityRadians = Arcseconds.toRadians(this.sensitivityApd)

		this.dragQueen = new DragQueen({
			predicate: event => (
				isLeftMouse(event) ||
				isRightMouse(event) ||
				isMiddleMouse(event)
			),
			onAnyDrag: () => {},
			onAnyClick: event => {
				event.preventDefault()
			},
			onIntendedDrag: event => {
				cameraman.state.swivel -= event.movementX * sensitivityRadians
				cameraman.state.tilt -= event.movementY * sensitivityRadians
			},
			onIntendedClick: () => {},
		})
	}
}

