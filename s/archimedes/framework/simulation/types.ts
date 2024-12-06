
import {GameState} from "../parts/game-state.js"
import {Entities, Entity} from "../parts/types.js"

export type SimulaReturn<xEntity extends Entity> = {
	simulate: (tick: number, state: xEntity["state"], inputs: xEntity["input"][]) => void
	dispose: () => void
}

export type SimulaPack<xEntities extends Entities, xKind extends keyof xEntities, xStation> = {
	id: number
	station: xStation
	state: xEntities[xKind]["state"]
	gameState: GameState<xEntities>
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

