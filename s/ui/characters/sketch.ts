
import {Map2} from "@benev/slate"
import {Api} from "../../server/server.js"
import {Character} from "../../server/characters/types.js"

export type CharacterSource = {
	token: string
	character: Character
}

export class CharactersModel {
	#map = new Map2<string, CharacterSource>()
	constructor(public api: Api) {}
	async load() {}
}

