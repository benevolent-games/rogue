
import {Map2} from "@benev/slate"
import {Prop} from "@benev/toolbox"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"
import {AssetContainer, InstantiatedEntries} from "@babylonjs/core/assetContainer.js"

import {Cargo} from "./cargo.js"
import {Manifest} from "./manifest.js"
import {Warehouse} from "./warehouse.js"
import {getChildProps} from "../babylon-helpers.js"

export class ContainerInstance {
	root: Prop
	warehouse: Warehouse
	instantiated: InstantiatedEntries
	animationGroups = new Map2<string, AnimationGroup>()

	constructor(container: AssetContainer) {
		this.instantiated = container.instantiateModelsToScene(n => n)
		const [__root__] = this.instantiated.rootNodes
		this.root = __root__.getChildren()[0] as Prop

		this.warehouse = new Warehouse(
			container.scene,
			[this.root, ...getChildProps(this.root).values()]
				.map(prop => new Cargo(container.scene, prop, Manifest.scan(prop)))
		)

		for (const animationGroup of this.instantiated.animationGroups)
			this.animationGroups.set(animationGroup.name, animationGroup)
	}

	dispose() {
		this.instantiated.dispose()
	}
}

