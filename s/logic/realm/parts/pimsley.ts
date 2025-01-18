
import {AssetContainer} from "@babylonjs/core"
import {PoolNoodle} from "../../../tools/babylon/optimizers/pool.js"
import {ContainerInstance} from "../../../tools/babylon/logistics/container-instance.js"

export class Pimsley implements PoolNoodle {
	instance: ContainerInstance

	constructor(container: AssetContainer) {
		this.instance = new ContainerInstance(container)
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

