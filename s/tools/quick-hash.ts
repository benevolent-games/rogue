
export function quickHash(subject: string) {
	let hash = 5381
	for (let i = 0; i < subject.length; i++)
		hash = (hash * 33) ^ subject.charCodeAt(i)
	return hash >>> 0
}

