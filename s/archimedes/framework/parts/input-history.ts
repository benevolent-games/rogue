
import {Map2} from "@benev/slate"
import {Input} from "./types.js"

export class InputHistory {
	history = new Map2<number, Input[]>

	add(tick: number, input: Input) {
		const inputs = this.history.guarantee(tick, () => [])
		inputs.push(input)
	}
}

