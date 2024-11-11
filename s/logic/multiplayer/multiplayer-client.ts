
import {signal} from "@benev/slate"
import {LobbyDisplay} from "./lobby/types.js"
import {Multiplayer} from "./utils/multiplayer.js"

export class MultiplayerClient extends Multiplayer {
	static async join() {
	}

	constructor(invite: string) {
		super(signal<LobbyDisplay>({
			invite,
			lobbyists: [],
		}))
	}

	dispose() {}
}

