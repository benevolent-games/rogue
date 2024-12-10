
import {cellAlgo} from "../types.js"
import {Fattener} from "./utils/fattener.js"
import {goalposting} from "./utils/goalposting.js"

export const mechanoid = cellAlgo(options => {
	const {randy, tileGrid} = options
	const p = tileGrid.percentageFn()
	const {walkables, goalposts} = goalposting({
		...options,
		distanceAlgo: "manhattan",
		goalcountRange: [1, p(2)],
	})
	const fattener = new Fattener(walkables, options)

	fattener.shadow()
	fattener.makeBorderRooms({sizeRange: [3, 5]})

	fattener.knobbify({
		count: randy.range(p(0.5), p(1)),
		size: randy.range(2, 3),
	})

	fattener.makeGoalpostBulbs(goalposts)

	return {walkables, goalposts, spawnpoints: []}
})

