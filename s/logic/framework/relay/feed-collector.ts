
import {Feed} from "./types.js"
import {EntityId, Facts, FeedEvent} from "../types.js"

export class FeedCollector {
	#feed: FeedEvent.Any[] = []

	record = (event: FeedEvent.Any) => {
		this.#feed.push(event)
	}

	take(): Feed {
		const feed = this.#feed
		this.#feed = []

		const facts = new Map<EntityId, Facts>()
		const aggregate: Feed = {
			creates: [],
			facts: [],
			broadcasts: [],
			destroys: [],
		}

		for (const event of feed) switch (event.kind) {
			case "create":
				aggregate.creates.push([event.entityId, event.state])
				break

			case "facts":
				facts.set(event.entityId, event.facts)
				break

			case "broadcast":
				aggregate.broadcasts.push([event.entityId, event.broadcast])
				break

			case "destroy":
				aggregate.destroys.push(event.entityId)
				break
		}

		aggregate.facts = [...facts.entries()]
		return aggregate
	}
}

