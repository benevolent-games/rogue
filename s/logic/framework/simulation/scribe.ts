
import {Feed} from "./types.js"
import {EntityId, State} from "../types.js"

export class Scribe {
	created: [EntityId, State][] = []
	updated: [EntityId, any][] = []
	broadcasted: [EntityId, any][] = []
	destroyed: EntityId[] = []

	extract(): Feed {
		const {created, updated, broadcasted, destroyed} = this
		this.created = []
		this.updated = []
		this.broadcasted = []
		this.destroyed = []
		return {created, updated, broadcasted, destroyed}
	}
}

