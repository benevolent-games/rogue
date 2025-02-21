
import {Map2} from "@benev/slate"

export type AvatarKind = "special" | "rando" | "free" | "premium" | "rare"

export class Avatar {
	constructor(public id: string, public kind: AvatarKind) {}

	get url() {
		return `/assets/avatars/${this.id}.webp`
	}

	static #group(kind: AvatarKind, ids: string[]) {
		return ids.map(id => [id, new this(id, kind)] as [string, Avatar])
	}

	static library = new Map2<string, Avatar>([
		...this.#group("rando", [
			"cLZcTnPDhh8",
			"64tcJ1tTCF7",
			"499UCh29USv",
			"Kz7fjUWdShz",
			"Y6xnbNkvJCg",
			"f2TMdv7Jabe",
			"h6DEGDRTteC",
			"M1xwCjPJq5s",
			"AQAh96wwLXL",
		]),

		...this.#group("free", [
			"ZUDSVX5Rit3",
			"2ymYtRCvkSZ",
			"eK9LNNUMzrg",
			"PpoLtH7Akes",
			"UobCyy5A3iP",
			"VZZju7jdLc",
			"W3JcKGE8E38",
			"8b9xfjAmHYP",
			"Ke2VEHn4im9",
		]),

		...this.#group("premium", [
			"Qt616tVcwPr",
			"RJ8CcDAyfx5",
			"A6uDbWB24LA",
			"bHmj72CVBc2",
			"hB98W6T4Gmk",
			"JFQMRRrsA9x",
			"JkjA7sZc8eg",
			"jP3fehL9dok",
			"NVrhJ8ddBqS",
			"Qhtwnt9cTq2",
			"ATaJ3eHJrjG",
		]),

		...this.#group("rare", [
			"h4u8YqcTJa1",
			"AVF85Jbcu4G",
			"5wDN74yCMG5",
			"BWzuxLn3dre",
			"QSxbM1abxdD",
			"97XHrHvoPFh",
			"BHyXLzjRUcN",
			"3W4jyfC4HWv",
			"bWp3Wx9spam",
			"UVwF6C786kd",
		]),

		...this.#group("special", [
			"CnccjEJgWJp",
		]),
	])

	static default = this.library.require("cLZcTnPDhh8")

	static get(id: string | null) {
		return id
			? (this.library.get(id) ?? this.default)
			: this.default
	}

	static selectKind(kind: AvatarKind) {
		return [...this.library.values()].filter(a => a.kind === kind)
	}

	static preloadAll() {
		return new Map2(
			[...this.library.values()].map(avatar => {
				const image = new Image()
				image.src = avatar.url
				image.alt = ""
				return [avatar.id, avatar]
			})
		)
	}
}

