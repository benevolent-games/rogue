
import {Vecset2} from "./vecset2.js"
import {Degrees, loop, Vec2} from "@benev/toolbox"

const counterClockwise = [
	Degrees.toRadians(0),
	Degrees.toRadians(90),
	Degrees.toRadians(180),
	Degrees.toRadians(270),
]

/*
the pattern is as follows:
	b c -
	a @ -
	- - -

we can rotate this in 90 degree increments to repeat this check on every corner
*/
function investigateCorner(walkables: Vecset2, tile: Vec2, radians: number) {
	const a = tile.clone().add_(-1, 0).rotate(radians).round()
	const b = tile.clone().add_(-1, 1).rotate(radians).round()
	const c = tile.clone().add_(0, 1).rotate(radians).round()

	const isKissing = (
		!walkables.has(a) &&
		walkables.has(b) &&
		!walkables.has(c)
	)

	return {isKissing, a, b, c}
}

export function eliminateKissingCorners(walkables: Vecset2) {
	for (const _ of loop(100)) {
		let fixes = 0

		for (const tile of walkables.list()) {
			for (const radians of counterClockwise) {
				const corner = investigateCorner(walkables, tile, radians)
				if (corner.isKissing) {
					walkables.add(corner.a)
					fixes += 1
				}
			}
		}

		if (fixes === 0)
			break
	}
}

