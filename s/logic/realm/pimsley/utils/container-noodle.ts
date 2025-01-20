
import {AssetContainer} from "@babylonjs/core/assetContainer.js"
import {Spatial} from "../../../../tools/babylon/logistics/types.js"
import {PoolNoodle} from "../../../../tools/babylon/optimizers/pool.js"
import {applySpatial} from "../../../../tools/babylon/logistics/apply-spatial.js"
import {ContainerInstance} from "../../../../tools/babylon/logistics/container-instance.js"

export class ContainerNoodle implements PoolNoodle {
	instance: ContainerInstance

	constructor(container: AssetContainer) {
		this.instance = new ContainerInstance(container)
	}

	get root() {
		return this.instance.root
	}

	applySpatial(spatial: Partial<Spatial>) {
		applySpatial(this.instance.root, spatial)
	}

	enable() {
		this.root.setEnabled(true)
	}

	disable() {
		this.root.setEnabled(false)
	}

	dispose() {
		this.instance.dispose()
	}
}

