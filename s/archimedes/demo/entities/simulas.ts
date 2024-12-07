
import {DemoStation} from "../station.js"
import {GameEntities} from "./entities.js"
import {Simulas} from "../../framework/simulation/types.js"

import {soldierSimula} from "./soldier/simula.js"
import {landmineSimula} from "./landmine/simula.js"

export const demoSimulas: Simulas<GameEntities, DemoStation> = {
	landmine: landmineSimula,
	soldier: soldierSimula,
}

