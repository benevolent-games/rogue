
import {Map2} from "@benev/slate"
import {InputShell} from "./types.js"

export class InputHistory {
	history = new Map2<number, InputShell<any>[]>

	add(tick: number, inputs: InputShell<any>[]) {
		const historical = this.history.guarantee(tick, () => [])
		historical.push(...inputs)
		this.cullHistoryOlderThan(tick - 100)
	}

	cullHistoryOlderThan(oldest: number) {
		const {history} = this
		const tooOld = [...history.keys()].filter(tick => tick < oldest)
		for (const old of tooOld)
			history.delete(old)
	}
}

