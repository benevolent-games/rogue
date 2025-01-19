
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {Pimsley} from "./pimsley.js"
import {Pool} from "../../../tools/babylon/optimizers/pool.js"

export class PimsleyFactory {
	#pool: Pool<Pimsley>

	constructor(container: AssetContainer) {
		this.#pool = new Pool(() => {
			const pimsley = new Pimsley(container)
			return {payload: pimsley, noodle: pimsley}
		})

		// TODO
		this.#pool.preload(1)
	}

	acquire() {
		const pimsley = this.#pool.acquire()
		const release = () => this.#pool.release(pimsley)
		return [pimsley, release] as [Pimsley, () => void]
	}

	dispose() {
		this.#pool.dispose()
	}
}

