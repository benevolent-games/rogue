
import {Vec2} from "@benev/toolbox"
import {PlayerData} from "./data.js"
import {simula} from "../../framework/simulation/types.js"

export const playerSimula = simula<PlayerData>()((position: Vec2) => (id, simulator) => {
	return {
		data: {position},
		simulate(data) {},
		dispose() {},
		hello() {},
	}
})

