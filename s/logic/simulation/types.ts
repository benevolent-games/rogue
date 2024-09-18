
import {State} from "../types.js"
import {Simulator} from "./simulator.js"

export type Simulant<D> = {
	simulate: (data: D) => void
	dispose: () => void
}

export type Simula<D> = (id: number, simulator: Simulator) => Simulant<D>

export type Simulon<D> = {
	state: State<D>
	simulant: Simulant<D>
}

