
export function collisionResponseFactors(massA: number, massB: number): [number, number] {
	const massTotal = massA + massB

	if (massA === Infinity && massB === Infinity)
		return [0, 0]

	if (massTotal === 0)
		return [0.5, 0.5]

	return [
		(massB === Infinity) ? 1 : massB / massTotal,
		(massA === Infinity) ? 1 : massA / massTotal,
	]
}

