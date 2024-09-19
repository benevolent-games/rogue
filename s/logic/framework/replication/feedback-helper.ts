
import {Archetype} from "../types.js"
import {SpecificFeedback} from "./types.js"

export class FeedbackHelper<Ar extends Archetype> {
	#data: Ar["data"]
	#memos: Ar["memo"][] = []

	constructor(data: Ar["data"]) {
		this.#data = data
	}

	get data() {
		return this.#data
	}

	set data(data: Ar["data"]) {
		this.#data = data
	}

	memo(memo: any) {
		this.#memos.push(memo)
	}

	extract(): SpecificFeedback<Ar> {
		const memos = this.#memos
		this.#memos = []
		return {memos, data: this.#data}
	}
}

