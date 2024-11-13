
import {ev} from "@benev/slate"

export function onChannelMessage(
		channel: RTCDataChannel,
		onmessage: (message: any) => void,
	) {
	return ev(channel, {
		onmessage: (event: MessageEvent) => onmessage(event.data),
	})
}

