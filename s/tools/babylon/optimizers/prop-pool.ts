
import {loop, Prop} from "@benev/toolbox"
import {Crate} from "../logistics/crate.js"

export class PropPool {
	#free: Prop[] = []
	#alive = new Set<Prop>()

	constructor(
		public crate: Crate,
		public instance: boolean,
	) {}

	get size() {
		return this.#free.length + this.#alive.size
	}

	preload(count: number) {
		for (const _ of loop(count)) {
			const prop = this.instance
				? this.crate.instance()
				: this.crate.clone()
			prop.setEnabled(false)
			this.#free.push(prop)
		}
	}

	acquire() {
		const prop = this.#free.pop() ?? (
			this.instance
				? this.crate.instance()
				: this.crate.clone()
		)

		this.#alive.add(prop)
		prop.setEnabled(true)
		return prop
	}

	release(prop: Prop) {
		prop.setEnabled(false)
		this.#alive.delete(prop)
		this.#free.push(prop)
	}

	dispose() {
		for (const prop of this.#alive)
			prop.dispose()

		for (const prop of this.#free)
			prop.dispose()
	}
}

