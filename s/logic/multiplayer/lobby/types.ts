
import {Identity} from "../types.js"
import {Connection, ConnectivityKind, ConnectivityReport, StdCable} from "sparrow-rtc"

export type LobbyHost = {
	kind: "host"
	id: string
	reputation: string
	replicatorId: number | null
	identity: Identity | null
}

export type LobbyClient = {
	kind: "client"
	id: string
	reputation: string
	replicatorId: number | null
	identity: Identity | null
	connection: Connection<StdCable> | null
	stats: ConnectivityReport | null
}

export type Lobbyist = LobbyHost | LobbyClient

//////////////////////

export type LobbyDisplay = {
	invite: string | null
	lobbyists: LobbyistDisplay[]
}

export type LobbyistDisplay = {
	kind: "host" | "client"
	id: string
	reputation: string
	replicatorId: number | null
	identity: Identity | null
	connectionInfo: null | {
		kind: ConnectivityKind | "unknown"
	}
}

