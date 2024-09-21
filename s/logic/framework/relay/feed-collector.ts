
import {Feed} from "./types.js"
import {Map2} from "../../../tools/map2.js"
import {Archetype, Broadcast, EntityId, Facts, State} from "../types.js"

export class FeedCollector {
	creates = new Map<EntityId, State>()
	facts = new Map<EntityId, Facts>()
	broadcasts = new Map2<EntityId, Broadcast[]>()
	destroys = new Set<EntityId>()

	setCreate(entityId: EntityId, state: State) {
		this.creates.set(entityId, state)
	}

	setFacts(entityId: EntityId, facts: Facts) {
		this.facts.set(entityId, facts)
	}

	addBroadcasts(entityId: EntityId, broadcasts: Broadcast[]) {
		this.broadcasts
			.guarantee(entityId, () => [])
			.push(...broadcasts)
	}

	setDestroy(entityId: EntityId) {
		this.destroys.add(entityId)
	}

	aggregate(feed: Feed) {
		feed.creates.forEach(([id, s]) => this.setCreate(id, s))
		feed.facts.forEach(([id, f]) => this.setFacts(id, f))
		feed.broadcasts.forEach(([id, b]) => this.addBroadcasts(id, b))
		feed.destroys.forEach(id => this.setDestroy(id))
	}

	take(): Feed {
		const creates = [...this.creates]
		const facts = [...this.facts]
		const broadcasts = [...this.broadcasts]
		const destroys = [...this.destroys]
		this.creates.clear()
		this.facts.clear()
		this.broadcasts.clear()
		this.destroys.clear()
		return {creates, facts, broadcasts, destroys}
	}
}

export class FeedHelper<Arc extends Archetype> {
	constructor(
		public entityId: EntityId,
		public collector: FeedCollector,
		public state: State<Arc["facts"]>,
	) {}

	get facts() {
		return this.state.facts
	}

	set facts(facts: Arc["facts"]) {
		this.sendFacts(facts)
	}

	sendFacts(facts: Arc["facts"]) {
		this.state.facts = facts
		this.collector.setFacts(this.entityId, facts)
	}

	sendBroadcast(broadcast: Arc["broadcast"]) {
		this.collector.addBroadcasts(this.entityId, [broadcast])
	}
}

