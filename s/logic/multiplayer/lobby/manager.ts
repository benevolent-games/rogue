//
// import {signal} from "@benev/slate"
// import {AgentInfo, ConnectivityKind} from "sparrow-rtc"
// import {Identity} from "../types.js"
//
// export type Lobbyist = LocalLobbyist | RemoteLobbyist
//
// export type LocalLobbyist = {
// 	kind: "local"
// 	registration: FullRegistration
// }
//
// export type RemoteLobbyist = {
// 	kind: "remote"
// 	agent: AgentInfo
// 	registration: Registration | null
// 	connectionInfo: ConnectionInfo | null
// }
//
// //////////////////////////////////////////
//
// export type Registration = {
// 	replicatorId: number
// 	identity: Identity | null
// }
//
// export type FullRegistration = {
// 	replicatorId: number
// 	identity: Identity
// }
//
// export type ConnectionInfo = {
// 	kind: ConnectivityKind | "unknown"
// 	ping: number | null
// }
//
// export type LobbyOnline = {
// 	agent: AgentInfo
// 	invite: string | null
// }
//
// export type Lobby = {
// 	lobbyists: Lobbyist[]
// 	online: LobbyOnline | null
// }
//
// //////////////////////////////////////////
//
// export class LobbyManager {
// 	static empty(): Lobby {
// 		return {
// 			online: null,
// 			lobbyists: [],
// 		}
// 	}
//
// 	#lobbyists = new Set<Lobbyist>()
// 	#online: LobbyOnline | null = null
//
// 	#compute(): Lobby {
// 		return {
// 			online: this.#online,
// 			lobbyists: [...this.#lobbyists],
// 		}
// 	}
//
// 	lobby = signal<Lobby>(this.#compute())
//
// 	pulse() {
// 		this.lobby.value = this.#compute()
// 	}
//
// 	add<L extends Lobbyist>(lobbyist: L) {
// 		this.#lobbyists.add(lobbyist)
// 		this.pulse()
// 		return lobbyist
// 	}
//
// 	delete(lobbyist: Lobbyist) {
// 		this.#lobbyists.delete(lobbyist)
// 		this.pulse()
// 	}
//
// 	goOnline(online: LobbyOnline) {
// 		this.#online = online
// 		this.pulse()
// 	}
//
// 	goOffline() {
// 		this.#online = null
// 		this.pulse()
// 	}
//
// 	dispose() {
// 		this.goOffline()
// 		this.#lobbyists.clear()
// 		this.pulse()
// 	}
// }
//
