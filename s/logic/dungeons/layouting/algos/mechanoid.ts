
import {cellAlgo} from "../types.js"
import {goalposting} from "./utils/goalposting.js"

export const mechanoid = cellAlgo(options => {
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
		distanceAlgo: "manhattan",
		goalcountRange: [1, p(2)],
	})

	fattener.shadow()

	fattener.growBorderPortals(
		[2, 2],
		[start, previousCellDirection],
		[end, nextCellDirection],
	)

	fattener.knobbify({
		count: randy.range(p(0.5), p(1)),
		size: randy.range(2, 3),
	})

	fattener.makeGoalpostBulbs(goalposts)

	return {tiles: fattener.tiles, goalposts}
})

