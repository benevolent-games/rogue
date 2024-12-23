
import {Vecmap2} from "./vecmap2.js"
import {TileStore} from "./tile-store.js"
import {Pathfinder} from "./pathfinder.js"
import {chooseAlgo} from "./choose-algo.js"
import {drunkWalkToHorizon} from "./drunk-walk-to-horizon.js"
import {HolesReport, punchHolesThroughSubgrids} from "./punch-holes.js"
import {DungeonSpace, GlobalCellVec2, GlobalSectorVec2, GlobalTileVec2, LocalCellVec2, LocalTileVec2} from "./space.js"

export function generateFloorplan(space: DungeonSpace) {
	const sectors = generateSectors(space)
	return generateTiles(space, sectors)
}

type SectorPlan = [GlobalSectorVec2, HolesReport[]]

function generateSectors(space: DungeonSpace) {
	const {randy, cellGrid, options} = space

	const sectors = punchHolesThroughSubgrids({
		randy,
		subgrid: cellGrid,
		excludeCorners: false,
		vectors: drunkWalkToHorizon({randy, ...options.sectorWalk}),
	})

	return sectors.map(sector => {
		const cells = generateCells(space, sector)
		return [sector.vector, cells] as SectorPlan
	})
}

function generateCells(space: DungeonSpace, sector: HolesReport) {
	const {randy, cellGrid, tileGrid} = space
	const pathfinder = new Pathfinder(randy, cellGrid)
	return punchHolesThroughSubgrids({
		randy,
		subgrid: tileGrid,
		excludeCorners: true,
		vectors: pathfinder.drunkardWithPerseverance(sector.startSubvector, sector.endSubvector),
	})
}

function generateTiles(space: DungeonSpace, sectors: SectorPlan[]) {
	const {randy, tileGrid} = space

	const tiles = new TileStore(space)
	const goalposts = new Vecmap2<GlobalCellVec2, GlobalTileVec2[]>()
	const cellCount = countCells(sectors)

	const flattened = sectors
		.flatMap(([sector, cells]) => cells.map(cell => ({
			sector,
			cell,
			globalCell: space.toGlobalCellSpace(sector, cell.vector),
		})))

	flattened.forEach(({sector, cell, globalCell}, index) => {
		const previous = index === 0 ? undefined : flattened.at(index - 1)
		const next = flattened.at(index + 1)

		const algo = chooseAlgo({
			randy,
			isFirstCell: index === 0,
			isLastCell: index === (cellCount - 1),
		})

		const results = algo({
			randy,
			tileGrid,
			cell: cell.vector,
			start: cell.startSubvector,
			end: cell.endSubvector,
			sector,
			nextCellDirection: next
				? next.globalCell.clone().subtract(globalCell)
				: null,
			previousCellDirection: previous
				? previous.globalCell.clone().subtract(globalCell)
				: null,
		})

		tiles.add(sector, cell.vector, results.walkables.array())
		goalposts
			.guarantee(globalCell, () => [])
			.push(...results.goalposts.map(
				goalpost => space.toGlobalTileSpace(sector, cell.vector, goalpost)
			))
	})

	return {tiles, goalposts}
}

function countCells(sectors: SectorPlan[]) {
	let count = 0

	for (const [,cells] of sectors)
		for (const _ of cells)
			count += 1

	return count
}

