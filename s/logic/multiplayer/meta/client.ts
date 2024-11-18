
import {Signal} from "@benev/slate"
import {Lobby} from "../../framework/relay/cathedral.js"

export type MetaClient = ReturnType<typeof metaClientApi>

export function metaClientApi({lobby}: {
		lobby: Signal<Lobby>
	}) {

	return {
		async ping() {},

		async updateLobby(data: Lobby) {
			console.log("GOT LOBBY DATA!!")
			lobby.value = data
		},
	}
}

