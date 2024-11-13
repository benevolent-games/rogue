
import {ev} from "@benev/slate"

export function onChannelMessage<M>(
		channel: RTCDataChannel,
		onmessage: (message: M) => void,
	) {
	return ev(channel, {
		onmessage: (event: MessageEvent) => onmessage(
			JSON.parse(event.data)
		),
	})
}

