
import {cellAlgo} from "../types.js"
import {Fattener} from "../fattener.js"
import {Pathfinder} from "../pathfinder.js"
import {range} from "../../../../tools/range.js"
import {DistanceAlgo} from "../../../../tools/distance.js"

export const chaotic = cellAlgo(({
		randy,
		tileGrid,
		start,
		end,
		nextCellDirection,
		previousCellDirection,
	}) => {

	const distanceAlgo: DistanceAlgo = "euclidean"
	const goalCount = Math.round(randy.between(1, 5))

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

	fattener.growBorderPortals(
		[1, 4],
		[start, previousCellDirection],
		[end, nextCellDirection],
	)

	fattener.grow(p(5))

	fattener.knobbify({
		count: randy.between(p(2), p(3)),
		size: randy.between(1, 2),
	})

	fattener.knobbify({
		count: randy.between(2, p(1)),
		size: randy.between(3, 5),
	})

	fattener.makeGoalpostBulbs(goalposts)

	return {tiles: fattener.tiles, goalposts}
})

