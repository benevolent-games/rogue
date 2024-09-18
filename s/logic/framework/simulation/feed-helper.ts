
import {Scribe} from "./scribe.js"
import {Archetype} from "../types.js"

export class FeedHelper<Ar extends Archetype> {
	#scribe: Scribe
	#facts: Ar["facts"]

	constructor(public id: number, scribe: Scribe, facts: Ar["facts"]) {
		this.#scribe = scribe
		this.#facts = facts
	}

	get facts() {
		return this.#facts
	}

	set facts(f: Ar["facts"]) {
		this.#facts = f
		this.#scribe.updated.push([this.id, f])
	}

	broadcast(message: Ar["broadcast"]) {
		this.#scribe.broadcasted.push([this.id, message])
	}
}

