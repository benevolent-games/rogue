
import {signal} from "@benev/slate"
import {RunningAverage} from "@benev/toolbox"

export class GameStats {
	framerate = new TimingReport()
	ticksAhead = new ScalarReport()
	tick = new TimingReport()
	base = new TimingReport()
	prediction = new TimingReport()
	physics = new TimingReport()
}

export type TimingReports = Record<string, TimingReport | ScalarReport>

export class ScalarReport {
	#number = signal(0)
	#averager = new RunningAverage(60)

	get number() {
		return this.#number.value
	}

	set number(n: number) {
		this.#number.value = n
		this.#averager.add(n)
	}

	get average() {
		void this.#number.value
		return this.#averager.average
	}
}

export class TimingReport {
	#time = signal(0)
	#averager = new RunningAverage(60)

	get time() {
		return this.#time.value
	}

	set time(ms: number) {
		this.#time.value = ms
		this.#averager.add(ms)
	}

	get average() {
		void this.#time.value
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

