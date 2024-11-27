
import {Vec2} from "@benev/toolbox"

export type DistanceAlgo = "manhattan" | "euclidean" | "chebyshev"

export function distance(a: Vec2, b: Vec2, algo: DistanceAlgo = "euclidean") {
	switch (algo) {

		case "euclidean":
			return euclideanDistance(a, b)

		case "manhattan":
			return manhattanDistance(a, b)

		case "chebyshev":
			return chebyshevDistance(a, b)
	}
}

export function manhattanDistance(a: Vec2, b: Vec2) {
	return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

export function euclideanDistance(a: Vec2, b: Vec2) {
	return a.distance(b)
}

export function chebyshevDistance(a: Vec2, b: Vec2) {
	return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y))
}
