
export type Input = {
	kind: string
	sticky: boolean
	data: any
}

export type InputShell<xInput extends Input> = {
	author: number | null
	entity: number
	input: xInput
}

export type Entity = {
	state: any
	input: Input
}

export type EntityEntry = [string, any]
export type Entities = Record<string, Entity>

export type AsEntity<xEntity extends Entity> = xEntity
export type AsEntities<xEntities extends Entities> = xEntities

