
import {Hex} from "@benev/slate"
import {CharacterGenesis} from "../types.js"
import {Names} from "../../../../tools/names.js"

export class CharacterDetails {
	readonly seed: string
	readonly name: string

	constructor(public genesis: CharacterGenesis) {
		this.seed = genesis.seed

		const bytes = Hex.bytes(this.seed)
		this.name = Names.falrysk.generate(bytes)
	}

	static roll() {
		const seed = Hex.random(32)
		return new this({seed})
	}
}

