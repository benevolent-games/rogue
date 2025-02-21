
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {Realm} from "../realm.js"
import {Pimsley} from "./pimsley.js"
import {Pool} from "../../../tools/babylon/optimizers/pool.js"
import {Pallet} from "../../../tools/babylon/logistics/pallet.js"

export class PimsleyPool extends Pool<Pimsley> {
	constructor(realm: Realm, container: AssetContainer) {
		super(() => {
			const pallet = new Pallet(container)
			const pimsley = new Pimsley(realm, pallet)
			return {payload: pimsley, noodle: {
				enable: () => {
					pallet.root.setEnabled(true)
					pimsley.unfreeze()
				},
				disable: () => {
					pallet.root.setEnabled(false)
					pimsley.freeze()
				},
				dispose: () => pallet.dispose(),
			}}
		})
	}
}

