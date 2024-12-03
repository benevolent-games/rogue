
import {cellAlgo} from "../types.js"
import {Fattener} from "./utils/fattener.js"
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
	const {walkables, goalposts} = goalposting({
		end,
		start,
		randy,
		tileGrid,
		distanceAlgo: "manhattan",
		goalcountRange: [1, p(2)],
	})
	const fattener = new Fattener(randy, tileGrid, walkables)

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

	return {walkables, goalposts}
})

