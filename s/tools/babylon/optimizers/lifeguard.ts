
import {Map2} from "@benev/slate"
import {Prop} from "@benev/toolbox"
import {PropPool} from "./prop-pool.js"
import {Crate} from "../logistics/crate.js"

export type PooledProp = [Prop, () => void]

export class Lifeguard {
	#instances = new Map2<Crate, PropPool>()
	#clones = new Map2<Crate, PropPool>()

	#getPool(crate: Crate, instance: boolean) {
		return instance
			? this.#instances.guarantee(crate, () => new PropPool(crate, true))
			: this.#clones.guarantee(crate, () => new PropPool(crate, false))
	}

	preload(crate: Crate, instance: boolean, count: number) {
		this.#getPool(crate, instance).preload(count)
	}

	spawn(crate: Crate, instance: boolean = true) {
		const pool = this.#getPool(crate, instance)
		const prop = pool.acquire()
		const release = () => pool.release(prop)
		return [prop, release] as PooledProp
	}
}

