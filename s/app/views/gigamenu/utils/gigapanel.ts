
import {Content} from "@benev/slate"

export type Gigapanel = {
	label: string
	button: () => Content
	content: () => Content
}

export const gigapanel = <Fn extends (...a: any[]) => Gigapanel>(fn: Fn) => fn

