
export type LevelArchetype = {
	facts: {
		config: LevelConfig
	}
	data: {}
	memo: {}
	broadcast: {}
}

export type LevelConfig = {
	seed: number
	length: number
	density: number
}

