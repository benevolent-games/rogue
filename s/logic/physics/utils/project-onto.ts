
import {Vec2} from "@benev/toolbox"

export function projectOnto(source: Vec2, target: Vec2) {
	const targetMagnitudeSquared = target.magnitudeSquared()

	if (targetMagnitudeSquared === 0)
		return new Vec2(0, 0)

	const dotProduct = source.dot(target)
	const scalarProjection = dotProduct / targetMagnitudeSquared

	return target.clone().multiplyBy(scalarProjection)
}

