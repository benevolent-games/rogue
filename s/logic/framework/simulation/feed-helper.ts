
import {Archetype} from "../types.js"
import {RecordFeedEventFn} from "./types.js"

export class FeedHelper<Ar extends Archetype> {
	#facts: Ar["facts"]

	constructor(
			private record: RecordFeedEventFn,
			public id: number,
			facts: Ar["facts"],
		) {
		this.#facts = facts
	}

	get facts() {
		return this.#facts
	}

	set facts(facts: Ar["facts"]) {
		this.#facts = facts
		this.record({kind: "facts", entityId: this.id, facts})
	}

	broadcast(broadcast: Ar["broadcast"]) {
		this.record({kind: "broadcast", entityId: this.id, broadcast})
	}
}

