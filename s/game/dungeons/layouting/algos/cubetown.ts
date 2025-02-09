
import {loop} from "@benev/toolbox"
import {cellAlgo} from "../types.js"
import {Fattener} from "./utils/fattener.js"
import {goalposting} from "./utils/goalposting.js"

export const cubetown = cellAlgo(options => {
	const {randy, tileGrid} = options
	const p = tileGrid.percentageFn()
	const {walkables, goalposts} = goalposting({
		...options,
		goalcountRange: [1, p(1)],
		distanceAlgo: "manhattan",
	})
	const fattener = new Fattener(walkables, options)

	fattener.shadow()
	fattener.makeBorderRooms({sizeRange: [3, 5]})

	for (const roomRoot of goalposts)
		fattener.spawnRectangle(roomRoot, [4, 6])

	for (const _ of loop(randy.integerRange(1, p(1)))) {
		const roomRoot = randy.choose(walkables.array())
		fattener.spawnRectangle(roomRoot, [5, 11])
	}

	return {walkables, goalposts}
})

