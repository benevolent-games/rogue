
import {levelSimula} from "./level/simula.js"
import {playerSimula} from "./player/simula.js"
import {asSimulas} from "../framework/simulation/types.js"

export const simulas = asSimulas({
	player: playerSimula,
	level: levelSimula,
})

