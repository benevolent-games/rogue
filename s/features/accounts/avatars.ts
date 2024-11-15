
import {Map2} from "@benev/slate"

export type AvatarKind = "free" | "premium" | "rare"

export class Avatar {
	constructor(public id: string, public kind: "free" | "premium" | "rare") {}

	get url() {
		return `/assets/avatars/${this.id}.webp`
	}

	static #group(kind: AvatarKind, ids: string[]) {
		return ids.map(id => [id, new this(id, kind)] as [string, Avatar])
	}

	static library = new Map2<string, Avatar>([
		...this.#group("free", [
			"2ymYtRCvkSZ",
			"8b9xfjAmHYP",
			"AQAh96wwLXL",
			"eK9LNNUMzrg",
			"Ke2VEHn4im9",
			"PpoLtH7Akes",
			"UobCyy5A3iP",
			"VZZju7jdLc",
			"W3JcKGE8E38",
		]),

		...this.#group("premium", [
			"A6uDbWB24LA",
			"ATaJ3eHJrjG",
			"bHmj72CVBc2",
			"hB98W6T4Gmk",
			"JFQMRRrsA9x",
			"JkjA7sZc8eg",
			"jP3fehL9dok",
			"NVrhJ8ddBqS",
			"Qhtwnt9cTq2",
			"Qt616tVcwPr",
			"RJ8CcDAyfx5",
		]),

		...this.#group("rare", [
			"5wDN74yCMG5",
			"AVF85Jbcu4G",
		]),
	])

	static default = this.library.require("VZZju7jdLc")
}

