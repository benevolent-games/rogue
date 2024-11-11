
import {Lobby} from "./lobby/lobby.js"
import {Multiplayer} from "./utils/multiplayer.js"

export class MultiplayerHost extends Multiplayer {
	static async host() {}

	constructor(public lobby: Lobby) {
		super(lobby.display)
	}

	dispose() {}
}

