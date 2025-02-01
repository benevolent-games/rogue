
import {Mind} from "./mind/mind.js"
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
		constants.crusader,
	)

	const mind = new Mind(station, id)
	const popsicle = station.glacier.add(bipedSim.body.box.center)

	return {
		simulate: tick => {
			popsicle.point.set(bipedSim.body.box.center)
			if (!popsicle.frozen) {
				bipedSim.activity = mind.behave(tick, getState().biped)
				bipedSim.wake()
				bipedSim.simulate(tick)
			}
		},
		dispose: () => {
			station.glacier.delete(popsicle)
			bipedSim.dispose()
		},
	}
})

