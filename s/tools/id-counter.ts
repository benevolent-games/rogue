
export class IdCounter {
	#count = 0

	next() {
		return this.#count++
	}
}

