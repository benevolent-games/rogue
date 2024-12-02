
import {cellAlgo} from "../types.js"
import {Vecset2} from "../vecset2.js"
import {Fattener} from "../fattener.js"
import {Pathfinder} from "../pathfinder.js"
import {range} from "../../../../tools/range.js"
import {DistanceAlgo} from "../../../../tools/distance.js"

export const mechanoid = cellAlgo(({
		randy,
		tileGrid,
		start,
		end,
		nextCellDirection,
		previousCellDirection,
	}) => {

	const distanceAlgo: DistanceAlgo = "manhattan"
	const goalCount = Math.round(randy.between(1, 10))

	//
	// goalposts tile path
	//

	const pathfinder = new Pathfinder(randy, tileGrid)
	const innerTiles = tileGrid.excludeBorders()
	const goalposts = [
		start,
		...range(goalCount)
			.map(() => randy.yoink(innerTiles)),
		end,
	]
	const tilePath = pathfinder.aStarChain(goalposts, distanceAlgo)
	if (!tilePath)
		throw new Error("failure to produce tilepath")
	const fattener = new Fattener(randy, tileGrid, tilePath)

	//
	// fattening
	//

	const p = tileGrid.percentageFn()

	fattener.shadow()

	fattener.growBorderPortals(
		[2, 2],
		[start, previousCellDirection],
		[end, nextCellDirection],
	)

	fattener.knobbify({
		count: randy.between(p(0.5), p(1)),
		size: randy.between(2, 3),
	})

	fattener.makeGoalpostBulbs(goalposts)

	return {tiles: fattener.tiles, goalposts}
})

