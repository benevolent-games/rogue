
import {PlayerData} from "./data.js"
import {Simula} from "../../simulation/types.js"

export const playerSimula: Simula<PlayerData> = (id, simulator) => {
	void id
	void simulator

	return {
		simulate(data) {
			void data
		},
		dispose() {},
	}
}

