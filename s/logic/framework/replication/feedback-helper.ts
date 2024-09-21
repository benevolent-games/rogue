
import {Archetype, EntityId} from "../types.js"
import {RecordFeedbackEventFn} from "./types.js"

export class FeedbackHelper<Ar extends Archetype> {
	#data: Ar["data"]

	constructor(
			private record: RecordFeedbackEventFn,
			private entityId: EntityId,
			data: Ar["data"],
		) {
		this.#data = data
	}

	get data() {
		return this.#data
	}

	set data(data: Ar["data"]) {
		this.#data = data
		this.record({kind: "data", entityId: this.entityId, data})
	}

	memo(memo: Ar["memo"]) {
		this.record({kind: "memo", entityId: this.entityId, memo})
	}
}

