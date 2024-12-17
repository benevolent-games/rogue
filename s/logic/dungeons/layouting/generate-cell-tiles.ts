
import {Vec2} from "@benev/toolbox"
import {DungeonSpace} from "./space.js"
import {chooseAlgo} from "./choose-algo.js"
import {generateBroadplan} from "./generate-broadplan.js"

export function *generateCellTiles(
		space: DungeonSpace,
		broadplan: ReturnType<typeof generateBroadplan>,
	) {

	const {randy, tileGrid} = space
	const {cellGoals, sectorByCell} = broadplan

	for (const [cellIndex, goal] of cellGoals.entries()) {
		const {unit: cell, start, end, forwardDirection, backwardDirection} = goal

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
		const toGlobalTileSpace = (tile: Vec2) => space.toGlobalTileSpace(sector, cell, tile)

		yield {
			sector,
			cell,
			goalposts: goalposts.map(toGlobalTileSpace),
			spawnpoints: spawnpoints.map(toGlobalTileSpace),
			floorTiles: walkables.list().map(toGlobalTileSpace),
		}
	}
}

