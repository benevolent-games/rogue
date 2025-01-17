
import {Cause} from "./cause.js"

export type InputStyle = "eager" | "tap" | "hold"

export class InputInterpreter {

	/** number of milliseconds that distinguishes a tap from a hold */
	threshold = 250

	/** this cause receives raw input */
	eager = new Cause()

	/** this cause only reacts to taps */
	tap = new Cause()

	/** this cause only reacts to holds */
	hold = new Cause()

	#holdStartTime: number | null = null

	constructor(public style: InputStyle) {}

	/** the cause associated with the configured input style */
	get canonical() {
		return (
			this.style === "tap"?
				this.tap:
			this.style === "hold"?
				this.hold:
				this.eager
		)
	}

	set(input: number, pressed: boolean) {
		this.eager.input.value = input
		this.eager.pressed.value = pressed

		if (this.#freshlyPressed())
			this.#startHoldTimer()

		if (this.#freshlyReleased()) {
			if (!this.#isHeld())
				this.#reportTap()

			this.#stopHoldTimer()
		}

		if (this.#isHeld())
			this.#reportHeld()
		else
			this.#reportNotHeld()
	}

	#startHoldTimer() {
		this.#holdStartTime = Date.now()
	}

	#stopHoldTimer() {
		this.#holdStartTime = null
	}

	#freshlyPressed() {
		return this.eager.pressed.changed && this.eager.pressed.value
	}

	#freshlyReleased() {
		return this.eager.pressed.changed && !this.eager.pressed.value
	}

	#isHeld() {
		return this.#holdStartTime !== null
			? (Date.now() - this.#holdStartTime) >= this.threshold
			: false
	}

	#reportTap() {

		// button down
		this.tap.input.value = 1
		this.tap.pressed.value = true

		// button up
		this.tap.input.value = 0
		this.tap.pressed.value = false
	}

	#reportHeld() {
		this.hold.input.value = this.eager.input.value
		this.hold.pressed.value = this.eager.pressed.value
	}

	#reportNotHeld() {
		this.hold.input.value = 0
		this.hold.pressed.value = false
	}
}

