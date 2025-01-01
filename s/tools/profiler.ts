
import {Map2} from "@benev/slate"

export class Profiler {
	constructor(public label: string) {}

	topics = new Map2<string, {elapsed: number}>()

	measure(topic: string) {
		const start = performance.now()
		return () => {
			const elapsed = performance.now() - start
			this.topics
				.guarantee(topic, () => ({elapsed: 0}))
				.elapsed += elapsed
		}
	}

	report() {
		const lines: string[] = []
		lines.push(`⌚ ${this.label}`)
		for (const [topic, timing] of this.topics)
			lines.push(` • ${timing.elapsed.toFixed(2)}ms ${topic}`)
		console.log(lines.join("\n"))
	}
}

