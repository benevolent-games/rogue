
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

export function prepareDungeonContainer(container: AssetContainer) {

	for (const material of container.materials) {
		material.backFaceCulling = true
		material.freeze()
	}
}

