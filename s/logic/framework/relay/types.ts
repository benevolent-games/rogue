
import {FeedbackCollector} from "./feedback-collector.js"
import {Broadcast, Data, EntityId, Facts, Memo, ReplicatorId, State} from "../types.js"

export type Parcel<T> = [number, T]

export type Feed = {
	creates: [EntityId, State][]
	facts: [EntityId, Facts][]
	broadcasts: [EntityId, Broadcast[]][]
	destroys: EntityId[]
}

export type Feedbacks = [ReplicatorId, Feedback][]

export type Feedback = {
	datas: [EntityId, Data][]
	memos: [EntityId, Memo[]][]
}

export type FeedFacts = Feed["facts"]
export type FeedEvents = Pick<Feed, "creates" | "broadcasts" | "destroys">

export type FeedbackDatas = Feedback["datas"]
export type FeedbackMemos = Feedback["memos"]

export type Netconnection = {
	replicatorId: ReplicatorId
	feedbackCollector: FeedbackCollector
	sendFacts: (feedFacts: FeedFacts) => void
	sendEvents: (feedEvents: FeedEvents) => void
}

