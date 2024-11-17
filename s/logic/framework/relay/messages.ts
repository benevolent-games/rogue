
import {Feed, Feedback, Snapshot} from "./types.js"

export type Ping = ["ping", number]
export type Pong = ["pong", number]
export type FeedMessage = ["feed", Partial<Feed>]
export type FeedbackMessage = ["feedback", Partial<Feedback>]
export type SnapshotMessage = ["snapshot", Snapshot]
export type GameMessage = Ping | Pong | FeedMessage | FeedbackMessage | SnapshotMessage

