
import {signal} from "@benev/slate"

export type TimingReports = Record<string, TimingReport>

export class TimingReport {
	#time = signal(0)

	get time() {
		return this.#time.value
	}

	set time(ms: number) {
		this.#time.value = ms
	}

	reset() {
		this.time = 0
		return this
	}

	addTime(ms: number) {
		this.time += ms
		return this
	}

	measure() {
		const start = performance.now()
		return () => this.addTime(performance.now() - start)
	}
}

export class GameStats<T extends TimingReports> {
	constructor(public timing: T) {}

	resetAllTiming() {
		for (const report of Object.values(this.timing))
			report.reset()
	}
}

