
import {Health} from "./health.js"
import {constants} from "../../../constants.js"
import {PhysShape} from "../../physics/parts/types.js"
import {ZenGrid} from "../../../tools/hash/zen-grid.js"

export class Mortal {
	health = new Health()
	constructor(public shape: PhysShape) {}
}

export class MortalRegistry extends ZenGrid<Mortal> {
	constructor() {
		super(constants.sim.hashgridExtent)
	}
}

