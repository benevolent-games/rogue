
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
		const spoons = new Set<CauseSpoon>()
		for (const [code, options = {}] of forkBind) {
			const style = options.style ?? "eager"
			const spoon = new CauseSpoon(this.obtainCause(code), style)

			if (options.sensitivity)
				spoon.sensitivity = options.sensitivity

			if (options.threshold)
				spoon.interpreter.threshold = options.threshold

			for (const code of options.with ?? [])
				spoon.with.add(this.obtainCause(code))

			for (const code of options.without ?? [])
				spoon.without.add(this.obtainCause(code))

			spoons.add(spoon)
		}
		const fork = new CauseFork(spoons)
		this.#forks.add(fork)
		return fork
	}

	obtainCause(code: string) {
		return this.#causes.guarantee(code, () => new Cause())
	}

	attachDevice(device: GripDevice) {
		this.#devices.set(
			device,
			device.onInput(
				(code, input) => this.#causes.get(code)?.set(input),
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

	poll() {
		for (const device of this.devices)
			device.poll()

		for (const fork of this.#forks)
			fork.update()
	}
}

