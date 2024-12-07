
export type Snapshot = {
	id: number
	entities: [string, any][]
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

