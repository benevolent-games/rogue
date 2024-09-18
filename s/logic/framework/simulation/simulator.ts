
import {State} from "../types.js"
import {Map2} from "../../../tools/map2.js"
import {Simulant, Simulas} from "./types.js"
import {IdCounter} from "../../../tools/id-counter.js"

export type Simulon<D> = {
	state: State<D>
	simulant: Simulant<D>
}

export class Scribe {
	created: [number, State][] = []
	updated: [number, State][] = []
	destroyed: number[] = []
	extract() {
		const {created, updated, destroyed} = this
		this.created = []
		this.updated = []
		this.destroyed = []
		return {created, updated, destroyed}
	}
}

export class Simulator<S extends Simulas = Simulas> {
	#map = new Map2<number, Simulon<any>>
	#idCounter = new IdCounter()
	#scribe = new Scribe()

	constructor(public simulas: S) {}

	*all() {
		for (const simulant of this.#map.values())
			yield simulant
	}

	create<K extends keyof S>(kind: K, ...a: Parameters<S[K]>) {
		const id = this.#idCounter.next()
		const simulant = this.simulas[kind](...a)(id, this)
		const state: State<any> = {kind: kind as string, data: simulant.data}
		this.#map.set(id, {state, simulant})
		this.#scribe.created.push([id, state])
		return simulant as ReturnType<ReturnType<S[K]>>
	}

	get(id: number) {
		this.#map.get(id)
	}

	require(id: number) {
		this.#map.require(id)
	}

	update(id: number, state: any) {
		this.#scribe.updated.push([id, state])
	}

	destroy(id: number) {
		this.#scribe.destroyed.push(id)
	}

	simulate() {
		for (const {state, simulant} of this.all())
			simulant.simulate(state.data)
		return this.#scribe.extract()
	}
}

