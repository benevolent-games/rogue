
import {JsonRpc} from "renraku"
import {Fiber} from "../../../tools/fiber.js"
import {Parcel} from "../../framework/relay/inbox-outbox.js"
import {GameMessage} from "../../framework/relay/messages.js"

export type MultiplayerFibers = ReturnType<typeof multiplayerFibers>

export function multiplayerFibers() {
	return {
		meta: new Fiber<JsonRpc.Bidirectional>(),
		game: new Fiber<Parcel<GameMessage>>(),
	}
}

