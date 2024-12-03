
import {Physics} from "../physics/physics.js"
import {simula} from "../framework/simulation/types.js"

export class Station {
	static simula = simula<Station>()
	physics = new Physics()
}

