
import {Vec2} from "@benev/toolbox"

export function rotation(vector: Vec2) {
	return Math.atan2(vector.y, vector.x)
}

