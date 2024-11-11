
import {Signal} from "@benev/slate"

import {LobbyDisplay} from "../lobby/types.js"

export abstract class Multiplayer {
	constructor(public lobbyDisplay: Signal<LobbyDisplay>) {}
	abstract dispose(): void
}

