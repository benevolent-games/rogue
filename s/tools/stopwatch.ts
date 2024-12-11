
export class Stopwatch {
	static clock(label: string, fn: () => void) {
		const stopwatch = new this(label)
		stopwatch.measure(fn)
		stopwatch.log()
	}

	elapsed = 0
	constructor(public label = "time") {}

	measure<T>(fn: () => T) {
		const start = performance.now()
		const result = fn()
		const time = performance.now() - start
		this.elapsed += time
		return result
	}

	log() {
		console.log(`${this.label}: ${this.elapsed.toFixed(2)} ms`)
	}
}

