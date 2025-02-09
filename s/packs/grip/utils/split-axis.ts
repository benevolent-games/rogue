
export function splitAxis(n: number) {
	return (n >= 0)
		? [0, n]
		: [Math.abs(n), 0]
}

