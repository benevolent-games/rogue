
import {Map2} from "@benev/slate"
import {Vec2} from "@benev/toolbox"

import {Placement} from "../types.js"
import {Box3} from "../../../physics/shapes/box.js"
import {Crate} from "../../../../tools/babylon/logistics/crate.js"

export type WallPlan = {
	homeTile: Vec2
	facing: number
	boundingBox: Box3
	placement: Placement
}

export class WallSpawner {
	constructor(
			public wallCratesBySize: Map2<number, Crate>,
			wallPlans: Set<WallPlan>,
		) {

		for (const wallPlan of [...wallPlans]) {
		}
	}
}

