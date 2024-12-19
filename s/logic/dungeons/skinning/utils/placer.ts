
import {Quat, Vec2, Vec3} from "@benev/toolbox"

import {Coordinates} from "../../../realm/utils/coordinates.js"
import {Spatial} from "../../../../tools/babylon/logistics/types.js"

export type Placement = {
	location: Vec2
	radians: number
}

/** Calculator for the positions, rotations, and scales of dungeon props */
export class DungeonPlacer {

	constructor(public mainScale: number) {}

	placeIndicator(location: Vec2, size: Vec2, verticalOffset: number) {
		const scale = size.clone().multiplyBy(this.mainScale)
		return {
			scale: Vec3.new(scale.x, scale.y, scale.y),
			position: Coordinates.import(location)
				.multiplyBy(this.mainScale)
				.add(scale.clone().divideBy(2))
				.position()
				.add_(0, verticalOffset, 0),
		}
	}

	placeProp(placement: Placement): Spatial {
		const scale = Vec2.all(this.mainScale)
		return {
			rotation: Quat.rotate_(0, placement.radians, 0),
			scale: Vec3.new(scale.x, scale.y, scale.y),
			position: Coordinates.import(placement.location)
				.multiplyBy(this.mainScale)
				.add(scale.clone().divideBy(2))
				.position()
		}
	}
}

