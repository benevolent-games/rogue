
import {Signal} from "@benev/slate"
import {Identity} from "../types.js"
import {Lobby} from "../lobby/manager.js"

export type MetaClient = ReturnType<typeof metaClientApi>

export function metaClientApi({lobby, identity}: {
		lobby: Signal<Lobby>
		identity: Signal<Identity>
	}) {

	return {
		async ping() {},

		async getIdentity() {
			return identity.value
		},

		async lobby(data: Lobby) {
			lobby.value = data
		},
	}
}

