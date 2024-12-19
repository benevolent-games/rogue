
import {Map2} from "@benev/slate"
import {Degrees, Randy, Vec2, Vec2Array} from "@benev/toolbox"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {DungeonStyle} from "./style.js"
import {DungeonAssets} from "./assets.js"
import {Realm} from "../../realm/realm.js"
import {DungeonLayout} from "../layout.js"
import {WallSegment} from "./walls/types.js"
import {range2d} from "../../../tools/range.js"
import {planWalls} from "./walls/plan-walls.js"
import {HashSet} from "../../../tools/hash/set.js"
import {DungeonPlacer} from "../rendering/placer.js"
import {Culler} from "../rendering/culling/culler.js"
import {WallFader} from "../rendering/walls/wall-fader.js"
import {WallSubject} from "../rendering/walls/wall-subject.js"
import {Cargo} from "../../../tools/babylon/logistics/cargo.js"
import {SubjectGrid} from "../rendering/culling/subject-grid.js"
import {randyShuffle} from "../../../tools/temp/randy-shuffle.js"
import {GlobalTileVec2, LocalCellVec2} from "../layouting/space.js"
import {CullingSubject} from "../rendering/culling/culling-subject.js"

export class DungeonSkin {
	randy: Randy
	placer: DungeonPlacer

	assets: DungeonAssets
	styleKeyByCell = new Map2<LocalCellVec2, string>()

	cullableGrid = new SubjectGrid()
	fadingGrid = new SubjectGrid<WallSubject>()

	culler = new Culler(this.cullableGrid)
	wallFader = new WallFader(this.fadingGrid)

	constructor(
			public layout: DungeonLayout,
			public container: AssetContainer,
			public realm: Realm,
			public mainScale: number,
		) {

		this.randy = new Randy(layout.options.seed)
		this.assets = new DungeonAssets(container, this.randy)
		this.placer = new DungeonPlacer(mainScale)

		const styles = [...this.assets.styles.keys()]

		for (const cell of this.layout.cells)
			this.styleKeyByCell.set(cell, this.randy.choose(styles))

		this.#createFlooring()
		this.#createWalls()
	}

	#getStyle = (tile: GlobalTileVec2) => {
		const {cell} = this.layout.lookupTile(tile)
		const key = this.styleKeyByCell.require(cell)
		return this.assets.styles.require(key)
	}

	#createFlooring() {
		type FloorSegment = {
			tile: Vec2
			size: Vec2
			location: Vec2
			style: DungeonStyle
		}

		const size1 = new Vec2(1, 1)

		const floorPlan = new HashSet<FloorSegment>(
			({style, size, tile}) => [
				style.name,
				size.x,
				size.y,
				tile.x,
				tile.y,
			].join(","),
			randyShuffle(this.randy, this.layout.floorTiles.array().map(tile => ({
				tile,
				size: size1,
				location: tile.clone(),
				style: this.#getStyle(tile),
			}))),
		)

		for (const floor of floorPlan.values()) {
			if (!floor.size.equals(size1))
				continue

			const sizes = [...floor.style.floors.keys()]
				.map(string => Vec2.from(string.split("x").map(x => parseInt(x)) as Vec2Array))
				.sort((a, b) => (b.x * b.y) - (a.x * a.y))

			for (const size of sizes) {
				if (size.equals(size1))
					continue

				const area = size.x * size.y
				const boxTiles = range2d(size)
					.map(vector => ({
						tile: floor.tile.clone().add(vector),
						size: size1,
						style: floor.style,
						location: floor.location.clone().add(vector),
					}))
					.filter(tile2 => floorPlan.has(tile2))
				const wholeBoxIsIntact = boxTiles.length === area

				if (wholeBoxIsIntact) {
					floorPlan.delete(...boxTiles)
					floorPlan.add({
						tile: floor.tile,
						size,
						style: floor.style,
						location: Vec2.zero()
							.add(...boxTiles.map(t => t.location))
							.divideBy(boxTiles.length),
					})
				}
			}
		}

		for (const floor of floorPlan.values()) {
			const size = `${floor.size.x}x${floor.size.y}`
			const cargo = floor.style.floors.require(size)()
			const isSquare = floor.size.x === floor.size.y
			const radians = (isSquare && !cargo.manifest.has("shader"))
				? Degrees.toRadians(this.randy.choose([0, -90, -180, -270]))
				: 0
			const spatial = this.placer.placeProp({location: floor.location, radians})
			const spawn = () => cargo.instance(spatial)
			const subject = new CullingSubject(floor.location, spawn)
			this.cullableGrid.add(subject)
		}
	}

	#createWalls() {
		const plan = planWalls(
			this.randy,
			this.layout.wallTiles,
			this.layout.floorTiles,
			this.#getStyle,
		)

		const make = (wall: WallSegment, getCargo: (style: DungeonStyle) => Cargo) => {
			const style = this.#getStyle(wall.tile)
			const cargo = getCargo(style)
			const spatial = this.placer.placeProp(wall)
			const spawn = () => cargo.clone(spatial)
			const subject = new WallSubject(wall.tile, wall.location, spawn)
			this.cullableGrid.add(subject)
			this.fadingGrid.add(subject)
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

	dispose() {
		this.cullableGrid.dispose()
		this.fadingGrid.dispose()
	}
}

