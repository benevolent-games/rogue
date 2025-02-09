
import {deep, ev, Map2, ob} from "@benev/slate"

import {Cause} from "./parts/cause.js"
import {GripDevice} from "./devices/device.js"
import {CauseFork} from "./parts/cause-fork.js"
import {CauseSpoon} from "./parts/cause-spoon.js"
import {asBindings, ForkBind, GripBindings, GripState} from "./parts/types.js"

export class Grip<B extends GripBindings> {
	static bindings = asBindings

	state: GripState<B> = null as any

	#modes = new Set<keyof B>()
	#bindings: B = null as any
	#forks = new Set<CauseFork>()
	#causes = new Map2<string, Cause>()
	#forksByMode = new Map2<keyof B, Set<CauseFork>>()

	#devices = new Map2<GripDevice, () => void>()
	#unattachBlur = ev(window, {blur: () => this.unstickAll()})

	constructor(bindings: B) {
		this.bindings = bindings
	}

	get bindings() {
		return this.#bindings
	}

	set bindings(bindings: B) {
		this.#forks.clear()
		this.#bindings = deep.freeze(deep.clone(bindings))
		this.state = ob(this.#bindings).map((binds, mode) =>
			ob(binds).map(bind => this.#makeFork(mode, bind))
		) as GripState<B>
	}

	get devices() {
		return [...this.#devices.keys()]
	}

	get modes() {
		return [...this.#modes]
	}

	enableMode(mode: keyof B) {
		this.#modes.add(mode)
		return this
	}

	disableMode(mode: keyof B) {
		this.#modes.delete(mode)
		this.#forks.forEach(fork => fork.update())
		return this
	}

	clearModes() {
		this.#modes.clear()
		this.#forks.forEach(fork => fork.update())
		return this
	}

	#makeFork(mode: keyof B, forkBind: ForkBind) {
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
		const isModeActive = () => this.#modes.has(mode)
		const fork = new CauseFork(spoons, isModeActive)
		this.#forks.add(fork)
		this.#forksByMode.guarantee(mode, () => new Set()).add(fork)
		return fork
	}

	unstickAll() {
		this.#causes.forEach(cause => cause.set(0, false))
		this.#forks.forEach(fork => fork.set(0, false))
		return this
	}

	obtainCause(code: string) {
		return this.#causes.guarantee(code, () => new Cause())
	}

	attachDevice(device: GripDevice) {
		this.#devices.set(
			device,
			device.onInput(
				(code, input) => {
					this.#causes.get(code)?.set(input)
				},
			),
		)
		return this
	}

	unattachDevice(device: GripDevice) {
		const dispose = this.#devices.get(device) ?? (() => {})
		dispose()
		this.#devices.delete(device)
		return this
	}

	poll() {
		for (const device of this.devices)
			device.poll()

		for (const fork of this.#forks)
			fork.update()
	}

	dispose() {
		this.#unattachBlur()
		for (const device of this.devices)
			this.unattachDevice(device)
	}
}

