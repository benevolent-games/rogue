
import {Randy} from "@benev/toolbox"
import {AlgoFn} from "./types.js"

import {chaotic} from "./algos/chaotic.js"
import {tatters} from "./algos/tatters.js"
import {mechanoid} from "./algos/mechanoid.js"

const algos = {
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
		return chaotic
	
	else if (isLastCell)
		return chaotic
	
	else
		return randy.choose(Object.values(algos))
}

