
import {cellAlgo} from "../types.js"
import {Fattener} from "./utils/fattener.js"
import {goalposting} from "./utils/goalposting.js"

export const yendor = cellAlgo(options => {
	const middleTile = options.tileGrid.extent.clone().divideBy(2).round()

	const {walkables, goalposts} = goalposting({
		...options,
		end: middleTile,
		goalcountRange: [0, 0],
		distanceAlgo: "manhattan",
	})
	const fattener = new Fattener(walkables, options)

	fattener.shadow()
	fattener.spawnRectangle(middleTile, [5, 10], true)
	fattener.makeBorderRooms({sizeRange: [2, 3]})

	return {walkables, goalposts, spawnpoints: []}
})

