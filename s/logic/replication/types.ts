
import {State} from "../types.js"
import {Replicator} from "./replicator.js"

export type Replicant<D> = {
	replicate: (data: D) => void
	dispose: () => void
}

export type Replica<D> = (id: number, replicator: Replicator) => Replicant<D>

export type Replon<D> = {
	state: State<D>
	replicant: Replicant<D>
}

