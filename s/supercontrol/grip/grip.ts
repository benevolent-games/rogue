
import {deep, Map2, ob} from "@benev/slate"

import {Cause} from "./parts/cause.js"
import {GripDevice} from "./devices/device.js"
import {CauseFork} from "./parts/cause-fork.js"
import {CauseSpoon} from "./parts/cause-spoon.js"
import {asBindings, ForkBind, GripBindings, GripState} from "./parts/types.js"

export class Grip<B extends GripBindings> {
	static bindings = asBindings

	modes = new Set<keyof B>()
	state: GripState<B> = null as any

	#bindings: B = null as any
	#causes = new Map2<string, Cause>()
	#devices = new Map2<GripDevice, () => void>()
	#forks = new Set<CauseFork>()

	constructor(bindings: B) {
		this.bindings = bindings
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

	obtainCause(code: string) {
		return this.#causes.guarantee(code, () => new Cause())
	}

	attachDevice(device: GripDevice) {
		this.#devices.set(
			device,
			device.onInput(
				(code, value) => {
					const cause = this.#causes.get(code)
					if (cause)
						cause.value = value
				},
			),
		)
		return this
	}

	get devices() {
		return [...this.#devices.keys()]
	}

	unattachDevice(device: GripDevice) {
		const dispose = this.#devices.get(device) ?? (() => {})
		dispose()
		this.#devices.delete(device)
		return this
	}

	dispose() {
		for (const device of this.devices)
			this.unattachDevice(device)
	}

	update() {
		for (const device of this.devices)
			device.poll()

		for (const fork of this.#forks)
			fork.update()
	}
}

