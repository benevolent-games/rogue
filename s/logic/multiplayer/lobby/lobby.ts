//
// import {signal, repeat, signals} from "@benev/slate"
// import Sparrow, {AgentInfo, StdCable, WelcomeFn} from "sparrow-rtc"
//
// import {Identity} from "../types.js"
// import {LobbyDisplay, Lobbyist} from "./types.js"
//
// export class Lobby {
// 	static emptyDisplay(): LobbyDisplay {
// 		return {
// 			invite: null,
// 			lobbyists: [],
// 		}
// 	}
//
// 	invite = signal<string | null>(null)
// 	signallerConnected = signal(false)
// 	lobbyists = signal(new Map<string, Lobbyist>())
//
// 	display = signals.computed((): LobbyDisplay => {
// 		return {
// 			invite: this.invite.value,
// 			lobbyists: [...this.lobbyists.value.values()].map(lobbyist => ({
// 				kind: lobbyist.kind,
// 				id: lobbyist.id,
// 				reputation: lobbyist.reputation,
// 				replicatorId: lobbyist.replicatorId,
// 				identity: lobbyist.identity,
// 				connectionInfo: lobbyist.kind === "client" && lobbyist.stats
// 					? {kind: lobbyist.stats?.kind ?? "unknown"}
// 					: null
// 			}))
// 		}
// 	})
//
// 	// somebody is joining
// 	welcome: WelcomeFn<StdCable> = prospect => {
// 		const lobbyists = this.lobbyists.value
// 		const lobbyist: Lobbyist = {
// 			kind: "client",
// 			id: prospect.id,
// 			reputation: prospect.reputation,
// 			replicatorId: null,
// 			identity: null,
// 			connection: null,
// 			stats: null,
// 		}
//
// 		// add the prospect
// 		lobbyists.set(prospect.id, lobbyist)
// 		this.lobbyists.publish()
//
// 		// what to do when this prospect dies
// 		const perished = () => {
// 			lobbyists.delete(prospect.id)
// 			this.lobbyists.publish()
// 		}
// 		prospect.onFailed(perished)
//
// 		// connection success
// 		return connection => {
// 			lobbyist.connection = connection
// 			this.lobbyists.publish()
//
// 			const stopStats = repeat(5_000, async() => {
// 				if (connection.peer.connectionState === "connected") {
// 					try {
// 						lobbyist.stats = await Sparrow.reportConnectivity(connection.peer)
// 						this.lobbyists.publish()
// 					}
// 					catch {
// 						lobbyist.stats = null
// 						this.lobbyists.publish()
// 					}
// 				}
// 				else {
// 					lobbyist.stats = null
// 					this.lobbyists.publish()
// 				}
// 			})
//
// 			// disconnected
// 			return () => {
// 				stopStats()
// 				perished()
// 			}
// 		}
// 	}
//
// 	showConnected(invite: string) {
// 		this.invite.value = invite
// 		this.signallerConnected.value = true
// 	}
//
// 	showDisconnected() {
// 		this.invite.value = null
// 		this.signallerConnected.value = false
// 	}
//
// 	addSelf(self: AgentInfo, replicatorId: number) {
// 		const host: Lobbyist = {
// 			kind: "host",
// 			id: self.id,
// 			reputation: self.reputation,
// 			replicatorId,
// 			identity: null,
// 		}
// 		this.lobbyists.value.set(self.id, host)
// 		this.lobbyists.publish()
// 		return host
// 	}
//
// 	updateIdentity(id: string, identity: Identity | null) {
// 		const lobbyist = this.lobbyists.value.get(id)
// 		if (lobbyist) {
// 			lobbyist.identity = identity
// 			this.lobbyists.publish()
// 		}
// 	}
//
// 	disconnectEverybody() {
// 		for (const lobbyist of this.lobbyists.value.values()) {
// 			if (lobbyist.kind === "client" && lobbyist.connection)
// 				lobbyist.connection.disconnect()
// 		}
// 	}
// }
//
