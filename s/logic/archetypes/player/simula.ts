
import {Vec2} from "@benev/toolbox"
import {PlayerData} from "./data.js"
import {simula} from "../../simulation/types.js"

export const playerSimula = simula<PlayerData>(() => (id, simulator) => {
	return {
		data: {
			position: [1, 2] as Vec2,
		},
		simulate(data) {},
		dispose() {},
	}
})

