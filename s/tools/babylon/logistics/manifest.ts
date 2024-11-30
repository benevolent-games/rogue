
import {Map2} from "@benev/slate"

/** Name format for our GLB objects, for smuggling in key-value properties */
export class Manifest extends Map2<string, string> {

	static parse(string: string) {
		string = string
			.replace(/_primitive\d*$/i, "")
			.replace(/\.\d+$/i, "")

		return new this(
			string.split(/[\s,]+/gm).map(part => {
				const [key, ...valueParts] = part.split("=")
				const value = valueParts.join("=")
				return [key, value]
			})
		)
	}

	toString() {
		return [...this]
			.map(([key, value]) => `${key}=${value}`)
			.join(", ")
	}
}

