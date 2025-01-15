
import {deep, ev, Map2, ob, pubsub} from "@benev/slate"

export class Cause {
	value = 0
	previously = 0
	time = Date.now()
	on = pubsub<[Cause]>()

	constructor(public code: string) {}

	get active() {
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

/** group of causes with an AND relationship, they must activate together */
export class CauseSpoon {
	value = 0
	previous = 0
	causes = new Set<Cause>()

	update() {
		this.previous = this.value
		let value = 0
		let count = 0

		for (const cause of this.causes) {
			count += 1
			value += cause.value
		}

		this.value = (count === this.causes.size)
			? value
			: 0
	}
}

/** group of spoons with an OR relationship */
export class CauseFork {
	value = 0
	previous = 0
	spoons = new Set<CauseSpoon>()
	on = pubsub<[CauseFork]>()

	update() {
		this.previous = this.value
		for (const spoon of this.spoons) {
			spoon.update()
			this.value += spoon.value
		}
		if (this.previous !== this.value)
			this.on.publish(this)
	}
}

export function modprefix(event: KeyboardEvent | PointerEvent) {
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

////////////////////

export type SpoonBind = string[]
export type ForkBind = SpoonBind[]
export type ForkBinds = Record<string, ForkBind>
export type GripBindings = Record<string, ForkBinds>

export type GripState<B extends GripBindings> = {
	[Mode in keyof B]: {
		[ActionName in keyof B[Mode]]: CauseFork
	}
}

export class Grip<B extends GripBindings> {
	modes = new Set<keyof B>()
	state: GripState<B> = null as any

	#bindings: B = null as any
	#causes = new Map2<string, Cause>()
	#devices = new Map2<GripDevice, () => void>()
	#forks = new Set<CauseFork>()

	constructor(bindings: B) {
		this.bindings = bindings
	}

	#makeFork(forkBind: ForkBind) {
		const fork = new CauseFork()
		this.#forks.add(fork)
		for (const spoonBind of forkBind) {
			const spoon = new CauseSpoon()
			for (const code of spoonBind) {
				const cause = this.obtainCause(code)
				spoon.causes.add(cause)
			}
			fork.spoons.add(spoon)
		}
		return fork
	}

	get bindings() {
		return this.#bindings
	}

	set bindings(bindings: B) {
		this.#forks.clear()
		this.#bindings = deep.freeze(deep.clone(bindings))
		this.state = ob(this.#bindings).map(binds =>
			ob(binds).map(bind => this.#makeFork(bind))
		) as GripState<B>
	}

	obtainCause(code: string) {
		return this.#causes.guarantee(code, () => new Cause(code))
	}

	attachDevice(device: GripDevice) {
		this.#devices.set(
			device,
			device.onInput(
				(code, value) => this.#causes.get(code)?.set(value)
			),
		)
	}

	detachDevice(device: GripDevice) {
		this.#devices.delete(device)
	}

	update() {
		for (const fork of this.#forks)
			fork.update()
	}
}

////////////////////
////////////////////

const bindings = {
	normal: {
		sprint: [["LeftShift"]],
		moveUp: [["KeyW"], ["Up"], ["g.stick.left.up"]],
		moveDown: [["KeyS"], ["Down"], ["g.stick.left.down"]],
		moveLeft: [["KeyA"], ["Left"], ["g.stick.left.left"]],
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
