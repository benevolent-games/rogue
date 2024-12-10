
import {Replicator} from "./replicator.js"
import {Entities, Entity} from "../parts/types.js"

export type ReplicaPack<xEntities extends Entities, xKind extends keyof xEntities, xRealm> = {
	id: number
	realm: xRealm
	state: xEntities[xKind]["state"]
	replicator: Replicator<xEntities, xRealm>
}

export type ReplicaReturn<xEntity extends Entity> = {
	gatherInputs: (tick: number) => (xEntity["input"][] | undefined)
	replicate: (tick: number, state: xEntity["state"]) => void
	dispose: () => void
}

export type Replica<xEntities extends Entities, xKind extends keyof xEntities, xRealm> = (
	(pack: ReplicaPack<xEntities, xKind, xRealm>) => ReplicaReturn<xEntities[xKind]>
)

export type Replicas<xEntities extends Entities, xRealm> = {
	[K in keyof xEntities]: Replica<xEntities, K, xRealm>
}

export const replica = (
	<xEntities extends Entities, xRealm>() =>
	<xKind extends keyof xEntities>(replica: Replica<xEntities, xKind, xRealm>) =>
	replica
)

