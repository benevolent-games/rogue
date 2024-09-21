
import {Map2} from "../../../tools/map2.js"
import {Archetype, Data, EntityId, Memo, ReplicatorId} from "../types.js"

export type Feedbacks = [ReplicatorId, Feedback][]

export type Feedback = {
	datas: [EntityId, Data][]
	memos: [EntityId, Memo[]][]
}

export class FeedbackCollector {
	datas = new Map<EntityId, Data>()
	memos = new Map2<EntityId, Memo[]>()

	setData(entityId: EntityId, data: Data) {
		this.datas.set(entityId, data)
	}

	addMemos(entityId: EntityId, memos: Memo[]) {
		this.memos
			.guarantee(entityId, () => [])
			.push(...memos)
	}

	aggregate(feedback: Feedback) {
		feedback.datas.forEach(([id, d]) => this.setData(id, d))
		feedback.memos.forEach(([id, m]) => this.addMemos(id, m))
	}

	take(): Feedback {
		const datas = [...this.datas]
		const memos = [...this.memos]
		this.datas.clear()
		this.memos.clear()
		return {datas, memos}
	}
}

export class FeedbackHelper<Arc extends Archetype> {
	constructor(
		public entityId: EntityId,
		public collector: FeedbackCollector,
	) {}

	sendData(data: Arc["data"]) {
		this.collector.setData(this.entityId, data)
	}

	sendMemo(memo: Arc["memo"]) {
		this.collector.addMemos(this.entityId, [memo])
	}
}

