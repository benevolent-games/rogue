
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

export type Input = {
	data: any
	message: any
}

export type InputShell<xInput extends Input> = {
	author: number | null
	entity: number
	data: xInput["data"] | null
	messages: xInput["message"][]
}

export type Entity = {
	state: any
	input: Input
}

export type EntityEntry = [string, any]
export type Entities = Record<string, Entity>

export type AsEntity<xEntity extends Entity> = xEntity
export type AsEntities<xEntities extends Entities> = xEntities

