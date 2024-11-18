
import Sparrow, {AgentInfo, StdCable} from "sparrow-rtc"

import {Multiplayer} from "./utils/multiplayer.js"
import {Bundle, Cathedral} from "../framework/relay/cathedral.js"

export class MultiplayerHost extends Multiplayer {
	constructor(
		public cathedral: Cathedral,
		public self: AgentInfo,
		public dispose: () => void,
	) { super() }

	static async host({cathedral, hello}: {
			cathedral: Cathedral
			hello: (bundle: Bundle) => () => void
		}) {

		const sparrow = await Sparrow.host<StdCable>({
			rtcConfigurator: Sparrow.turnRtcConfigurator,

			// client incoming
			welcome: prospect => {
				const seat = cathedral.reserveRemoteSeat({
					id: prospect.id,
					reputation: prospect.reputation,
				})

				prospect.onFailed(() => cathedral.deleteSeat(seat))

				return connection => {
					const bundle = cathedral.attachRemoteBundle(seat, connection)
					const goodbye = hello(bundle)

					return () => {
						cathedral.deleteSeat(seat)
						goodbye()
					}
				}
			},

			closed: () => {
				cathedral.invite = undefined
				cathedral.online = false
				console.warn("sparrow signaller disconnected")
			},
		})

		cathedral.invite = sparrow.invite
		cathedral.online = true

		const disconnect = () => {
			sparrow.close()
			cathedral.invite = undefined
			cathedral.online = false
		}

		return new this(cathedral, sparrow.self, disconnect)
	}
}

