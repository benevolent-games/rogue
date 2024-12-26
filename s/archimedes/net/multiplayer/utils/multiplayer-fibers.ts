
import {JsonRpc} from "renraku"
import {Fiber} from "../../relay/fiber.js"
import {Parcel} from "../../relay/inbox-outbox.js"
import {GameMessage} from "../../relay/messages.js"

export type MultiplayerFibers = ReturnType<typeof multiplayerFibers>

export function multiplayerFibers() {
	return {
		meta: new Fiber<JsonRpc.Bidirectional>(),
		game: new Fiber<Parcel<GameMessage>>(),
	}
}

