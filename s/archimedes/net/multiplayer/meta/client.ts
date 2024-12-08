
import {Signal} from "@benev/slate"
import {Lobby} from "../../relay/cathedral.js"

export type MetaClient = ReturnType<typeof metaClientApi>

export function metaClientApi({lobby}: {
		lobby: Signal<Lobby>
	}) {

	return {
		async ping() {},

		async updateLobby(data: Lobby) {
			lobby.value = data
		},
	}
}

