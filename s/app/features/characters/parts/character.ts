
import {Badge} from "@benev/slate"
import {CharacterRecord} from "../types.js"
import {CharacterDetails} from "./character-details.js"

export class Character extends CharacterDetails {
	readonly id: string
	readonly ownerId: string
	readonly created: number

	readonly ownerBadge: Badge

	constructor(public record: CharacterRecord) {
		super(record.genesis)
		this.id = record.id
		this.ownerId = record.ownerId
		this.created = record.created
		this.ownerBadge = Badge.fromHex(record.ownerId)
	}
}

