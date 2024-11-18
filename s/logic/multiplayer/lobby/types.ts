//
// import {Identity} from "../types.js"
// import {AgentInfo, Connection, ConnectivityKind, ConnectivityReport} from "sparrow-rtc"
//
// export type LobbyistHost = {
// 	kind: "host"
// 	registration: Registration
// }
//
// export type LobbyistClient = {
// 	kind: "client"
// 	agent: AgentInfo
// 	registration: Registration
// 	connectivity: Connectivity | null
// }
//
// export type Lobbyist = LobbyistHost | LobbyistClient
//
// //////////////////////
//
// export type Registration = {
// 	identity: Identity
// 	replicatorId: number
// }
//
// export type Connectivity = {
// 	connection: Connection
// 	stats: ConnectivityReport | null
// 	ping: number | null
// }
//
// export type ConnectionInfo = {
// 	kind: ConnectivityKind | "unknown"
// 	ping: number | null
// }
//
// //////////////////////
//
// export type LobbyDisplay = {
// 	online: null | {
// 		invite: string | null
// 		hostAgent: AgentInfo
// 	}
// 	lobbyists: LobbyistDisplay[]
// }
//
// export type LobbyistDisplay = LobbyistDisplayHost | LobbyistDisplayClient
//
// export type LobbyistDisplayHost = {
// 	kind: "host"
// 	agent: AgentInfo
// 	registration: Registration
// }
//
// export type LobbyistDisplayClient = {
// 	kind: "client"
// 	agent: AgentInfo
// 	registration: Registration
// 	connectionInfo: ConnectionInfo | null
// }
//
