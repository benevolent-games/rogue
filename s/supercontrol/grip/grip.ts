
import {ev, Map2, pubsub} from "@benev/slate"

export class Cause {
	value = 0
	previously = 0
	time = Date.now()
	on = pubsub<[Cause]>()

	constructor(public label: string) {}

	get down() {
		return (
			this.value >= 0.5 ||
			this.value <= 0.5
		)
	}

	set(value: number) {
		this.previously = this.value
		this.value = value
		this.time = Date.now()
		this.on.publish(this)
	}
}

export function modlabel(event: KeyboardEvent | PointerEvent) {
	const modifiers: string[] = []
	if (event.ctrlKey) modifiers.push("C")
	if (event.altKey) modifiers.push("A")
	if (event.shiftKey) modifiers.push("S")
	if (event.metaKey) modifiers.push("M")
	return modifiers.length > 0
		? [...modifiers].join("-")
		: "X"
}

export abstract class GripDevice {
	abstract dispose: () => void
	onInput = pubsub<[string, number]>()
}

export class KeyboardDevice extends GripDevice {
	dispose: () => void

	constructor(target: EventTarget) {
		super()

		const dispatch = (label: string, value: number) =>
			this.onInput.publish(label, value)

		this.dispose = ev(target, {
			keydown: (event: KeyboardEvent) => {
				dispatch(event.code, 1)
				dispatch(`${modlabel(event)}-${event.code}`, 1)
			},
			keyup: (event: KeyboardEvent) => {
				dispatch(event.code, 0)
				dispatch(`${modlabel(event)}-${event.code}`, 0)
			},
		})
	}
}

export class PointerButtonDevice extends GripDevice {
	dispose: () => void

	static buttonCode(event: PointerEvent) {
		switch (event.button) {
			case 0: return "MousePrimary"
			case 1: return "MouseTertiary"
			case 2: return "MouseSecondary"
			default: return `Mouse${event.button + 1}`
		}
	}

	static wheelCode(event: WheelEvent) {
		return event.deltaY > 0
			? "MouseWheelDown"
			: "MouseWheelUp"
	}

	constructor(target: EventTarget) {
		super()

		const dispatch = (label: string, value: number) =>
			this.onInput.publish(label, value)

		this.dispose = ev(target, {
			pointerdown: (event: PointerEvent) => {
				dispatch(PointerButtonDevice.buttonCode(event), 1)
				dispatch(modlabel(event), 1)
			},
			pointerup: (event: PointerEvent) => {
				dispatch(PointerButtonDevice.buttonCode(event), 1)
				dispatch(modlabel(event), 0)
			},
		})
	}
}

////////////////////

export class Grip {
	causes = new Map2<string, Cause>()

	addCause(cause: Cause) {
		this.causes.set(cause.label, cause)
	}

	deleteCause(cause: Cause) {
		return this.causes.delete(cause.label)
	}
}

////////////////////
////////////////////

const bindings = {
	normal: {
		sprint: [["LeftShift"]],
		moveUp: [["KeyW"], ["Up"], ["g.stick.left.up"]],
		moveDown: [["KeyS"], ["Left"], ["g.stick.left.down"]],
		moveLeft: [["KeyA"], ["Down"], ["g.stick.left.left"]],
		moveRight: [["KeyD"], ["Right"], ["g.stick.left.right"]],
		lookUp: [["KeyI"], ["g.stick.right.up"]],
		lookDown: [["KeyK"], ["g.stick.right.down"]],
		lookLeft: [["KeyJ"], ["g.stick.right.left"]],
		lookRight: [["KeyL"], ["g.stick.right.right"]],
	},
}




//
// const grip = new Grip()
//
// const forward = new Grip({
// 	causes: [],
// })
//
// grip.bindings = {
// 	normal: {
// 		buttons: {
// 			forward: button(plain("KeyW"), plain("Up")),
// 			special: button(mod("LeftAlt")),
// 		},
// 	},
// }
//
