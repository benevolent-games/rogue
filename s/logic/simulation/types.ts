
import {Simulator} from "./simulator.js"

export type Simulant<D> = {
	data: D
	simulate: (data: D) => void
	dispose: () => void
}

export type Simulan<D> = (id: number, simulator: Simulator) => Simulant<D>

export type Simula<D> = (...a: any[]) => Simulan<D>
export type Simulas = Record<string, Simula<any>>
export const simula = <D>(s: Simula<D>) => s
export const asSimulas = <S extends Simulas>(s: S) => s

