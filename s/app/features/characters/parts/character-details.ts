
import {Hex} from "@benev/slate"
import {Randy} from "@benev/toolbox"
import {CharacterGenesis} from "../types.js"
import {Names} from "../../../../tools/names.js"
import {bytesToInteger} from "../../../../tools/temp/bytes-to-integer.js"
import {metersToFeetAndInches} from "../../../../tools/feet-and-inches.js"

export class CharacterDetails {
	readonly seed: string
	readonly name: string
	readonly height: number

	constructor(public genesis: CharacterGenesis) {
		this.seed = genesis.seed

		const bytes = Hex.bytes(this.seed)
		this.name = Names.falrysk.generate(bytes)

		const integer = bytesToInteger(bytes)
		const randy = new Randy(integer)
		this.height = CharacterDetails.getRandomHeight(randy)
	}

	get heightDisplay() {
		const meters = this.height
		const {feet, inches} = metersToFeetAndInches(meters)
		const centimeters = Math.round(100 * this.height)
		const feetAndInches = `${feet}'${inches}"`
		return {meters, centimeters, feetAndInches, feet, inches}
	}

	static getRandomHeight(randy: Randy) {
		const sampleCount = 3
		let total = 0
		for (const _ of Array(sampleCount))
			total += randy.range(1.60, 2.0)
		return total / sampleCount
	}

	static roll() {
		const seed = Hex.random(32)
		return new this({seed})
	}
}

