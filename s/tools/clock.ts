
export class Clock {
	start = performance.now()

	get elapsed() {
		return performance.now() - this.start
	}

	log(label: string) {
		console.log(`🕒 ${label} - ${this.elapsed.toFixed(2)} ms`)
	}
}

