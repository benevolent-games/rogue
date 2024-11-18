
import {Signal} from "@benev/slate"
import {Lobby} from "../lobby/manager.js"

export abstract class Multiplayer {
	constructor(public lobby: Signal<Lobby>) {}
	abstract dispose(): void
}

