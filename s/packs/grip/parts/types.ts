
import {CauseFork} from "./cause-fork.js"
import {InputStyle} from "./input-interpreter.js"

export type SpoonBind = [string, SpoonOptions?]
export type SpoonOptions = {
	with?: string[]
	without?: string[]
	sensitivity?: number
	style?: InputStyle
	threshold?: number
}

export type ForkBind = SpoonBind[]
export type ForkBinds = Record<string, ForkBind>
export type GripBindings = Record<string, ForkBinds>

export type GripState<B extends GripBindings> = {
	[Mode in keyof B]: {
		[ActionName in keyof B[Mode]]: CauseFork
	}
}

export function asBindings<B extends GripBindings>(bindings: B) {
	return bindings
}

