
import {nap} from "@benev/slate"

export type LagProfile = {
	/** round-trip-time in milliseconds */
	ping: number

	/** maximum amount of random jitter added */
	jitter: number

	/** droprate 0 to 1 */
	loss: number

	/** how long might the connection stay smooth */
	smoothTime: number

	/** how long might the connection have a terrible lagspike */
	spikeTime: number

	/** how terrible is a lagspike */
	spikeMultiplier: number
}

export function fakeLag({
		ping, jitter, loss, smoothTime, spikeTime, spikeMultiplier,
	}: LagProfile) {

	const hrtt = ping / 2
	const hjitter = jitter / 2

	let mode: "smooth" | "spike" = "smooth"
	let multiplier = 1
	let modeStart = Date.now()
	let modeDuration = Math.random() * smoothTime

	function switchToSmooth() {
		modeDuration = Math.random() * smoothTime
		mode = "smooth"
		multiplier = 1
		modeStart = Date.now()
	}

	function switchToSpike() {
		modeDuration = Math.random() * spikeTime
		mode = "spike"
		multiplier = spikeMultiplier
		modeStart = Date.now()
		modeDuration = Math.random() * spikeTime
	}

	return async(fn: () => void) => {
		if (Math.random() < (multiplier * loss)) {
			return undefined
		}

		const modeElapsed = Date.now() - modeStart
		const timeToSwitchModes = modeElapsed > modeDuration

		if (timeToSwitchModes) {
			if (mode === "smooth") switchToSpike()
			else switchToSmooth()
		}

		const jitteroffset = hjitter * Math.random()
		const delay = multiplier * (hrtt + jitteroffset)

		await nap(delay)
		fn()
	}
}

