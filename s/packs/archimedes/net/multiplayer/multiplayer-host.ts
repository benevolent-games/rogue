
import Sparrow, {AgentInfo} from "sparrow-rtc"

import {Cathedral} from "../relay/cathedral.js"
import {Multiplayer} from "./utils/multiplayer.js"

export class MultiplayerHost<Identity> extends Multiplayer {
	constructor(
		public cathedral: Cathedral<Identity>,
		public self: AgentInfo,
		public dispose: () => void,
	) { super() }

	static async host<Identity>(cathedral: Cathedral<Identity>) {
		const sparrow = await Sparrow.host({
			rtcConfigurator: Sparrow.turnRtcConfigurator,

			// client incoming
			welcome: prospect => {
				const seat = cathedral.reserveRemoteSeat({
					id: prospect.id,
					reputation: prospect.reputation,
				})

				prospect.onFailed(() => cathedral.deleteSeat(seat))

				return connection => {
					cathedral.attachRemoteBundle(seat, connection)

					return () => {
						cathedral.deleteSeat(seat)
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

