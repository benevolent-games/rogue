
import { ev } from "@benev/slate"
import {PointerCaptor} from "./captor.js"

type Activity = {
	movement: number
	startTime: number
}

type Options = {
	predicate: (event: PointerEvent) => boolean
	onAnyDrag: (event: PointerEvent, activity: Activity) => void
	onAnyClick: (event: PointerEvent) => void
	onIntendedDrag: (event: PointerEvent, activity: Activity) => void
	onIntendedClick: (event: PointerEvent, activity: Activity) => void
}

/** differentiate clicks vs drags for pointerevents */
export class DragQueen {
	constructor(private options: Options) {}

	#activity: Activity | null = null
	#pointerCaptor = new PointerCaptor()

	get dragDetected() {
		if (this.#activity) {
			const {movement, startTime} = this.#activity
			const duration = Date.now() - startTime
			const movementThreshold = Math.max(10, 100 - (0.4 * (duration - 100)))
			const isSlow = duration > 100
			const isBigMovement = movement > movementThreshold
			return isSlow && isBigMovement
		}
		return false
	}

	#cancelActivity = () => {
		this.#activity = null
		this.#pointerCaptor.release()
	}

	events = {
		pointerdown: (event: PointerEvent) => {
			if (this.options.predicate(event)) {
				this.options.onAnyClick(event)
				this.#activity = {movement: 0, startTime: Date.now()}
				this.#pointerCaptor.capture(event)
			}
		},
		pointermove: (event: PointerEvent) => {
			if (this.#activity) {
				this.#activity.movement += Math.abs(event.movementX)
				this.#activity.movement += Math.abs(event.movementY)
				this.options.onAnyDrag(event, this.#activity)
				if (this.dragDetected)
					this.options.onIntendedDrag(event, this.#activity)
			}
		},
		pointerup: (event: PointerEvent) => {
			if (this.#activity && !this.dragDetected)
				this.options.onIntendedClick(event, this.#activity)
			this.#cancelActivity()
		},
		blur: this.#cancelActivity,
		pointerleave: this.#cancelActivity,
	}

	attach(element: HTMLElement) {
		const {events} = this
		return ev(element, {
			blur: events.blur,
			pointerup: events.pointerup,
			pointerdown: events.pointerdown,
			pointermove: events.pointermove,
			pointerleave: events.pointerleave,
		})
	}
}

