
import {loop, Randy, Vec2} from "@benev/toolbox"

import {Vecset2} from "./vecset2.js"
import {DrunkWalkOptions} from "./types.js"
import {cardinals} from "../../../tools/directions.js"

export function drunkWalkToHorizon(options: {randy: Randy} & DrunkWalkOptions) {
	const {randy} = options

	let current = new Vec2(0, 0)
	const steps = new Vecset2([current])
	const bannedDirection = Vec2.array(options.horizonDirection).multiplyBy(-1)

	for (const _ of loop(options.stepCount - 1)) {
		const neighbors = cardinals
			.filter(c => !c.equals(bannedDirection))
			.map(c => current.clone().add(c))
			.filter(c => !steps.has(c))
		current = randy.choose(neighbors)
		steps.add(current)
	}

	return steps.array()
}

