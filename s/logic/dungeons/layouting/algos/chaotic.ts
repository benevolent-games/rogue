
import {cellAlgo} from "../types.js"
import {Fattener} from "./utils/fattener.js"
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
	const {walkables, goalposts} = goalposting({
		end,
		start,
		randy,
		tileGrid,
		goalcountRange: [1, p(1)],
		distanceAlgo: "euclidean",
	})
	const fattener = new Fattener(randy, tileGrid, walkables)

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

	return {walkables, goalposts}
})

