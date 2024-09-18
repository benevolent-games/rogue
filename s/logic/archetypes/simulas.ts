
import {playerSimula} from "./player/simula.js"
import {asSimulas} from "../simulation/types.js"

export const simulas = asSimulas({
	player: playerSimula,
})

