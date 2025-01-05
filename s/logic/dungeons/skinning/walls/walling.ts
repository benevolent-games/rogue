
import {Map2} from "@benev/slate"
import {Prop, Vec2} from "@benev/toolbox"
import {WallSegment} from "./types.js"
import {WallPlan} from "./plan-walls.js"
import {DungeonStyle} from "../style.js"
import {DungeonPlacer} from "../utils/placer.js"
import {Box2} from "../../../physics/shapes/box2.js"
import {GlobalTileVec2} from "../../layouting/space.js"
import {ZenGrid} from "../../../../tools/hash/zen-grid.js"
import {Crate} from "../../../../tools/babylon/logistics/crate.js"
import {Cargo} from "../../../../tools/babylon/logistics/cargo.js"
import {Spatial} from "../../../../tools/babylon/logistics/types.js"
import {Lifeguard} from "../../../../tools/babylon/optimizers/lifeguard.js"
import {applySpatial} from "../../../../tools/babylon/logistics/apply-spatial.js"

class WallSpec {
	targetOpacity = 1
	currentOpacity = 1
	constructor(public crate: Crate, public spatial: Spatial) {}
}

class WallAlive {
	constructor(
		public spec: WallSpec,
		public prop: Prop,
		public release: () => void,
	) {}
}

export class Walling {
	#placer = new DungeonPlacer(1)
	#hashgrid = new ZenGrid<WallSpec>(new Vec2(16, 16))
	#alive = new Map2<WallSpec, WallAlive>()

	constructor(
			public lifeguard: Lifeguard,
			plan: WallPlan,
			getWallStyle: (tile: GlobalTileVec2) => DungeonStyle,
		) {

		const make = (wall: WallSegment, getCargo: (style: DungeonStyle) => Cargo) => {
			const style = getWallStyle(wall.tile)
			const cargo = getCargo(style)
			const spatial = this.#placer.placeProp(wall)
			const wallSpec = new WallSpec(cargo, spatial)

			// TODO actually form a real box around the wall?
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

	renderArea(area: Box2) {
		const walls = new Set(this.#hashgrid.queryItems(area))
		this.#spawning(walls)
		this.#despawning(walls)
	}

	#spawning(walls: Set<WallSpec>) {
		for (const wall of walls) {
			if (!this.#alive.has(wall)) {
				const [prop, release] = this.lifeguard.spawn(wall.crate, false)
				applySpatial(prop, wall.spatial)
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
}

