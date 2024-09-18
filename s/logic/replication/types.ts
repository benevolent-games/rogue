
import {State} from "../types.js"
import {Replicator} from "./replicator.js"
import {Simulas} from "../simulation/types.js"

export type Replon<D> = {
	state: State<D>
	replicant: Replicant<D>
}

export type Replicant<D> = {
	replicate: (data: D) => void
	dispose: () => void
}

export type Replica<D> = (id: number, replicator: Replicator) => Replicant<D>
export type Replicas = Record<string, Replica<any>>
export const replica = <D>(r: Replica<D>) => r
export const asReplicas = <S extends Simulas>(r: Record<keyof S, Replica<any>>) => r

