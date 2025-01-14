
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

export class KeyboardDevice {
	dispose: () => void

	onInput = pubsub<[string, number]>()

	#modlabel(event: KeyboardEvent) {
		const modifiers: string[] = []
		if (event.ctrlKey) modifiers.push("C")
		if (event.altKey) modifiers.push("A")
		if (event.shiftKey) modifiers.push("S")
		if (event.metaKey) modifiers.push("M")
		return modifiers.length > 0
			? [...modifiers, event.code].join("-")
			: `X-${event.code}`
	}

	constructor(target: EventTarget) {
		const dispatch = (label: string, value: number) => this.onInput.publish(label, value)
		this.dispose = ev(target, {
			keydown: (event: KeyboardEvent) => {
				dispatch(event.code, 1)
				dispatch(this.#modlabel(event), 1)
			},
			keyup: (event: KeyboardEvent) => {
				dispatch(event.code, 0)
				dispatch(this.#modlabel(event), 0)
			},
		})
	}
}

// export class MouseButtonDevice {
// 	dispose: () => void
//
// 	#modlabel(event: PointerEvent) {
// 		const modifiers: string[] = []
// 		if (event.ctrlKey) modifiers.push("C")
// 		if (event.altKey) modifiers.push("A")
// 		if (event.shiftKey) modifiers.push("S")
// 		if (event.metaKey) modifiers.push("M")
// 		return modifiers.length > 0
// 			? [...modifiers, event.code].join("-")
// 			: `X-${event.code}`
// 	}
//
// 	constructor(target: EventTarget, dispatch: (label: string, value: number) => void) {
// 		this.dispose = ev(target, {
// 			keydown: (event: KeyboardEvent) => {
// 				dispatch(event.code, 1)
// 				dispatch(this.#modlabel(event), 1)
// 			},
// 			keyup: (event: KeyboardEvent) => {
// 				dispatch(event.code, 0)
// 				dispatch(this.#modlabel(event), 0)
// 			},
// 		})
// 	}
// }

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
		forward: [new Cause("KeyW")],
		backward: [new Cause("KeyS")],
		leftward: [new Cause("KeyA")],
		rightward: [new Cause("KeyD")],
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
