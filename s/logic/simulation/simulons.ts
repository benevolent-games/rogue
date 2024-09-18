
import {State} from "../types.js"
import {Map2} from "../../tools/map2.js"
import {Simulator} from "./simulator.js"
import {Simulant, Simulas} from "./types.js"
import {IdCounter} from "../../tools/id-counter.js"

export type Simulon<D> = {
	state: State<D>
	simulant: Simulant<D>
}

export class Simulons<S extends Simulas> {
	#map = new Map2<number, Simulon<any>>
	#idCounter = new IdCounter()

	created = []
	updated = []
	destroyed = []

	constructor(public simulator: Simulator, public simulas: S) {}

	*all() {
		for (const simulant of this.#map.values())
			yield simulant
	}

	create<K extends keyof S>(kind: K, ...a: Parameters<S[K]>) {
		const id = this.#idCounter.next()
		const simulant = this.simulas[kind](...a)(id, this.simulator)
		const state: State<any> = {kind: kind as string, data: simulant.data}
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

