
import {Vec2} from "@benev/toolbox"
import {Vecset2} from "../../utils/vecset2.js"

export function isConcave(location: Vec2, corner: [Vec2, Vec2, Vec2], walkables: Vecset2) {
	return corner
		.map(c => location.clone().add(c))
		.every(c => !walkables.has(c))
}

export function isConvex(location: Vec2, corner: [Vec2, Vec2, Vec2], walkables: Vecset2) {
	const [left, middle, right] = corner
		.map(c => location.clone().add(c))
	return (
		walkables.has(left) &&
		walkables.has(middle) &&
		walkables.has(right)
	)
}

