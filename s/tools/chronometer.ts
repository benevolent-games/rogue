
export class Chronometer {
	#bank = 0
	#mark: number | null = null

	get active() {
		return this.#mark !== null
	}

	get #sinceMark() {
		return this.#mark === null
			? 0
			: performance.now() - this.#mark
	}

	get milliseconds() {
		return this.#bank + this.#sinceMark
	}

	get seconds() {
		return this.milliseconds / 1000
	}

	start() {
		if (!this.active)
			this.#mark = performance.now()
		return this
	}

	stop() {
		if (this.active) {
			this.#bank += this.#sinceMark
			this.#mark = null
		}
		return this
	}

	reset() {
		this.#bank = 0
		this.#mark = null
		return this
	}
}

