
export type Jug<S> = {
	activate(settings: S): void
	deactivate(): void
}

export type JugSettings<J extends Jug<any>> = (
	J extends Jug<infer S> ? S : never
)

export class Juggler<J extends Jug<any>> {
	#free: J[] = []
	#active = new Set<J>()

	constructor(
		private max: number = 1_000,
		private produce: () => J,
	) {}

	get size() {
		return this.#free.length + this.#active.size
	}

	acquire(settings: JugSettings<J>) {
		const jug = this.#free.pop() ?? this.produce()
		jug.activate(settings)
		this.#active.add(jug)
		this.check()
		return jug
	}

	release(jug: J) {
		jug.deactivate()
		this.#active.delete(jug)
		this.#free.push(jug)
	}

	check() {
		const {size, max} = this
		if (size > max)
			console.warn(`juggler max ${max} exceeded, has ${size} jugs`)
	}
}

