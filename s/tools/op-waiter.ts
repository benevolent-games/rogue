
import {OpSignal} from "@benev/slate"

export class OpWaiter<T> {
	#waiters: ((payload: T) => void)[] = []
	dispose: () => void

	constructor(public op: OpSignal<T>) {
		this.dispose = op.on(() => {
			const payload = op.payload
			if (payload !== undefined) {
				this.#waiters.forEach(waiter => waiter(payload))
				this.#waiters = []
			}
		})
	}

	get wait() {
		const payload = this.op.payload
		return (payload !== undefined)
			? payload
			: new Promise<T>(resolve => this.#waiters.push(resolve))
	}
}

