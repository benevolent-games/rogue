
import {ev, Map2} from "@benev/slate"

export function touchTracking({target, buttons, touchdown, touchup}: {
		target: Document | ShadowRoot
		buttons: Set<HTMLButtonElement>
		touchdown: (button: HTMLButtonElement) => void
		touchup: (button: HTMLButtonElement) => void
	}) {

	const tracks = new Map2<number, Track>

	function grabTrack(touch: Touch) {
		return tracks.guarantee(touch.identifier, () => new Track(
			touchdown,
			touchup,
		))
	}

	function underTouch(touch: Touch) {
		const element = target.elementFromPoint(touch.clientX, touch.clientY)
		return (element && element instanceof HTMLButtonElement && buttons.has(element))
			? element
			: undefined
	}

	function additive(event: TouchEvent) {
		for (const touch of Array.from(event.touches)) {
			const track = grabTrack(touch)
			track.button = underTouch(touch)
		}
	}

	function subtractive(event: TouchEvent) {
		for (const touch of Array.from(event.changedTouches)) {
			const track = grabTrack(touch)
			track.button = undefined
			tracks.delete(touch.identifier)
		}
	}

	return ev(window, {
		touchstart: additive,
		touchmove: additive,
		touchcancel: subtractive,
		touchend: subtractive,
	})
}

class Track {
	#button: HTMLButtonElement | undefined = undefined

	constructor(
		public touchdown: (button: HTMLButtonElement) => void,
		public touchup: (button: HTMLButtonElement) => void,
	) {}

	get button() {
		return this.#button
	}

	set button(next: HTMLButtonElement | undefined) {
		const previous = this.#button
		const changed = next !== previous

		this.#button = next

		if (changed && previous) {
			this.touchup(previous)
		}
		if (changed && next)
			this.touchdown(next)
	}
}

