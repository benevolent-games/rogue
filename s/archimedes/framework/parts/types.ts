
export type Input = {
	author: number | null
	entity: number
	sticky: boolean
	kind: string
	payload: any
}

export type Entity = {
	state: any
	input: Input
}

export type EntityEntry = [string, any]
export type Entities = Record<string, Entity>

export type AsEntity<xEntity extends Entity> = xEntity
export type AsEntities<xEntities extends Entities> = xEntities

