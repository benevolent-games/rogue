
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
		this.instance.unfreezeWorldMatrix()
		applySpatial(this.instance, spatial)
		this.instance.freezeWorldMatrix()
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
	#releasers = new Map2<FloorSpec, () => void>()

	get report() {
		const lines: string[] = [`flooring juggler report`]
		for (const [cargo, juggler] of this.#jugglers) {
			lines.push(` - ${juggler.size} ${cargo.manifest.get("size")}`)
		}
		return lines.join("\n")
	}

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
		this.#spawning(floorsInArea)
		this.#despawning(floorsInArea)
	}

	#spawning(floorsInArea: Set<FloorSpec>) {
		for (const floor of floorsInArea) {
			if (!this.#releasers.has(floor)) {
				const juggler = this.#jugglers.require(floor.cargo)
				const jug = juggler.acquire(floor.spatial)
				this.#releasers.set(floor, () => juggler.release(jug))
			}
		}
	}

	#despawning(floorsInArea: Set<FloorSpec>) {
		for (const [floor, release] of this.#releasers) {
			if (!floorsInArea.has(floor)) {
				release()
				this.#releasers.delete(floor)
			}
		}
	}
}

