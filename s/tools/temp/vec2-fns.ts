
import {Vec2} from "@benev/toolbox"

export const Vec2Fns = {

	asRotation(vector: Vec2) {
		return Math.atan2(vector.y, vector.x) - (Math.PI / 2)
	},
}

