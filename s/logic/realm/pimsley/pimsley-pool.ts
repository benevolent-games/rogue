
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {Pimsley} from "./pimsley.js"
import {Pool} from "../../../tools/babylon/optimizers/pool.js"
import {Pallet} from "../../../tools/babylon/logistics/pallet.js"

export class PimsleyPool extends Pool<Pimsley> {
	constructor(container: AssetContainer) {
		super(() => {
			const pallet = new Pallet(container)
			const pimsley = new Pimsley(pallet)
			return {payload: pimsley, noodle: {
				enable: () => pallet.root.setEnabled(true),
				disable: () => pallet.root.setEnabled(false),
				dispose: () => pallet.dispose(),
			}}
		})
	}
}

