
import {Entities, Entity} from "../parts/types.js"

export type ReplicaPack<xEntity extends Entity, xRealm> = {
	id: number
	realm: xRealm
	state: xEntity["state"]
}

export type InputMadeByReplica<xEntity extends Entity> = {
	data: undefined | xEntity["input"]["data"],
	messages: undefined | xEntity["input"]["message"][],
}

export type Replicated<xEntity extends Entity> = {
	input?: InputMadeByReplica<xEntity>
}

export type ReplicaReturn<xEntity extends Entity> = {
	replicate: (tick: number, state: xEntity["state"]) => Replicated<xEntity>
	dispose: () => void
}

export type Replica<xEntity extends Entity, xRealm> = (
	(pack: ReplicaPack<xEntity, xRealm>) => ReplicaReturn<xEntity>
)

export type Replicas<xEntities extends Entities, xRealm> = {
	[K in keyof xEntities]: Replica<xEntities[K], xRealm>
}

export const replica = (
	<xEntities extends Entities, xRealm>() =>
	<xKind extends keyof xEntities>(replica: Replica<xEntities[xKind], xRealm>) =>
	replica
)

