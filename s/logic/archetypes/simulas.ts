
import {levelSimula} from "./level/simula.js"
import {Station} from "../station/station.js"
import {playerSimula} from "./player/simula.js"
import {asSimulas} from "../framework/simulation/types.js"

export const simulas = asSimulas<Station>()({
	player: playerSimula,
	level: levelSimula,
})

