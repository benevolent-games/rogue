
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {Pool} from "../../../tools/babylon/optimizers/pool.js"
import {Pallet} from "../../../tools/babylon/logistics/pallet.js"

export class PalletPool extends Pool<Pallet> {
	constructor(container: AssetContainer) {
		super(() => {
			const pallet = new Pallet(container)
			return {payload: pallet, noodle: pallet}
		})
	}
}

