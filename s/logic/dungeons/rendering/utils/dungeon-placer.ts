
import {Degrees, Quat, Randy, Vec2, Vec3} from "@benev/toolbox"
import {Coordinates} from "../../../realm/utils/coordinates.js"

/** Calculator for the positions, rotaitons, and scales of dungeon props */
export class DungeonPlacer {
	randy = Randy.seed(1)

	constructor(public mainScale: number) {}

	placeIndicator(location: Vec2, rawScale: Vec2, verticalOffset: number) {
		const scale = rawScale.clone().multiplyBy(this.mainScale)
		return {
			scale: Vec3.new(scale.x, scale.y, scale.y),
			position: Coordinates.import(location)
				.multiplyBy(this.mainScale)
				.add(scale.divideBy(2))
				.position()
				.add_(0, verticalOffset, 0),
		}
	}

	placeFloor(location: Vec2) {
		const scale = new Vec2(this.mainScale, this.mainScale)
		const degrees = this.randy.choose([0, -90, 90, 180])
		return {
			rotation: Quat.rotate_(Degrees.toRadians(degrees), 0, 0),
			scale: Vec3.new(scale.x, scale.y, scale.y),
			position: Coordinates.import(location)
				.multiplyBy(this.mainScale)
				.add(scale.divideBy(2))
				.position()
		}
	}
}

