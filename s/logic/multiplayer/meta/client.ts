
import {Signal} from "@benev/slate"
import {LobbyDisplay} from "../lobby/types.js"

export type MetaClient = ReturnType<typeof metaClientApi>

export function metaClientApi({lobbyDisplay}: {lobbyDisplay: Signal<LobbyDisplay>}) {
	return {
		async ping() {},
		async lobby(lobby: LobbyDisplay) {
			lobbyDisplay.value = lobby
		},
	}
}

