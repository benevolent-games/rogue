
export abstract class Jug {
	abstract activate(): void
	abstract deactivate(): void
}

export class Juggler<J extends Jug> {
	#free: J[] = []
	#active = new Set<J>()

	constructor(
		private produce: () => J,
		private max: number = 1_000,
	) {}

	acquire() {
		const jug = this.#free.pop() ?? this.produce()
		jug.activate()
		this.#active.add(jug)
		this.check()
		return () => this.release(jug)
	}

	release(jug: J) {
		jug.deactivate()
		this.#active.delete(jug)
		this.#free.push(jug)
	}

	check() {
		const size = this.#free.length + this.#active.size
		if (size > this.max)
			console.warn(`juggler max ${this.max} exceeded, has ${size} jugs`)
	}
}

