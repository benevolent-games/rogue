
import {DemoStation} from "../station.js"
import {GameEntities} from "./entities.js"
import {Simulas} from "../../framework/simulation/types.js"

import {soldierSimula} from "./soldier/simula.js"
import {landmineSimula} from "./landmine/simula.js"
import {bootstrapSimula} from "./bootstrap/simula.js"

export const demoSimulas: Simulas<GameEntities, DemoStation> = {
	bootstrap: bootstrapSimula,
	landmine: landmineSimula,
	soldier: soldierSimula,
}

