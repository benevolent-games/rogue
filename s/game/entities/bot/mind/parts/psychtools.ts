
export function weight(importance: number, factor: number) {
	return [importance, factor] as [number, number]
}

export function average(...elements: [number, number][]) {
	let sum = 0
	let weight = 0

	for (const [importance, factor] of elements) {
		sum += importance * factor
		weight += importance
	}

	if (weight === 0)
		return 0

	return sum / weight
}

export function geometric(...elements: [number, number][]) {
	let product = 1
	let totalWeight = 0

	for (const [importance, factor] of elements) {
		product *= Math.pow(factor, importance)
		totalWeight += importance
	}

	return Math.pow(product, 1 / totalWeight)
}

export function inverse(factor: number) {
	return 1 - factor
}

