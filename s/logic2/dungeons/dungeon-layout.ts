
import {Hat, Map2} from "@benev/slate"
import {Randy, Vec2} from "@benev/toolbox"

import {Grid} from "./layouting/grid.js"
import {Vecset2} from "./layouting/vecset2.js"
import {DungeonOptions} from "./layouting/types.js"
import {Pathfinder} from "./layouting/pathfinder.js"
import {chooseAlgo} from "./layouting/choose-algo.js"
import {cardinals, ordinals} from "../../tools/directions.js"
import {drunkWalkToHorizon} from "./layouting/drunk-walk-to-horizon.js"
import {fixAllDiagonalKisses} from "./layouting/fix-diagonal-kissing-tiles.js"

export class DungeonLayout {
	randy: Randy
	cellGrid: Grid
	tileGrid: Grid
	cellSize: Vec2
	sectorSize: Vec2

	sectors: Vec2[]
	cells: {
		sector: Vec2
		cell: Vec2
		goalposts: Vec2[]
		walkables: Vecset2
		spawnpoints: Vec2[]
	}[]
	walkables: Vecset2
	unwalkables: Vecset2

	constructor(public options: DungeonOptions) {
		const {seed, gridExtents, sectorWalk} = options
		const randy = this.randy = Randy.seed(seed)
		const cellGrid = this.cellGrid = new Grid(Vec2.array(gridExtents.cells))
		const tileGrid = this.tileGrid = new Grid(Vec2.array(gridExtents.tiles))
		this.cellSize = tileGrid.extent.clone()
		this.sectorSize = tileGrid.extent.clone().multiply(cellGrid.extent)

		const sectors = this.sectors = drunkWalkToHorizon({randy, ...sectorWalk})
		const sectorGoals = this.#carvePathwayThroughSubgrids({
			unitPath: sectors,
			subgrid: cellGrid,
			excludeCorners: false,
			locate: sector => sector,
		})

		const cellPathing = sectorGoals.map(({unit: sector, start, end}) => {
			const pathfinder = new Pathfinder(randy, cellGrid)
			const cells = pathfinder.drunkardWithPerseverance(start, end)
			return {sector, cells}
		})

		const cellPath = cellPathing.flatMap(c => c.cells)
		const sectorByCell = new Map2(
			cellPathing.flatMap(c =>
				c.cells.map(cell => [cell, c.sector] as [Vec2, Vec2])
			)
		)

		const cellGoals = this.#carvePathwayThroughSubgrids({
			unitPath: cellPath,
			subgrid: tileGrid,
			excludeCorners: true,
			locate: cell => {
				const sector = sectorByCell.require(cell)
				return this.cellspace(sector, cell)
			},
		})

		this.cells = cellGoals.map(({
				unit: cell, start, end, forwardDirection, backwardDirection,
			}, cellIndex) => {
			const algo = chooseAlgo({
				randy,
				isFirstCell: cellIndex === 0,
				isLastCell: cellIndex === (cellGoals.length - 1),
			})

			const {walkables, goalposts, spawnpoints} = algo({
				randy,
				tileGrid,
				cell,
				start,
				end,
				sector: sectorByCell.require(cell),
				nextCellDirection: forwardDirection,
				previousCellDirection: backwardDirection,
			})

			const sector = sectorByCell.require(cell)
			fixAllDiagonalKisses(tileGrid, walkables)
			return {sector, cell, walkables, goalposts, spawnpoints}
		})

		this.walkables = this.#getAllWalkables()
		this.unwalkables = this.#getUnwalkables(this.walkables)
	}

	makeSpawnpointGetterFn() {
		const [{sector, cell, spawnpoints}] = this.cells
		if (spawnpoints.length === 0)
			throw new Error("no valid spawnpoints!")
		const hat = new Hat(spawnpoints)
		return () => this.tilespace(sector, cell, hat.pull()).add_(0.5, 0.5)
	}

	tilespace(sector: Vec2, cell = Vec2.zero(), tile = Vec2.zero()) {
		const sectorOffset = this.sectorSize.clone().multiply(sector)
		const cellOffset = this.cellSize.clone().multiply(cell)
		const tileOffset = tile.clone()
		return Vec2.zero().add(sectorOffset, cellOffset, tileOffset)
	}

	cellspace(sector: Vec2, cell = Vec2.zero()) {
		return this.cellGrid.extent.clone().multiply(sector).add(cell)
	}

	#getAllWalkables() {
		return new Vecset2(
			this.cells.flatMap(({sector, cell, walkables}) =>
				walkables.list().map(tile => this.tilespace(sector, cell, tile))
			)
		)
	}

	#getUnwalkables(walkables: Vecset2) {
		const walls = new Vecset2(
			walkables.list().flatMap(
				tile => [
					...cardinals.map(c => tile.clone().add(c)),
					...ordinals.map(c => tile.clone().add(c)),
				]
			)
		)
		return new Vecset2(
			walls.list().filter(wall => !walkables.has(wall))
		)
	}

	#carvePathwayThroughSubgrids({unitPath, subgrid, excludeCorners, locate}: {
			unitPath: Vec2[],
			subgrid: Grid,
			excludeCorners: boolean,
			locate: (unit: Vec2) => Vec2,
		}) {

		const unitGoals: {
			unit: Vec2,
			start: Vec2,
			end: Vec2,
			forwardDirection: Vec2 | null,
			backwardDirection: Vec2 | null,
		}[] = []

		let previous: {unit: Vec2, end: Vec2, direction: Vec2} | null = null

		unitPath.forEach((unit, index) => {
			const subunits = subgrid.list()
			const nextUnit = unitPath.at(index + 1) ?? null

			const forwardDirection = nextUnit
				? locate(nextUnit).clone().subtract(locate(unit))
				: null

			const backwardDirection = previous && previous.direction

			const end = forwardDirection
				? this.randy.choose(this.#getBorder(subgrid, forwardDirection, excludeCorners))
				: this.randy.choose(subunits)

			const start = previous
				? this.#pickAdjacent(
					subgrid,
					{unit: locate(previous.unit), subunit: previous.end},
					{unit: locate(unit), subunits},
				)
				: this.randy.choose(subunits)

			unitGoals.push({unit, start, end, forwardDirection, backwardDirection})

			if (nextUnit)
				previous = {unit, end, direction: locate(unit).clone().subtract(locate(nextUnit))}
		})

		return unitGoals
	}

	#getBorder(subgrid: Grid, direction: Vec2, excludeCorners: boolean) {
		const border = subgrid.list()
			.filter(v => subgrid.isDirectionalBorder(v, direction))
			.filter(v => (excludeCorners ? !subgrid.isCorner(v) : true))
		if (border.length === 0)
			throw new Error("failure to obtain border")
		return border
	}

	#pickAdjacent(
			subgrid: Grid,
			alpha: {unit: Vec2, subunit: Vec2},
			bravo: {unit: Vec2, subunits: Vec2[]},
		) {

		const resolve = (unit: Vec2, subunit: Vec2) => {
			return subgrid.extent.clone().multiply(unit).add(subunit)
		}

		const commonAlpha = resolve(alpha.unit, alpha.subunit)

		const commonAdjacent = cardinals
			.map(cardinal => commonAlpha.clone().add(cardinal))

		const subunit = bravo.subunits.find(sub => {
			const commonBravo = resolve(bravo.unit, sub)
			return commonAdjacent.some(adjacent => adjacent.equals(commonBravo))
		})

		if (!subunit)
			throw new Error("unable to find adjacent bravo subunit")

		return subunit
	}
}

