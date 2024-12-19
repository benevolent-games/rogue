
import {loop, Vec2} from "@benev/toolbox"

export function range(n: number) {
	return [...loop(n)]
}

export function range2d(vector: Vec2) {
	const vectors: Vec2[] = []
	for (const y of loop(vector.y)) {
		for (const x of loop(vector.x)) {
			vectors.push(new Vec2(x, y))
		}
	}
	return vectors
}

