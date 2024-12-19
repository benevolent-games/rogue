
import {Map2} from "@benev/slate"
import {Randy} from "@benev/toolbox"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {DungeonStyle} from "./style.js"
import {Warehouse} from "../../../tools/babylon/logistics/warehouse.js"

export class DungeonAssets {
	warehouse: Warehouse
	styles: Map2<string, DungeonStyle>

	constructor(
			public container: AssetContainer,
			public randy: Randy,
		) {

		this.warehouse = Warehouse.from(container)

		this.styles = new Map2(
			[...this.warehouse.categorize("style")].map(([style, warehouse]) =>
				[style, new DungeonStyle(style, warehouse, randy)]
			)
		)
	}
}

