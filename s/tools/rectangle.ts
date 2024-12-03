
import {loop2d, Randy, Vec2} from "@benev/toolbox"

export class Rectangle {
	offset = Vec2.zero()
	constructor(public size: Vec2) {}

	center(target: Vec2) {
		const halfSize = this.size.clone().divideBy(2).round()
		this.offset.set(target).subtract(halfSize)
		return this
	}

	moveRandomlyOnto(randy: Randy, target: Vec2) {
		const randomPointInRect = Vec2.new(
			randy.integerRange(0, this.size.x - 1),
			randy.integerRange(0, this.size.y - 1),
		)
		this.offset.set(target.clone().subtract(randomPointInRect))
		return this
	}

	get tiles() {
		return [...loop2d(this.size.array())]
			.map(vecArray => Vec2.from(vecArray).add(this.offset))
	}
}

