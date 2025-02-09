
import {Arcseconds, Degrees} from "@benev/toolbox"
import {constants} from "../../../../constants.js"

const {tickRate} = constants.sim

/** meters-per-second */
export function mps(s: number) {
	return s / tickRate
}

/** degrees-per-second */
export function dps(s: number) {
	return Degrees.toRadians(s) / tickRate
}

/** arcseconds-per-dot */
export function apd(s: number) {
	return Arcseconds.toRadians(s)
}

