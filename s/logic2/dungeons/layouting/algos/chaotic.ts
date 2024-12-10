
import {loop} from "@benev/toolbox"
import {cellAlgo} from "../types.js"
import {Fattener} from "./utils/fattener.js"
import {goalposting} from "./utils/goalposting.js"

export const chaotic = cellAlgo(options => {
	const {tileGrid, randy} = options
	const p = tileGrid.percentageFn()
	const {walkables, goalposts} = goalposting({
		...options,
		goalcountRange: [1, p(1)],
		distanceAlgo: "euclidean",
	})
	const fattener = new Fattener(walkables, options)

	fattener.makeBorderRooms({sizeRange: [3, 5]})
	fattener.grow(p(3))
	fattener.shadow()

	for (const _ of loop(randy.integerRange(2, p(1)))) {
		const roomRoot = randy.choose(walkables.list())
		fattener.spawnRectangle(roomRoot, [5, 11])
	}

	return {walkables, goalposts, spawnpoints: []}
})

