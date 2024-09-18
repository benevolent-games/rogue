
import {Scribe} from "./scribe.js"

export class FeedHelper<F> {
	#scribe: Scribe
	#facts: F

	constructor(public id: number, scribe: Scribe, facts: F) {
		this.#scribe = scribe
		this.#facts = facts
	}

	get facts() {
		return this.#facts
	}

	set facts(f: F) {
		this.#facts = f
		this.#scribe.updated.push([this.id, f])
	}

	broadcast(message: any) {
		this.#scribe.broadcasted.push([this.id, message])
	}
}

