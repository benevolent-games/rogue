
import {SVGTemplateResult} from "@benev/slate"

export type Action = {
	label: string
	codes: string[]
	icon: null | SVGTemplateResult
}

export type Actions = Record<string, Action>
export type ActionGroups = Record<string, Actions>

export function actions<A extends Actions>(a: A) {
	return a
}

export function actionGroups<M extends ActionGroups>(m: M) {
	return m
}

export type Input = {
	action: Action
	down: boolean
	repeat: boolean
	time: number
}

export type Listener = ({}: Input) => void

