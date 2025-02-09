
import {InputPayload, SnapshotPayload} from "../../framework/parts/types.js"

export type Ping = ["ping", number]
export type Pong = ["pong", number]
export type InputsMessage = ["inputs", InputPayload]
export type SnapshotMessage = ["snapshot", SnapshotPayload]
export type GameMessage = Ping | Pong | InputsMessage | SnapshotMessage

