
export class Prioritizer<P> {
	set = new Set<P>()
	sorted: P[] = []

	constructor(
		public measure: (priority: P) => number,
		public onChange: () => void = () => {},
	) {}

	sort() {
		this.sorted = [...this.set]
			.sort((a, b) => this.measure(a) - this.measure(b))
		this.onChange()
		return this
	}

	add(...priorities: P[]) {
		for (const priority of priorities)
			this.set.add(priority)
		this.sort()
		return this
	}

	delete(...priorities: P[]) {
		for (const priority of priorities)
			this.set.delete(priority)
		this.sort()
		return this
	}

	getPriorityIndex(priority: P) {
		const index = this.sorted.indexOf(priority)
		if (index === -1)
			throw new Error("priority not found")
		return index
	}
}

