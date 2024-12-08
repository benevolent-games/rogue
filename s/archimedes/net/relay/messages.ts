
import {InputShell, Snapshot} from "../../framework/parts/types.js"

export type Ping = ["ping", number]
export type Pong = ["pong", number]
export type InputsMessage = ["inputs", InputShell<any>[]]
export type SnapshotMessage = ["snapshot", Snapshot]
export type GameMessage = Ping | Pong | InputsMessage | SnapshotMessage

