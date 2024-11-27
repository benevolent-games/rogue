
import {Map2} from "@benev/slate"
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

	constructor(public options: DungeonOptions) {
		const {seed, gridExtents} = options
		this.randy = Randy.seed(seed)
		this.cellGrid = new Grid(Vec2.array(gridExtents.cells))
		this.tileGrid = new Grid(Vec2.array(gridExtents.tiles))
		this.cellSize = this.tileGrid.extent.clone()
		this.sectorSize = this.tileGrid.extent.clone().multiply(this.cellGrid.extent)
	}

	resolve(sector: Vec2, cell = Vec2.zero(), tile = Vec2.zero()) {
		const sectorOffset = this.sectorSize.clone().multiply(sector)
		const cellOffset = this.cellSize.clone().multiply(cell)
		const tileOffset = tile.clone()
		return Vec2.zero().add(sectorOffset, cellOffset, tileOffset)
	}
}

export function makeDungeon(options: DungeonOptions) {
	const {seed, sectorWalk, gridExtents} = options

	const randy = Randy.seed(seed)
	const cellGrid = new Grid(Vec2.array(gridExtents.cells))
	const tileGrid = new Grid(Vec2.array(gridExtents.tiles))

	const cellSize = tileGrid.extent.clone()
	const sectorSize = tileGrid.extent.clone().multiply(cellGrid.extent)

	const sectorPath = drunkWalkToHorizon({randy, ...sectorWalk})
	const sectorCellPaths = new Map2<Vec2, Vec2[]>()
	const cellTiles = new Map2<Vec2, Vec2[]>()

	function locate(sector: Vec2, cell = Vec2.zero(), tile = Vec2.zero()) {
		const sectorOffset = sectorSize.clone().multiply(sector)
		const cellOffset = cellSize.clone().multiply(cell)
		const tileOffset = tile.clone()
		return Vec2.zero().add(sectorOffset, cellOffset, tileOffset)
	}


	let previousReport: {sector: Vec2, endCell: Vec2} | null = null

	sectorPath.forEach((sector, index) => {
		const cells = cellGrid.list()
		const nextSector = sectorPath.at(index + 1) ?? null

		const endCell = nextSector
			? randy.choose(getBorder(cellGrid, sector, nextSector))
			: randy.choose(cells)

		const startCell = previousReport
			? pickAdjacent(
				cellGrid,
				{unit: previousReport.sector, sub: previousReport.endCell},
				{unit: sector, subs: cells},
			)
			: randy.choose(cells)

		const pathfinder = new Pathfinder(randy, cellGrid)
		const path = pathfinder.drunkardWithPerseverance(startCell, endCell)
		sectorCellPaths.set(sector, path)

		previousReport = {sector, endCell}
	})

	const sectorsByCell = new Map2<Vec2, Vec2>()
	for (const [sector, cellPath] of [...sectorCellPaths]) {
		for (const cell of cellPath)
			sectorsByCell.set(cell, sector)
	}

	const cellPath = new Vecset2([...sectorCellPaths.values()].flat()).list()

	let previousCellReport: {cell: Vec2, endTile: Vec2} | null = null

	cellPath.forEach((cell, index) => {
		const sector = sectorsByCell.require(cell)
		const absoluteCell = commonSpace(cellGrid, sector, cell)

		const tiles = tileGrid.list()
		const nextCell = cellPath.at(index + 1) ?? null

		const endTile = nextCell
			? randy.choose(getBorder(tileGrid, absoluteCell, commonSpace(cellGrid, sector, nextCell)))
			: randy.choose(tiles)

		const startTile = previousCellReport
			? pickAdjacent(
				tileGrid,
				{unit: previousCellReport.cell, sub: previousCellReport.endTile},
				{unit: cell, subs: tiles},
			)
			: randy.choose(tiles)

		const pathfinder = new Pathfinder(randy, tileGrid)
		const availableTiles = new Vecset2(tiles)
		availableTiles.delete(startTile)
		availableTiles.delete(endTile)

		const path = pathfinder.aStarChain([
			startTile,
			availableTiles.yoink(randy),
			availableTiles.yoink(randy),
			availableTiles.yoink(randy),
			endTile,
		])

		if (!path)
			throw new Error("a-star-chain failed to find tile path")

		const dedupedPath = new Vecset2(path).list()
		cellTiles.set(cell, dedupedPath)

		previousCellReport = {cell, endTile}
	})

	console.log("CELL PATH", cellPath)

	return {cellSize, sectorSize, sectorCellPaths, cellTiles}
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function getBorder(grid: Grid, unit: Vec2, neighborUnit: Vec2) {
	const direction = neighborUnit.clone().subtract(unit)
	return grid.list().filter(cell => (
		(direction.x === 1 && cell.x === (grid.extent.x - 1)) ||
		(direction.x === -1 && cell.x === 0) ||
		(direction.y === 1 && cell.y === (grid.extent.y - 1)) ||
		(direction.y === -1 && cell.y === 0)
	))
}

function pickAdjacent(
		grid: Grid,
		alpha: {unit: Vec2, sub: Vec2},
		bravo: {unit: Vec2, subs: Vec2[]},
	) {

	const commonAlpha = commonSpace(grid, alpha.unit, alpha.sub)

	const commonAdjacent = cardinals
		.map(cardinal => commonAlpha.clone().add(cardinal))

	const sub = bravo.subs.find(sub => {
		const commonBravo = commonSpace(grid, bravo.unit, sub)
		return commonAdjacent.some(adjacent => adjacent.equals(commonBravo))
	})

	if (!sub)
		throw new Error("unable to find adjacent bravo subunit")

	return sub
}

function commonSpace(grid: Grid, unit: Vec2, sub: Vec2) {
	return unit
		.clone()
		.multiply(grid.extent)
		.add(sub)
}

