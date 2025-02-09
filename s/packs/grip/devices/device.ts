
import {pubsub} from "@benev/slate"

export abstract class GripDevice {
	abstract dispose: () => void
	onInput = pubsub<[string, number]>()
	poll() {}
}

