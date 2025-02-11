
export function byteMatch(
		bytes: Uint8Array,
		{start, end}: {start?: Uint8Array, end?: Uint8Array},
	) {
	if (start && compareBytes(bytes, start) < 0) return false
	if (end && compareBytes(bytes, end) >= 0) return false
	return true
}

function compareBytes(a: Uint8Array, b: Uint8Array): number {
	const minLength = Math.min(a.length, b.length)
	for (let i = 0; i < minLength; i++)
		if (a[i] !== b[i]) return a[i] - b[i]
	return a.length - b.length
}

