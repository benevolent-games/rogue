
import {LobbyDisplay, Lobbyist} from "./types.js"
import {signal, repeat, signals} from "@benev/slate"
import Sparrow, {AgentInfo, StdCable, WelcomeFn} from "sparrow-rtc"

export class Lobby {
	invite = signal<string | null>(null)
	signallerConnected = signal(false)
	lobbyists = signal(new Map<string, Lobbyist>())

	display = signals.computed((): LobbyDisplay => {
		return {
			invite: this.invite.value,
			lobbyists: [...this.lobbyists.value.values()].map(lobbyist => ({
				kind: lobbyist.kind,
				id: lobbyist.id,
				reputation: lobbyist.reputation,
				connectionInfo: lobbyist.kind === "client" && lobbyist.stats
					? {kind: lobbyist.stats?.kind ?? "unknown"}
					: null
			}))
		}
	})

	// somebody is joining
	welcome: WelcomeFn<StdCable> = prospect => {
		const lobbyists = this.lobbyists.value
		const lobbyist: Lobbyist = {
			kind: "client",
			id: prospect.id,
			reputation: prospect.reputation,
			connection: null,
			stats: null,
		}

		// add the prospect
		lobbyists.set(prospect.id, lobbyist)
		this.lobbyists.publish()

		// what to do when this prospect dies
		const perished = () => {
			lobbyists.delete(prospect.id)
			this.lobbyists.publish()
		}
		prospect.onFailed(perished)

		// connection success
		return connection => {
			lobbyist.connection = connection
			this.lobbyists.publish()

			const stopStats = repeat(5_000, async() => {
				if (connection.peer.connectionState === "connected") {
					try {
						lobbyist.stats = await Sparrow.reportConnectivity(connection.peer)
						this.lobbyists.publish()
					}
					catch {
						lobbyist.stats = null
						this.lobbyists.publish()
					}
				}
				else {
					lobbyist.stats = null
					this.lobbyists.publish()
				}
			})

			// disconnected
			return () => {
				stopStats()
				perished()
			}
		}
	}

	addSelf(self: AgentInfo) {
		const host: Lobbyist = {
			kind: "host",
			id: self.id,
			reputation: self.reputation,
		}
		this.lobbyists.value.set(self.id, host)
		this.lobbyists.publish()
		return host
	}

	disconnectEverybody() {
		for (const lobbyist of this.lobbyists.value.values()) {
			if (lobbyist.kind === "client" && lobbyist.connection)
				lobbyist.connection.disconnect()
		}
	}
}

