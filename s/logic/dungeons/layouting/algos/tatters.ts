
import {cellAlgo} from "../types.js"
import {Fattener} from "./utils/fattener.js"
import {goalposting} from "./utils/goalposting.js"

export const tatters = cellAlgo(options => {
	const {randy, tileGrid} = options
	const p = tileGrid.percentageFn()
	const {walkables, goalposts} = goalposting({
		...options,
		distanceAlgo: "manhattan",
		goalcountRange: [1, p(2)],
	})
	const fattener = new Fattener(walkables, options)

	fattener.grow(p(1))

	fattener.knobbify({
		count: randy.range(1, p(1)),
		size: randy.range(2, 3),
	})

	goalposts.forEach(g => fattener.spawnRectangle(g, [3, 6]))

	return {walkables, goalposts, spawnpoints: []}
})

