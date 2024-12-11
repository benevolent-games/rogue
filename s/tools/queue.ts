
export class Queue<X> {
	#queue: X[] = []

	clear() {
		this.#queue = []
	}

	give(x: X) {
		this.#queue.push(x)
	}

	take(n: number) {
		if (this.#queue.length === 0)
			return []
		return this.#queue.splice(0, Math.min(n, this.#queue.length))
	}
}

