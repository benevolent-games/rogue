
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {PimsleyAnims} from "./utils/pimsley-anims.js"
import {ContainerNoodle} from "./utils/container-noodle.js"

export class Pimsley extends ContainerNoodle {
	anims: PimsleyAnims

	constructor(container: AssetContainer) {
		super(container)
		this.anims = new PimsleyAnims(this.instance)
	}
}

