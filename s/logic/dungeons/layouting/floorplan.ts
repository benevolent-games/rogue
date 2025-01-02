
import {Vec2} from "@benev/toolbox"
import {Vecmap2} from "./vecmap2.js"
import {TileStore} from "./tile-store.js"
import {Pathfinder} from "./pathfinder.js"
import {chooseAlgo} from "./choose-algo.js"
import {drunkWalkToHorizon} from "./drunk-walk-to-horizon.js"
import {HolesReport, punchHolesThroughSubgrids} from "./punch-holes.js"
import {DungeonSpace, GlobalCellVec2, GlobalSectorVec2, LocalCellVec2} from "./space.js"

type CellPlan = {localCell: LocalCellVec2, globalCell: GlobalCellVec2, cellReport: HolesReport}
type SectorPlan = [GlobalSectorVec2, CellPlan[]]

export function generateSectors(space: DungeonSpace) {
	const {randy, cellGrid, tileGrid, options} = space

	const sectors = punchHolesThroughSubgrids({
		randy,
		subgrid: cellGrid,
		excludeCorners: false,
		vectors: drunkWalkToHorizon({randy, ...options.sectorWalk}),
	})

	const pathfinder = new Pathfinder(randy, cellGrid)
	const temp1 = new Vecmap2<GlobalCellVec2, {sector: GlobalSectorVec2, localCell: LocalCellVec2}>()

	for (const sector of sectors) {
		const cells = pathfinder.drunkardWithPerseverance(sector.startSubvector, sector.endSubvector)
		for (const localCell of cells) {
			const globalCell = space.toGlobalCellSpace(sector.vector, localCell)
			temp1.set(globalCell, {sector: sector.vector, localCell})
		}
	}

	const temp2 = new Vecmap2<GlobalSectorVec2, CellPlan[]>()
	const cellReports = punchHolesThroughSubgrids({
		randy,
		subgrid: tileGrid,
		excludeCorners: true,
		vectors: [...temp1.keys()],
	})
	for (const cellReport of cellReports) {
		const globalCell = cellReport.vector
		const {sector, localCell} = temp1.require(globalCell)
		temp2.guarantee(sector, () => []).push({localCell, globalCell, cellReport})
	}

	return temp2.array() as SectorPlan[]
}

export function generateFloorTiles(space: DungeonSpace, sectors: SectorPlan[]) {
	const {randy, tileGrid} = space

	const floors = new TileStore(space)
	const cellCount = countCells(sectors)
	const goalposts: Vec2[] = []

	const flattened = sectors
		.flatMap(([sector, cells]) => cells.map(({localCell, globalCell, cellReport}) => ({
			sector,
			globalCell,
			localCell,
			cellReport,
		})))

	flattened.forEach(({sector, cellReport, localCell, globalCell}, index) => {
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
			sector,
			cell: globalCell,
			start: cellReport.startSubvector,
			end: cellReport.endSubvector,
			nextCellDirection: next
				? next.globalCell.clone().subtract(globalCell)
				: null,
			previousCellDirection: previous
				? previous.globalCell.clone().subtract(globalCell)
				: null,
		})

		floors.add(sector, localCell, results.walkables.array())
		goalposts.push(...results.goalposts.map(tile => space.toGlobalTileSpace(sector, localCell, tile)))
	})

	return {floors, goalposts}
}

function countCells(sectors: SectorPlan[]) {
	let count = 0

	for (const [,cells] of sectors)
		for (const _ of cells)
			count += 1

	return count
}

