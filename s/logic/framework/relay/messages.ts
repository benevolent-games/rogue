
import {Feed, Feedback} from "./types.js"

export type Ping = ["ping", number]
export type Pong = ["pong", number]
export type FeedMessage = ["feed", Partial<Feed>]
export type FeedbackMessage = ["feedback", Partial<Feedback>]
export type Message = Ping | Pong | FeedMessage | FeedbackMessage

