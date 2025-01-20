
import {PimsleyAnims} from "./utils/pimsley-anims.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"
import {Spatial} from "../../../tools/babylon/logistics/types.js"
import {PoolNoodle} from "../../../tools/babylon/optimizers/pool.js"
import {applySpatial} from "../../../tools/babylon/logistics/apply-spatial.js"
import {ContainerInstance} from "../../../tools/babylon/logistics/container-instance.js"

export class Pimsley implements PoolNoodle {
	anims: PimsleyAnims
	instance: ContainerInstance

	constructor(container: AssetContainer) {
		this.instance = new ContainerInstance(container)
		this.anims = new PimsleyAnims(this.instance)
	}

	applySpatial(spatial: Partial<Spatial>) {
		applySpatial(this.instance.root, spatial)
	}

	get root() {
		return this.instance.root
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

