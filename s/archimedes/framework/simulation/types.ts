
export type SimulaPack<xStation> = {
	author: number
	entity: number
	station: xStation
	id: number
}

export type SimulaSimulated = {
	state: S
}

export type SimulaReturn = {
	simulate: (tick: number) => {}
	dispose: () => void
}

export type SimulaFn<xStation, xParams extends any[]> = (
	(...params: xParams) =>
	() =>
		SimulaReturn
)

export const simula = (
	<xStation>() =>
	<Fn extends SimulaFn<xStation>>(fn: Fn) =>
		{}
)

