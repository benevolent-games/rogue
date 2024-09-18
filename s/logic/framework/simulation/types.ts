
import {Simulator} from "./simulator.js"

export type Simulant<D> = {
	data: D
	simulate: (data: D) => void
	dispose: () => void
}

export type Simulan<D> = (id: number, simulator: Simulator) => Simulant<D>

export type Simula<A extends any[], D> = (...a: A) => Simulan<D>
export type Simulas = Record<string, Simula<any, any>>
export const simula = <D>() => <S extends Simula<any, D>>(s: S) => s
export const asSimulas = <S extends Simulas>(s: S) => s

