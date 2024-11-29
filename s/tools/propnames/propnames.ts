
import {Map2} from "@benev/slate"

export class Propname extends Map2<string, string> {

	static parse(string: string) {
		return new this(
			string.split(/[\s,]+/gm).map(part => {
				const [key, ...valueParts] = part.split("=")
				const value = valueParts.join("=")
				return [key, value]
			})
		)
	}

	static organize(key: string, propnames: Propname[]) {
		const map = new Map2<string, Propname[]>()
		for (const propname of propnames) {
			if (propname.has(key)) {
				const value = propname.get(key)!
				const array = map.guarantee(value, () => [])
				array.push(propname)
			}
		}
		return map
	}

	toString() {
		const parts: string[] = []

		for (const [key, value] of this)
			parts.push(`${key}=${value}`)

		return parts.join(", ")
	}
}

