
import {CharacterRecord} from "../types.js"
import {CharacterDetails} from "./character-details.js"

export class Character extends CharacterDetails {
	readonly id: string
	readonly ownerId: string

	constructor(public record: CharacterRecord) {
		super(record.genesis)
		this.id = record.id
		this.ownerId = record.ownerId
	}
}

