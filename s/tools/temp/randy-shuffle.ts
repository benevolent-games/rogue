
import {Randy} from "@benev/toolbox"

// TODO
/** @deprecated use randy.shuffle from toolbox instead */
export function randyShuffle<T>(randy: Randy, array: T[]) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(randy.random() * (i + 1))
		;[array[i], array[j]] = [array[j], array[i]]
	}
	return array
}

