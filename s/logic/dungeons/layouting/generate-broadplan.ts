
import {Map2} from "@benev/slate"
import {Vec2} from "@benev/toolbox"

import {DungeonSpace} from "./space.js"
import {Pathfinder} from "./pathfinder.js"
import {drunkWalkToHorizon} from "./drunk-walk-to-horizon.js"
import {carvePathwayThroughSubgrids} from "./carve-pathway-through-subgrids.js"

export function generateBroadplan(space: DungeonSpace) {
	const {randy, cellGrid, tileGrid, options} = space

	const sectorVectors = drunkWalkToHorizon({randy, ...options.sectorWalk})
	const sectorGoals = carvePathwayThroughSubgrids({
		randy,
		subgrid: cellGrid,
		unitPath: sectorVectors,
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

	const cellGoals = carvePathwayThroughSubgrids({
		randy,
		unitPath: cellPath,
		subgrid: tileGrid,
		excludeCorners: true,
		locate: cell => {
			const sector = sectorByCell.require(cell)
			return space.toGlobalCellSpace(sector, cell)
		},
	})

	const sectors = new Map2(
		cellPathing.map(({sector, cells}) => [
			sector,
			cells,
		])
	)

	return {cellGoals, sectorByCell, sectors}
}

