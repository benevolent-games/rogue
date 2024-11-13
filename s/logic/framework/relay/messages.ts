
import {Parcel} from "./inbox-outbox.js"
import {Feed, Feedback} from "./types.js"

export type DiagnosticMessage = ["diagnostic", Ping | Pong]
export type Ping = ["ping", number]
export type Pong = ["pong", number]

export type GameMessage = ["game", FeedParcel | FeedbackParcel]
export type FeedParcel = ["feed", Parcel<Partial<Feed>>]
export type FeedbackParcel = ["feedback", Parcel<Partial<Feedback>>]

export type Message = GameMessage | DiagnosticMessage

