
import {Randy} from "@benev/toolbox"
import {AlgoFn} from "./types.js"

import {yendor} from "./algos/yendor.js"
import {chaotic} from "./algos/chaotic.js"
import {tatters} from "./algos/tatters.js"
import {cubetown} from "./algos/cubetown.js"
import {entrance} from "./algos/entrance.js"
import {mechanoid} from "./algos/mechanoid.js"

const algos = {
	cubetown,
	chaotic,
	mechanoid,
	tatters,
}

export function chooseAlgo({randy, isFirstCell, isLastCell}: {
		randy: Randy
		isFirstCell: boolean
		isLastCell: boolean
	}): AlgoFn {

	if (isFirstCell)
		return entrance
	
	else if (isLastCell)
		return yendor
	
	else
		return randy.choose(Object.values(algos))
}

