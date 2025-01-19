
import {AssetContainer} from "@babylonjs/core"
import {PimsleyAnims} from "./utils/pimsley-anims.js"
import {PoolNoodle} from "../../../tools/babylon/optimizers/pool.js"
import {ContainerInstance} from "../../../tools/babylon/logistics/container-instance.js"

export class Pimsley implements PoolNoodle {
	anims: PimsleyAnims
	instance: ContainerInstance

	constructor(container: AssetContainer) {
		this.instance = new ContainerInstance(container)
		this.anims = new PimsleyAnims(this.instance)
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

