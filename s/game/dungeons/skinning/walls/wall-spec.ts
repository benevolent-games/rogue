
import {WallSegment} from "./types.js"
import {Cargo} from "../../../../tools/babylon/logistics/cargo.js"
import {Spatial} from "../../../../tools/babylon/logistics/types.js"

export class WallSpec {
	targetOpacity = 1
	currentOpacity = 1

	constructor(
		public cargo: Cargo,
		public spatial: Spatial,
		public segment: WallSegment,
	) {}
}

