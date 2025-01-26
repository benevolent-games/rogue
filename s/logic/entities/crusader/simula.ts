
import {Vec2} from "@benev/toolbox"

import {RogueEntities} from "../entities.js"
import {constants} from "../../../constants.js"
import {Station} from "../../station/station.js"
import {BipedSim} from "../../commons/biped/sim.js"
import {Coordinates} from "../../realm/utils/coordinates.js"
import {simula} from "../../../archimedes/framework/simulation/types.js"

export const crusaderSimula = simula<RogueEntities, Station>()<"crusader">(
	({id, station, getState, fromAuthor}) => {

	const bipedSim = new BipedSim(
		id,
		station,
		() => getState().biped,
		constants.crusader,
	)

	let input: RogueEntities["crusader"]["input"] = {
		attack: false,
		block: 0,
		sprint: false,
		movementIntent: Vec2.zero().array(),
		rotation: 0,
	}

	return {
		simulate: (tick, inputs) => {
			const state = getState()
			input = fromAuthor(state.author, inputs).at(-1) ?? input

			bipedSim.activity.movementIntent.set_(...input.movementIntent)
			bipedSim.activity.rotation = input.rotation
			bipedSim.activity.sprint = input.sprint
			bipedSim.activity.attack = input.attack
			bipedSim.activity.block = input.block

			bipedSim.simulate(tick)
			const coordinates = Coordinates.from(bipedSim.body.box.center)
			station.updateAuthorCoordinates(state.author, coordinates)
		},
		dispose: () => {
			bipedSim.dispose()
		},
	}
})

