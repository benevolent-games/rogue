
import {Simula} from "./simulation/types.js"
import {Replica} from "./replication/types.js"

export type StateId = number

export type State<D = any> = {
	kind: string
	data: D
}

export type Archetype<D> = {
	simula: Simula<D>
	replica: Replica<D>
}

export function asArchetype<A extends Archetype<any>>(a: A) {
	return a
}

