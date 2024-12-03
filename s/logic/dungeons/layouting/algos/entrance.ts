
import {cellAlgo} from "../types.js"
import {Fattener} from "./utils/fattener.js"
import {goalposting} from "./utils/goalposting.js"

export const entrance = cellAlgo(options => {
	const {walkables, goalposts} = goalposting({
		...options,
		goalcountRange: [0, 0],
		distanceAlgo: "manhattan",
	})
	const fattener = new Fattener(walkables, options)

	fattener.shadow()
	fattener.spawnRectangle(options.start, [5, 10], true)
	fattener.makeBorderRooms({sizeRange: [2, 3]})

	return {walkables, goalposts}
})

