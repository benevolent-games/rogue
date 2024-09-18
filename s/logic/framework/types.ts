
export type StateId = number

export type State<D = any> = {
	kind: string
	data: D
}

