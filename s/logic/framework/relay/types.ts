
import {Archetype, Broadcast, Data, EntityId, Facts, Memo, ReplicatorId, State} from "../types.js"

export type Parcel<T> = [number, T]

// export type Feed = {
// 	creates: [EntityId, State][]
// 	facts: [EntityId, Facts][]
// 	broadcasts: [EntityId, Broadcast][]
// 	destroys: EntityId[]
// }
//
// export const emptyFeed = (): Feed => ({
// 	creates: [],
// 	facts: [],
// 	broadcasts: [],
// 	destroys: [],
// })
//
// export type Feedback = {
// 	datas: [EntityId, Data][]
// 	memos: [EntityId, Memo][]
// }
//
// export const emptyFeedback = (): Feedback => ({
// 	datas: [],
// 	memos: [],
// })
//
// export type Feedbacks = [ReplicatorId, Feedback][]
//
// export type EntityFeedback<Ar extends Archetype> = {
// 	readonly data: Ar["data"],
// 	readonly memos: Ar["memo"][],
// }
//
