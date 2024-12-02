
import {Map2} from "@benev/slate"
import {DungeonStyle} from "./dungeon-style.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"
import {Warehouse} from "../../../../tools/babylon/logistics/warehouse.js"

/** Read and prepare props from a glb asset container */
export class DungeonAssets {
	styles: Map2<string, DungeonStyle>

	constructor(public container: AssetContainer) {
		const dungeonWarehouse = Warehouse.from(container)

		// each style has its own complete set of dungeon props, floors/walls/etc
		this.styles = new Map2(
			[...dungeonWarehouse.categorize("style")]
				.map(([style, styleWarehouse]) => [
					style,
					new DungeonStyle(style, styleWarehouse),
				])
		)
	}
}

