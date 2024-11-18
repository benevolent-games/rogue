
import {Map2} from "@benev/slate"

export type AvatarKind = "anon" | "free" | "premium" | "rare"

export class Avatar {
	constructor(public id: string, public kind: AvatarKind) {}

	get url() {
		return `/assets/avatars/${this.id}.webp`
	}

	static #group(kind: AvatarKind, ids: string[]) {
		return ids.map(id => [id, new this(id, kind)] as [string, Avatar])
	}

	static library = new Map2<string, Avatar>([
		...this.#group("anon", [
			"64tcJ1tTCF7",
			"499UCh29USv",
			"Kz7fjUWdShz",
			"Y6xnbNkvJCg",
			"f2TMdv7Jabe",
			"h6DEGDRTteC",
		]),

		...this.#group("free", [
			"cLZcTnPDhh8",
			"M1xwCjPJq5s",
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
			"h4u8YqcTJa1",
			"AVF85Jbcu4G",
			"5wDN74yCMG5",
			"QSxbM1abxdD",
			"97XHrHvoPFh",
			"BHyXLzjRUcN",
			"3W4jyfC4HWv",
			"bWp3Wx9spam",
			"UVwF6C786kd",
		]),
	])

	static default = this.library.require("cLZcTnPDhh8")
}

