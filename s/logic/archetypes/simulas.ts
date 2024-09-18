
import {playerSimula} from "./player/simula.js"
import {asSimulas} from "../framework/simulation/types.js"

export const simulas = asSimulas({
	player: playerSimula,
})

