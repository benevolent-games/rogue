
import {Map2} from "@benev/slate"
import {Randy, Vec2} from "@benev/toolbox"

import {Grid} from "./utils/grid.js"
import {DungeonOptions} from "./types.js"
import {Vecset2} from "./utils/vecset2.js"
import {Pathfinder} from "./utils/pathfinder.js"
import {cardinals} from "../../tools/directions.js"
import {drunkWalkToHorizon} from "./utils/drunk-walk-to-horizon.js"
import { Fattener } from "./utils/fattener.js"

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
			false,
			sector => sector,
		)

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

		const cellGoals = this.#carvePathwayThroughSubgrids(
			cellPath,
			tileGrid,
			true,
			cell => {
				const sector = sectorByCell.require(cell)
				return this.cellspace(sector, cell)
			},
		)

		this.cells = cellGoals.map(({unit: cell, start, end}) => {
			const pathfinder = new Pathfinder(randy, tileGrid)
			const innerTiles = tileGrid.excludeBorders()
			const tilePath = pathfinder.aStarChain([
				start,
				randy.yoink(innerTiles),
				randy.yoink(innerTiles),
				randy.yoink(innerTiles),
				end,
			])

			if (!tilePath)
				throw new Error("failure to produce tilepath")

			const sector = sectorByCell.require(cell)

			const fattener = new Fattener(this.randy, this.tileGrid, tilePath)

			fattener.grow(fattener.tiles.length / 5)
			fattener.knobbify(30, 2)
			fattener.knobbify(4, 6)

			return {sector, cell, tiles: fattener.tiles}
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

	#carvePathwayThroughSubgrids(
			unitPath: Vec2[],
			subgrid: Grid,
			excludeCorners: boolean,
			locate: (unit: Vec2) => Vec2,
		) {

		const unitGoals: {unit: Vec2, start: Vec2, end: Vec2}[] = []
		let previous: {unit: Vec2, end: Vec2} | null = null

		unitPath.forEach((unit, index) => {
			const subunits = subgrid.list()
			const nextUnit = unitPath.at(index + 1) ?? null

			const end = nextUnit
				? this.randy.choose(this.#getBorder(subgrid, locate(unit), locate(nextUnit), excludeCorners))
				: this.randy.choose(subunits)

			const start = previous
				? this.#pickAdjacent(
					subgrid,
					{unit: locate(previous.unit), subunit: previous.end},
					{unit: locate(unit), subunits},
				)
				: this.randy.choose(subunits)

			unitGoals.push({unit, start, end})
			previous = {unit, end}
		})

		return unitGoals
	}

	#getBorder(subgrid: Grid, unit: Vec2, neighborUnit: Vec2, excludeCorners: boolean) {
		const direction = neighborUnit.clone().subtract(unit)
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

