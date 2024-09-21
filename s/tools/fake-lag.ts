
import {nap} from "@benev/slate"

export type LagFn = (fn: () => void) => void

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

export function fakeLag(profile: LagProfile): LagFn {
	const pipe: (() => void)[] = []

	const {ping, jitter, loss, smoothTime, spikeTime, spikeMultiplier} = profile

	const hrtt = ping / 2
	const hjitter = jitter / 2

	let mode: "smooth" | "spike" = "smooth"
	let multiplier = 1
	let modeStart = Date.now()
	let modeDuration = Math.random() * smoothTime

	function switchToSmooth() {
		mode = "smooth"
		multiplier = 1
		modeDuration = Math.random() * smoothTime
		modeStart = Date.now()
	}

	function switchToSpike() {
		mode = "spike"
		multiplier = (Math.random() * (spikeMultiplier - 1)) + 1
		modeDuration = Math.random() * spikeTime
		modeStart = Date.now()
	}

	return async fn => {
		pipe.push(fn)

		const modeElapsed = Date.now() - modeStart
		const timeToSwitchModes = modeElapsed > modeDuration

		if (timeToSwitchModes) {
			if (mode === "smooth") switchToSpike()
			else switchToSmooth()
		}

		const jitteroffset = hjitter * Math.random()
		const delay = multiplier * (hrtt + jitteroffset)

		await nap(delay)
		const fn2 = pipe.shift()

		const isLost = loss > 0 && (Math.random() < (multiplier * loss))

		if (!isLost)
			fn2?.()
	}
}

