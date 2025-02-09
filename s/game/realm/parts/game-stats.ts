
import {RunningAverage} from "@benev/toolbox"

export class GameStats {
	framerate = new TimingReport()
	ticksAhead = new ScalarReport()
	tick = new TimingReport()
	base = new TimingReport()
	prediction = new TimingReport()
	physics = new TimingReport()
	physicsAwake = new ScalarReport()
}

export type TimingReports = Record<string, TimingReport | ScalarReport>

export class ScalarReport {
	#number = 0
	#averager = new RunningAverage(60)

	get number() {
		return this.#number
	}

	set number(n: number) {
		this.#number = n
		this.#averager.add(n)
	}

	get average() {
		return this.#averager.average
	}
}

export class TimingReport {
	#time = 0
	#averager = new RunningAverage(60)

	get time() {
		return this.#time
	}

	set time(ms: number) {
		this.#time = ms
		this.#averager.add(ms)
	}

	get average() {
		return this.#averager.average
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

