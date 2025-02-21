
import {Map2} from "@benev/slate"
import {Scalar, Vec2} from "@benev/toolbox"

import {WallSegment} from "./types.js"
import {WallSpec} from "./wall-spec.js"
import {WallPlan} from "./plan-walls.js"
import {DungeonStyle} from "../style.js"
import {WallAlive} from "./wall-alive.js"
import {Realm} from "../../../realm/realm.js"
import {WallDetector} from "./wall-detector.js"
import {DungeonPlacer} from "../utils/placer.js"
import {constants} from "../../../../constants.js"
import {Box2} from "../../../physics/shapes/box2.js"
import {GlobalTileVec2} from "../../layouting/space.js"
import {ZenGrid} from "../../../../tools/hash/zen-grid.js"
import {Cargo} from "../../../../tools/babylon/logistics/cargo.js"
import {Lifeguard} from "../../../../tools/babylon/optimizers/lifeguard.js"
import {applySpatial} from "../../../../tools/babylon/logistics/apply-spatial.js"
import { Material } from "@babylonjs/core/Materials/material.js"

export class Walling {
	#placer = new DungeonPlacer(1)
	#hashgrid = new ZenGrid<WallSpec>(constants.sim.hashgridExtent)
	#alive = new Map2<WallSpec, WallAlive>()

	#detector: WallDetector

	fadeSpeed = 3

	constructor(
			realm: Realm,
			public lifeguard: Lifeguard,
			plan: WallPlan,
			getWallStyle: (tile: GlobalTileVec2) => DungeonStyle,
		) {

		this.#detector = new WallDetector(realm)

		const make = (wall: WallSegment, getCargo: (style: DungeonStyle) => Cargo) => {
			const style = getWallStyle(wall.tile)
			const cargo = getCargo(style)
			const spatial = this.#placer.placeProp(wall)
			const wallSpec = new WallSpec(cargo, spatial, wall)
			const box = new Box2(wall.location, Vec2.all(1))
			this.#hashgrid.create(box, wallSpec)
		}

		for (const wall of plan.wallSegments)
			make(wall, style => style.walls.require(wall.size)())

		for (const concave of plan.concaves)
			make(concave, style => style.concave())

		for (const convex of plan.convexes)
			make(convex, style => style.convex())

		for (const stump of plan.stumps)
			make(stump, style => style.stump())
	}

	renderArea(seconds: number, area: Box2) {
		const walls = new Set(this.#hashgrid.queryItems(area))
		this.#spawning(walls)
		this.#despawning(walls)
		this.#fading(seconds)
	}

	#spawning(walls: Set<WallSpec>) {
		for (const wall of walls) {
			if (!this.#alive.has(wall)) {
				const [prop, release] = this.lifeguard.spawn(wall.cargo, false)
				prop.unfreezeWorldMatrix()
				applySpatial(prop, wall.spatial)
				prop.freezeWorldMatrix()
				this.#alive.set(wall, new WallAlive(
					wall,
					prop,
					release,
				))
			}
		}
	}

	#despawning(walls: Set<WallSpec>) {
		for (const wall of this.#alive.values()) {
			if (!walls.has(wall.spec)) {
				wall.release()
				this.#alive.delete(wall.spec)
			}
		}
	}

	#fading(seconds: number) {
		for (const {spec, meshes} of this.#alive.values()) {

			// determine target opacity
			spec.targetOpacity = this.#detector.detect(spec)
				? 0.2
				: 1

			// animate fading
			const previous = spec.currentOpacity
			if (spec.currentOpacity !== spec.targetOpacity) {
				spec.currentOpacity = Scalar.approach(
					spec.currentOpacity,
					spec.targetOpacity,
					this.fadeSpeed,
					seconds,
				)
				const diff = Math.abs(spec.targetOpacity - spec.currentOpacity)
				if (diff < 0.05)
					spec.currentOpacity = spec.targetOpacity
				if (spec.currentOpacity !== previous) {
					for (const mesh of meshes) {

						// ensure the material uses alpha blending
						if (mesh.material && mesh.material.transparencyMode !== Material.MATERIAL_ALPHABLEND)
							mesh.material.transparencyMode = Material.MATERIAL_ALPHABLEND

						// set the visibility
						mesh.visibility = spec.currentOpacity
					}
				}
			}
		}
	}
}

