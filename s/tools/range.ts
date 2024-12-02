
import {loop} from "@benev/toolbox"

export function range(n: number) {
	return [...loop(n)]
}

