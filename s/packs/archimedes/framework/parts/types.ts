
export type SnapshotPayload = {
	tick: number
	data: Snapshot
}

export type InputPayload = {
	tick: number
	inputs: InputShell<any>[]
}

export type Snapshot = {
	id: number
	entities: [number, EntityEntry][]
}

export type InputShell<xInput> = {
	author: number | null
	entity: number
	messages: xInput[]
}

export type Entity = {
	state: any
	input: any
}

export type EntityEntry = [string, any]
export type Entities = Record<string, Entity>

export type AsEntity<xEntity extends Entity> = xEntity
export type AsEntities<xEntities extends Entities> = xEntities

