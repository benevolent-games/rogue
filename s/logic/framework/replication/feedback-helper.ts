
import {SpecificFeedback} from "./types.js"

export class FeedbackHelper {
	#data: any
	#memos: any[] = []

	get data() {
		return this.#data
	}

	set data(data: any) {
		this.#data = data
	}

	memo(memo: any) {
		this.#memos.push(memo)
	}

	extract(): SpecificFeedback {
		const memos = this.#memos
		this.#memos = []
		return {memos, data: this.#data}
	}
}

