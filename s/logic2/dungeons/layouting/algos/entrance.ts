
import {cellAlgo} from "../types.js"
import {Fattener} from "./utils/fattener.js"
import {goalposting} from "./utils/goalposting.js"

export const entrance = cellAlgo(options => {
	const middleTile = options.tileGrid.extent.clone().divideBy(2).round()

	const {walkables, goalposts} = goalposting({
		...options,
		start: middleTile,
		goalcountRange: [0, 0],
		distanceAlgo: "manhattan",
	})
	const fattener = new Fattener(walkables, options)

	fattener.shadow()
	fattener.spawnRectangle(middleTile, [5, 10], true)
	fattener.makeBorderRooms({sizeRange: [2, 3]})

	const spawnpoints = options.tileGrid.nearby(middleTile, 5, "manhattan")
		.filter(tile => walkables.has(tile))

	return {walkables, goalposts, spawnpoints}
})

