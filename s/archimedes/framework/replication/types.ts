
import {Entities, Entity} from "../parts/types.js"

export type ReplicaPack<xRealm> = {
	realm: xRealm
	id: number
}

export type Replicated<xEntity extends Entity> = {
	inputs: xEntity["input"][]
}

export type ReplicaReturn<xEntity extends Entity> = {
	replicate: (tick: number, state: xEntity["state"]) => Replicated<xEntity>
	dispose: () => void
}

export type Replica<xEntity extends Entity, xRealm> = (
	(pack: ReplicaPack<xRealm>) => ReplicaReturn<xEntity>
)

export type Replicas<xEntities extends Entities, xRealm> = {
	[K in keyof xEntities]: Replica<xEntities[K], xRealm>
}

export const replica = (
	<xEntities extends Entities, xRealm>() =>
	<xKind extends keyof xEntities>(replica: Replica<xEntities[xKind], xRealm>) =>
	replica
)

