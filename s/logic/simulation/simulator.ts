
import {Simulons} from "./simulons.js"

export class Simulator {
	simulons = new Simulons(this)

	simulate() {
		for (const {state, simulant} of this.simulons.all())
			simulant.simulate(state.data)
	}
}

