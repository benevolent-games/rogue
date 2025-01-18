
import {Prop} from "@benev/toolbox"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {Warehouse} from "../../../tools/babylon/logistics/warehouse.js"
import {PropPool} from "../../../tools/babylon/optimizers/prop-pool.js"

export class Pimsley {
	#pool: PropPool
	#warehouse: Warehouse

	constructor(container: AssetContainer) {
		this.#warehouse = Warehouse.from(container)
		const root = this.#warehouse.require({label: "root"})
		this.#pool = new PropPool(root, false)
		this.#pool.preload(4)
	}

	make() {
		const prop = this.#pool.acquire()
		const dispose = () => this.#pool.release(prop)
		return [prop, dispose] as [Prop, () => void]
	}
}

