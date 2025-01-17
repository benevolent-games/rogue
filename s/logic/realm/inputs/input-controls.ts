
import {ev} from "@benev/slate"
import {Arcseconds} from "@benev/toolbox"

import {UserInputs} from "./user-inputs.js"
import {Cameraman} from "../utils/cameraman.js"
import {DragQueen} from "./pointer/drag-queen.js"

const wheelSensitivity = 1 / 100

export class InputControls {
	sensitivityApd = 720
	dragQueen: DragQueen

	constructor(
			public cameraman: Cameraman,
			public userInputs: UserInputs,
		) {
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
		const unattach3 = this.userInputs.grip.state.normal.cameraReset.pressed.on(pressed => {
			if (pressed)
				this.cameraman.reset()
		})
		return () => {
			unattach1()
			unattach2()
			unattach3()
		}
	}

	tick() {
		const {normal} = this.userInputs.grip.state
		this.cameraman.desired.tilt -= normal.cameraTiltUp.input.value
		this.cameraman.desired.tilt += normal.cameraTiltDown.input.value
		this.cameraman.desired.swivel -= normal.cameraSwivelLeft.input.value
		this.cameraman.desired.swivel += normal.cameraSwivelRight.input.value
		this.cameraman.desired.distance -= normal.cameraZoomIn.input.value
		this.cameraman.desired.distance += normal.cameraZoomOut.input.value
	}
}

