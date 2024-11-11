
import {Connection, ConnectivityKind, ConnectivityReport, StdCable} from "sparrow-rtc"

export type LobbyHost = {
	kind: "host"
	id: string
	reputation: string
}

export type LobbyClient = {
	kind: "client"
	id: string
	reputation: string
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
	connectionInfo: null | {
		kind: ConnectivityKind | "unknown"
	}
}

