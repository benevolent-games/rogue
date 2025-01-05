
import {Map2} from "@benev/slate"
import {Vec2} from "@benev/toolbox"

import {FloorSegment} from "../floors/types.js"
import {DungeonPlacer} from "../utils/placer.js"
import {Box2} from "../../../physics/shapes/box2.js"
import {ZenGrid} from "../../../../tools/hash/zen-grid.js"
import {Crate} from "../../../../tools/babylon/logistics/crate.js"
import {Spatial} from "../../../../tools/babylon/logistics/types.js"
import {Lifeguard} from "../../../../tools/babylon/optimizers/lifeguard.js"
import {applySpatial} from "../../../../tools/babylon/logistics/apply-spatial.js"

class FloorSpec {
	constructor(public crate: Crate, public spatial: Spatial) {}
}

export class Flooring {
	#placer = new DungeonPlacer(1)
	#hashgrid = new ZenGrid<FloorSpec>(new Vec2(16, 16))
	#releasers = new Map2<FloorSpec, () => void>()

	constructor(public lifeguard: Lifeguard, floors: FloorSegment[]) {
		for (const segment of floors) {
			const box = new Box2(segment.location, segment.size)
			const size = `${segment.size.x}x${segment.size.y}`
			const radians = segment.rotation
			const crate = segment.style.floors.require(size)()
			const spatial = this.#placer.placeProp({location: segment.location, radians})
			const floorSpec = new FloorSpec(crate, spatial)
			this.#hashgrid.create(box, floorSpec)
		}
	}

	renderArea(area: Box2) {
		const floors = new Set(this.#hashgrid.queryItems(area))
		this.#spawning(floors)
		this.#despawning(floors)
	}

	#spawning(floors: Set<FloorSpec>) {
		for (const floor of floors) {
			if (!this.#releasers.has(floor)) {
				const [prop, release] = this.lifeguard.spawn(floor.crate)
				applySpatial(prop, floor.spatial)
				this.#releasers.set(floor, release)
			}
		}
	}

	#despawning(floors: Set<FloorSpec>) {
		for (const [floor, release] of this.#releasers) {
			if (!floors.has(floor)) {
				release()
				this.#releasers.delete(floor)
			}
		}
	}
}

