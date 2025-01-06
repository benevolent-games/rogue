
import {Map2} from "@benev/slate"
import {Prop} from "@benev/toolbox"

/** A label for a GLB object, which contains the name and custom properties */
export class Manifest extends Map2<string, string> {
	label: string

	constructor(public name: string, entries: [string, string][]) {
		super(entries)

		this.label = name
			.replace(/_primitive\d*$/i, "")
			.replace(/\.\d+$/i, "")

		this.set("label", this.label)
	}

	static scan(prop: Prop) {
		const extras = (prop.metadata?.gltf?.extras ?? {}) as Record<string, any>
		return new this(prop.name, Object.entries(extras)
			.filter(([,value]) => typeof value === "string")
			.map(([key, value]) => [key, String(value)]))
	}

	toString() {
		const data = [...this]
			.map(([key, value]) => `${key}=${value}`)
			.join(", ")
		return `(${this.name} :: ${data})`
	}
}

