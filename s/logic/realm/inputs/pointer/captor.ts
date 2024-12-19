
export class PointerCaptor {
	#memory: undefined | {
		pointerId: number
		element: HTMLElement
	}

	capture(event: PointerEvent) {
		const element = event.currentTarget as HTMLElement
		const {pointerId} = event
		element.setPointerCapture(pointerId)
		this.#memory = {
			pointerId,
			element,
		}
	}

	release() {
		if (this.#memory) {
			const {element, pointerId} = this.#memory
			element.releasePointerCapture(pointerId)
		}
		this.#memory = undefined
	}
}

