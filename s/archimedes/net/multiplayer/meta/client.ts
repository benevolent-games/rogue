
import {Signal} from "@benev/slate"
import {Lobby} from "../../relay/cathedral.js"

export type MetaClient = ReturnType<typeof metaClientApi>

export function metaClientApi<Identity>({lobby}: {
		lobby: Signal<Lobby<Identity>>
	}) {

	return {
		async ping() {},

		async updateLobby(data: Lobby<Identity>) {
			lobby.value = data
		},
	}
}

