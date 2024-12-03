
import {Vec2} from "@benev/toolbox"
import {Hashgrid} from "./facilities/hashgrid.js"

export class Physics {
	unwalkableHashgrid = new Hashgrid(16)

	/** returns false if the circle overlaps any unwalkable tiles */
	isWalkable(point: Vec2, radius: number) {
		// TODO
	}
}

