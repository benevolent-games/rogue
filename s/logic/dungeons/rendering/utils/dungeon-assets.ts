
import {Map2} from "@benev/slate"
import {DungeonStyle} from "./dungeon-style.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"
import {Warehouse} from "../../../../tools/babylon/logistics/warehouse.js"

export class DungeonAssets {
	styles: Map2<string, DungeonStyle>

	constructor(public container: AssetContainer) {
		const dungeonWarehouse = Warehouse.from(container)
		this.styles = new Map2(
			[...dungeonWarehouse.categorize("style")].map(([style, styleWarehouse]) => [
				style,
				new DungeonStyle(style, styleWarehouse),
			])
		)
	}

	dispose() {
		for (const style of this.styles.values())
			style.dispose()
	}
}

