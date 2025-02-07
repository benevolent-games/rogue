
import {ev, Map2} from "@benev/slate"

export const onStorageEvent = (fn: () => void) => ev(window, {storage: fn})

export type SimpleStore<D> = {
	readonly key: string
	get(): D | null
	require(): D
	set(data: D): void
	guarantee(fn: () => D): D
}

export class MemoryStore<D> implements SimpleStore<D> {
	#map = new Map2<string, D>()
	constructor(public readonly key: string) {}

	get(): D | null {
		return this.#map.get(this.key) ?? null
	}

	require(): D {
		return this.#map.require(this.key)
	}

	set(data: D) {
		this.#map.set(this.key, data)
	}

	guarantee(make: () => D): D {
		let data = this.get()
		if (data === null) {
			data = make()
			this.set(data)
		}
		return data
	}
}

export class JsonStore<D> implements SimpleStore<D> {
	constructor(
		public readonly key: string,
		public readonly storage: Storage = window.localStorage,
	) {}

	set(data: D) {
		this.storage.setItem(this.key, JSON.stringify(data))
	}

	get(): D | null {
		const string = this.storage.getItem(this.key)
		try {
			return string
				? JSON.parse(string)
				: null
		}
		catch {
			return null
		}
	}

	require(): D {
		const data = this.get()
		if (data === null)
			throw new Error(`json store key "${this.key}" returned null`)
		return data
	}

	guarantee(make: () => D) {
		let data = this.get()
		if (data === null) {
			data = make()
			this.set(data)
		}
		return data
	}
}

