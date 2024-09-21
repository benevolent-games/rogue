
export function randomize(x: number) {
	const half = x / 2
	return half + (2 * half * Math.random())
}

