
import {Map2} from "@benev/slate"

export class Profiler {
	topics = new Map2<string, {elapsed: number}>()
	memory = performance.now()

	constructor(public label: string) {
		this.start()
	}

	start() {
		this.memory = performance.now()
	}

	capture(topic: string) {
		const elapsed = performance.now() - this.memory
		const timing = this.topics.guarantee(topic, () => ({elapsed: 0}))
		timing.elapsed += elapsed
		this.start()
	}

	report() {
		const lines: string[] = []
		lines.push(`⌚ ${this.label}`)
		for (const [topic, timing] of this.topics)
			lines.push(` • ${timing.elapsed.toFixed(2)} ms ${topic}`)
		console.log(lines.join("\n"))
	}
}

