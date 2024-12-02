
import {cellAlgo} from "../types.js"
import {Vecset2} from "../vecset2.js"
import {Fattener} from "../fattener.js"
import {Pathfinder} from "../pathfinder.js"
import {range} from "../../../../tools/range.js"
import {DistanceAlgo} from "../../../../tools/distance.js"

export const tatters = cellAlgo(({
		randy,
		tileGrid,
		start,
		end,
	}) => {

	const distanceAlgo: DistanceAlgo = "manhattan"
	const goalCount = Math.round(randy.range(5, 10))

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

	fattener.grow(p(10))

	fattener.knobbify({
		count: randy.range(p(2), p(3)),
		size: randy.range(1, 2),
	})

	fattener.knobbify({
		count: randy.range(1, 2),
		size: randy.range(2, 3),
	})

	fattener.makeGoalpostBulbs(goalposts)

	return {tiles: fattener.tiles, goalposts}
})

