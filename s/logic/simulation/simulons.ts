
import {State} from "../types.js"
import {Map2} from "../../tools/map2.js"
import {Simulator} from "./simulator.js"
import {Simula, Simulon} from "./types.js"
import {IdCounter} from "../../tools/id-counter.js"

export class Simulons {
	#map = new Map2<number, Simulon<any>>
	#idCounter = new IdCounter()

	created = []
	updated = []
	destroyed = []

	constructor(public simulator: Simulator) {}

	*all() {
		for (const simulant of this.#map.values())
			yield simulant
	}

	create<D>(simula: Simula<D>, state: State<D>) {
		const id = this.#idCounter.next()
		const simulant = simula(id, this.simulator)
		this.#map.set(id, {state, simulant})
	}

	get(id: number) {
		this.#map.get(id)
	}

	require(id: number) {
		this.#map.require(id)
	}

	update(id: number, state: any) {}

	destroy(id: number) {}
}

