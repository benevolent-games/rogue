
import {Map2} from "@benev/slate"
import {InputShell} from "./types.js"

export class InputHistory {
	history = new Map2<number, InputShell<any>[]>

	add(tick: number, input: InputShell<any>) {
		const inputs = this.history.guarantee(tick, () => [])
		inputs.push(input)
		this.cullHistoryOlderThan(tick - 60)
	}

	cullHistoryOlderThan(oldest: number) {
		const {history} = this
		const tooOld = [...history.keys()].filter(tick => tick < oldest)
		for (const old of tooOld)
			history.delete(old)
	}
}

