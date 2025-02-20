
export function metersToFeetAndInches(meters: number) {
	const totalInches = meters * 39.3701
	let feet = Math.floor(totalInches / 12)
	let inches = Math.round(totalInches % 12)
	if (inches === 12) {
		feet += 1
		inches = 0
	}
	return {feet, inches}
}

