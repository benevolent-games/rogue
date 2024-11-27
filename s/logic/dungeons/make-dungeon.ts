
import {Randy, Vec2} from "@benev/toolbox"

import {Grid} from "./utils/grid.js"
import {DungeonOptions} from "./types.js"
import {Vecset2} from "./utils/vecset2.js"
import {Pathfinder} from "./utils/pathfinder.js"
import {cardinals} from "../../tools/directions.js"
import {drunkWalkToHorizon} from "./utils/drunk-walk-to-horizon.js"

export class Dungeon {
	randy: Randy
	cellGrid: Grid
	tileGrid: Grid
	cellSize: Vec2
	sectorSize: Vec2

	sectors: Vec2[]
	cells: {sector: Vec2, cell: Vec2, tiles: Vec2[]}[]

	constructor(public options: DungeonOptions) {
		const {seed, gridExtents, sectorWalk} = options
		const randy = this.randy = Randy.seed(seed)
		const cellGrid = this.cellGrid = new Grid(Vec2.array(gridExtents.cells))
		const tileGrid = this.tileGrid = new Grid(Vec2.array(gridExtents.tiles))
		this.cellSize = tileGrid.extent.clone()
		this.sectorSize = tileGrid.extent.clone().multiply(cellGrid.extent)

		const sectors = this.sectors = drunkWalkToHorizon({randy, ...sectorWalk})
		const sectorGoals = this.#carvePathwayThroughSubgrids(
			sectors,
			cellGrid,
			(sector, cell) => this.cellspace(sector, cell),
		)

		const cellPaths = sectorGoals.map(({unit: sector, start, end}) => {
			const pathfinder = new Pathfinder(randy, cellGrid)
			const cells = pathfinder.drunkardWithPerseverance(start, end)
			return {sector, cells}
		})
		this.cells = cellPaths.flatMap(({sector, cells}) => {
			const cellGoals = this.#carvePathwayThroughSubgrids(
				cells,
				tileGrid,
				(cell, tile) => this.tilespace(sector, cell, tile),
			)
			return cellGoals.map(({unit: cell, start, end}) => {
				const pathfinder = new Pathfinder(randy, tileGrid)
				const innerTiles = this.#innerSubunits(tileGrid)
				const tilePath = pathfinder.aStarChain([
					start,
					randy.yoink(innerTiles),
					randy.yoink(innerTiles),
					randy.yoink(innerTiles),
					end,
				])
				if (!tilePath)
					throw new Error("failure to produce tilepath")
				return {sector, cell, tiles: Vecset2.dedupe(tilePath)}
			})
		})
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

	#innerSubunits(grid: Grid) {
		return grid.list().filter(({x, y}) => (
			(x !== 0) &&
			(x !== (grid.extent.x - 1)) &&
			(y !== 0) &&
			(y !== (grid.extent.y - 1))
		))
	}

	#carvePathwayThroughSubgrids(
			unitPath: Vec2[],
			subgrid: Grid,
			locate: (unit: Vec2, subunit?: Vec2) => Vec2,
		) {

		const unitGoals: {unit: Vec2, start: Vec2, end: Vec2}[] = []
		let previous: {unit: Vec2, end: Vec2} | null = null

		unitPath.forEach((unit, index) => {
			const subunits = subgrid.list()
			const nextUnit = unitPath.at(index + 1) ?? null

			const end = nextUnit
				? this.randy.choose(getBorder(subgrid, unit, nextUnit))
				: this.randy.choose(subunits)

			const start = previous
				? pickAdjacent(
					{unit: previous.unit, subunit: previous.end},
					{unit, subunits},
					locate,
				)
				: this.randy.choose(subunits)

			unitGoals.push({unit, start, end})
			previous = {unit, end}
		})

		return unitGoals
	}
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function getBorder(grid: Grid, unit: Vec2, neighborUnit: Vec2) {
	const direction = neighborUnit.clone().subtract(unit)
	const border = grid.list().filter(cell => (
		(direction.x === 1 && cell.x === (grid.extent.x - 1)) ||
		(direction.x === -1 && cell.x === 0) ||
		(direction.y === 1 && cell.y === (grid.extent.y - 1)) ||
		(direction.y === -1 && cell.y === 0)
	))
	if (border.length === 0)
		throw new Error("failure to obtain border")
	return border
}

function pickAdjacent(
		alpha: {unit: Vec2, subunit: Vec2},
		bravo: {unit: Vec2, subunits: Vec2[]},
		locate: (unit: Vec2, subunit?: Vec2) => Vec2,
	) {

	const commonAlpha = locate(alpha.unit, alpha.subunit)

	const commonAdjacent = cardinals
		.map(cardinal => commonAlpha.clone().add(cardinal))

	const subunit = bravo.subunits.find(sub => {
		const commonBravo = locate(bravo.unit, sub)
		return commonAdjacent.some(adjacent => adjacent.equals(commonBravo))
	})

	if (!subunit)
		throw new Error("unable to find adjacent bravo subunit")

	return subunit
}

