
export class Clock {
	start = performance.now()

	get elapsed() {
		return performance.now() - this.start
	}

	log(label: string) {
		console.log(`🕒 ${label} - ${this.elapsed.toFixed(2)} ms`)
	}
}

export class Stopwatch {
	start = performance.now()

	log(label: string) {
		const now = performance.now()
		const time = now - this.start
		this.start = now
		console.log(`🕒 ${label} - ${time.toFixed(2)} ms`)
	}
}

