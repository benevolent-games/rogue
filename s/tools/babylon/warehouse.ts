
import {Map2} from "@benev/slate"
import {Prop} from "@benev/toolbox"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {Propname} from "../propnames/propnames.js"

export class Warehouse {
	#props = new Map2<string, Prop>()

	constructor(public readonly container: AssetContainer) {
		for (const node of [...container.meshes, ...container.transformNodes])
			if (!node.name.includes("_primitive"))
				this.#props.set(node.name, node)
	}

	query(tags: string[]) {
		return [...this.#props]
			.map(([name, prop]) => ({
				prop,
				propname: Propname.parse(name),
			}))
			.filter(({propname}) => tags.every(t => propname.has(t)))
	}
}

