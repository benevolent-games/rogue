
import {Map2} from "@benev/slate"
import {Randy, Vec2} from "@benev/toolbox"

import {Grid} from "./utils/grid.js"
import {DungeonOptions} from "./types.js"
import {Pathfinder} from "./utils/pathfinder.js"
import {cardinals} from "../../tools/directions.js"
import {drunkWalkToHorizon} from "./utils/drunk-walk-to-horizon.js"

export function makeDungeon(options: DungeonOptions) {
	const {seed, sectorWalk, gridExtents} = options

	const randy = Randy.seed(seed)
	const cellGrid = new Grid(Vec2.array(gridExtents.cells))
	const tileGrid = new Grid(Vec2.array(gridExtents.tiles))

	const cellSize = tileGrid.extent.clone()
	const sectorSize = tileGrid.extent.clone().multiply(cellGrid.extent)

	const sectorPath = drunkWalkToHorizon({randy, ...sectorWalk})
	const sectorCellPaths = new Map2<Vec2, Vec2[]>()

	let previousReport: {sector: Vec2, endCell: Vec2} | null = null

	sectorPath.forEach((sector, index) => {
		const cells = cellGrid.list()
		const nextSector = sectorPath.at(index + 1) ?? null

		const endCell = nextSector
			? randy.choose(getBorder(cellGrid, sector, nextSector))
			: randy.choose(cells)

		const startCell = previousReport
			? pickAdjacentBravoCell(
				cellGrid,
				{sector: previousReport.sector, cell: previousReport.endCell},
				{sector, cells},
			)
			: randy.choose(cells)

		const pathfinder = new Pathfinder(randy, cellGrid)
		const path = pathfinder.drunkard(startCell, endCell)
		sectorCellPaths.set(sector, path)

		previousReport = {sector, endCell}
	})

	return {cellSize, sectorSize, sectorCellPaths}
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function getBorder(cellGrid: Grid, sector: Vec2, neighborSector: Vec2) {
	const direction = neighborSector.clone().subtract(sector)
	return cellGrid.list().filter(cell => (
		(direction.x === 1 && cell.x === (cellGrid.extent.x - 1)) ||
		(direction.x === -1 && cell.x === 0) ||
		(direction.y === 1 && cell.y === (cellGrid.extent.y - 1)) ||
		(direction.y === -1 && cell.y === 0)
	))
}

function pickAdjacentBravoCell(
		cellGrid: Grid,
		alpha: {sector: Vec2, cell: Vec2},
		bravo: {sector: Vec2, cells: Vec2[]},
	) {

	const commonAlpha = commonCellSpace(cellGrid, alpha.sector, alpha.cell)

	const commonAdjacent = cardinals
		.map(cardinal => commonAlpha.clone().add(cardinal))

	const cell = bravo.cells.find(bravoCell => {
		const commonBravo = commonCellSpace(cellGrid, bravo.sector, bravoCell)
		return commonAdjacent.some(adjacent => adjacent.equals(commonBravo))
	})

	if (!cell)
		throw new Error("unable to find adjacent bravo cell")

	return cell
}

function commonCellSpace(cellGrid: Grid, sector: Vec2, cell: Vec2) {
	return sector
		.clone()
		.multiply(cellGrid.extent)
		.add(cell)
}

