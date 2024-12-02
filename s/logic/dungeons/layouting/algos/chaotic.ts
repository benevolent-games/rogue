
import {cellAlgo} from "../types.js"
import {goalposting} from "./utils/goalposting.js"

export const chaotic = cellAlgo(options => {
	const {
		end,
		start,
		randy,
		tileGrid,
		nextCellDirection,
		previousCellDirection,
	} = options

	const p = tileGrid.percentageFn()
	const {fattener, goalposts} = goalposting({
		end,
		start,
		randy,
		tileGrid,
		goalcountRange: [1, p(1)],
		distanceAlgo: "euclidean",
	})

	fattener.growBorderPortals(
		[1, 4],
		[start, previousCellDirection],
		[end, nextCellDirection],
	)

	fattener.grow(p(5))

	fattener.knobbify({
		count: randy.range(p(2), p(3)),
		size: randy.range(1, 2),
	})

	fattener.knobbify({
		count: randy.range(2, p(1)),
		size: randy.range(3, 5),
	})

	fattener.makeGoalpostBulbs(goalposts)

	return {tiles: fattener.tiles, goalposts}
})

