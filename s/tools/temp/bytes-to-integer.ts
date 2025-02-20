
export function bytesToInteger(bytes: Uint8Array) {
	const truncated = bytes.slice(0, 4)
	if (truncated.length < 4)
		throw new Error("need at least 4 bytes to derive 32 bit integer")
	const [integer] = new Uint32Array(truncated)
	return integer
}

