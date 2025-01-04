
import {Map2} from "@benev/slate"
import {Prop, Vec2} from "@benev/toolbox"

import {FloorSegment} from "../floors/types.js"
import {DungeonPlacer} from "../utils/placer.js"
import {Box2} from "../../../physics/shapes/box2.js"
import {Jug, Juggler} from "../../../../tools/juggler.js"
import {ZenGrid} from "../../../../tools/hash/zen-grid.js"
import {Cargo} from "../../../../tools/babylon/logistics/cargo.js"
import {Spatial} from "../../../../tools/babylon/logistics/types.js"
import {applySpatial} from "../../../../tools/babylon/logistics/apply-spatial.js"

class FloorJug implements Jug<Spatial> {
	instance: Prop

	constructor(public cargo: Cargo) {
		this.instance = cargo.instance()
		this.instance.setEnabled(false)
	}

	activate(spatial: Spatial) {
		applySpatial(this.instance, spatial)
		this.instance.setEnabled(true)
	}

	deactivate() {
		this.instance.setEnabled(false)
	}
}

class FloorSpec {
	constructor(public cargo: Cargo, public spatial: Spatial) {}
}

export class Flooring {
	#placer = new DungeonPlacer(1)
	#hashgrid = new ZenGrid<FloorSpec>(new Vec2(16, 16))
	#jugglers = new Map2<Cargo, Juggler<FloorJug>>()
	#deactivators = new Map2<Cargo, () => void>()

	establish(floor: FloorSegment) {
		const box = new Box2(floor.location, floor.size)
		const size = `${floor.size.x}x${floor.size.y}`
		const radians = floor.rotation
		const cargo = floor.style.floors.require(size)()
		const spatial = this.#placer.placeProp({location: floor.location, radians})
		const spec = new FloorSpec(cargo, spatial)
		this.#hashgrid.create(box, spec)
		this.#jugglers.guarantee(
			cargo,
			() => new Juggler(1_000, () => new FloorJug(cargo))
		)
	}

	renderArea(area: Box2) {
		const floorsInArea = new Set(this.#hashgrid.queryItems(area))
		this.#activate(floorsInArea)
		this.#pruneInactive(floorsInArea)
	}

	#activate(floorsInArea: Set<FloorSpec>) {
		for (const floor of floorsInArea) {
			const juggler = this.#jugglers.require(floor.cargo)
			const jug = juggler.acquire(floor.spatial)
			this.#deactivators.set(floor.cargo, () => juggler.release(jug))
		}
	}

	#pruneInactive(floorsInArea: Set<FloorSpec>) {
		const actives = new Map2<Cargo, FloorSpec>(
			[...floorsInArea].map(floor => [floor.cargo, floor])
		)
		for (const [cargo, deactivate] of this.#deactivators) {
			if (!actives.has(cargo))
				deactivate()
		}
	}
}

