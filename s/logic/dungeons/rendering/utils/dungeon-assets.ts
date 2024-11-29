
import {Map2} from "@benev/slate"
import {DungeonStyle} from "./dungeon-style.js"
import {Glb} from "../../../../tools/babylon/glb.js"
import { OrganizedProps } from "../../../../tools/propnames/organized-props.js"

export class DungeonAssets {
	styles: Map2<string, DungeonStyle>

	constructor(public glb: Glb) {
		const organized = new OrganizedProps(glb.props)
		const styles = organized.categorize("style")
		this.styles = new Map2([...styles].map(([style, props]) => [
			style,
			new DungeonStyle(style, props),
		]))
	}

	dispose() {
		this.glb.dispose()
	}
}

