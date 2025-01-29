
import {RogueEntities} from "../entities.js"
import {constants} from "../../../constants.js"
import {Station} from "../../station/station.js"
import {BipedSim} from "../../commons/biped/sim.js"
import {simula} from "../../../archimedes/framework/simulation/types.js"

export const botSimula = simula<RogueEntities, Station>()<"bot">(
	({id, station, getState}) => {

	const bipedSim = new BipedSim(
		id,
		station,
		() => getState().biped,
		{...constants.crusader, alwaysAwake: false},
	)

	return {
		simulate: tick => {
			bipedSim.simulate(tick)
		},
		dispose: () => {
			bipedSim.dispose()
		},
	}
})

