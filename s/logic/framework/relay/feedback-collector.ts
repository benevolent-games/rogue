
import {Feedback} from "./types.js"
import {FeedbackEvent} from "../types.js"

export class FeedbackCollector {
	#feedback: FeedbackEvent.Any[] = []

	record = (event: FeedbackEvent.Any) => {
		this.#feedback.push(event)
	}

	take(): Feedback {
		const feedback = this.#feedback
		this.#feedback = []

		return {
			datas: feedback
				.filter(event => event.kind === "data")
				.map(event => [event.entityId, event.data]),

			memos: feedback
				.filter(event => event.kind === "memo")
				.map(event => [event.entityId, event.memo]),
		}
	}
}

