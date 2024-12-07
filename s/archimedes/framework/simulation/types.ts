
import {Simulator} from "./simulator.js"
import {Entities, Entity} from "../parts/types.js"

export type SimulaInput<xEntity extends Entity> = {
	data: xEntity["input"]["data"]
	messages: xEntity["input"]["message"][]
}

export type SimulaReturn<xEntity extends Entity> = {
	inputData: xEntity["input"]["data"]
	dispose: () => void
	simulate: (
		tick: number,
		state: xEntity["state"],
		input: SimulaInput<xEntity>,
	) => void
}

export type SimulaPack<xEntities extends Entities, xKind extends keyof xEntities, xStation> = {
	simulator: Simulator<xEntities, xStation>
	station: xStation
	id: number
	state: xEntities[xKind]["state"]
}

export type Simula<xEntities extends Entities, xKind extends keyof xEntities, xStation> = (
	(pack: SimulaPack<xEntities, xKind, xStation>) =>
		SimulaReturn<xEntities[xKind]>
)

export type Simulas<xEntities extends Entities, xStation> = {
	[K in keyof xEntities]: Simula<xEntities, K, xStation>
}

export const simula = (
	<xEntities extends Entities, xStation>() =>
	<xKind extends keyof xEntities>(simula: Simula<xEntities, xKind, xStation>) =>
	simula
)

