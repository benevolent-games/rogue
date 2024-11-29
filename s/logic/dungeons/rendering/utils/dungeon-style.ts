
import {Map2} from "@benev/slate"
import {Prop, Randy} from "@benev/toolbox"
import {Glb} from "../../../../tools/babylon/glb.js"
import {Propname} from "../../../../tools/propnames/propnames.js"

export class DungeonStyle {
	randy = Randy.seed(1)

	resources: {
		floors: Prop[]
		walls: Prop[]
		concaves: Prop[]
		convexes: Prop[]
	}

	constructor(
			public style: string,
			public props: Map2<Propname, Prop>,
		) {
		this.resources = {
			floors: this.#prepare("floor", "1x1"),
			walls: this.#prepare("wall", "1"),
			concaves: this.#prepare("concave"),
			convexes: this.#prepare("convex"),
		}
	}

	spawn = {
		floor: () => {
			const prop = this.randy.choose(this.resources.floors)
			return Glb.instantiate(prop)
		},
		wall: () => {
			const prop = this.randy.choose(this.resources.walls)
			return Glb.instantiate(prop)
		},
		concave: () => {
			const prop = this.randy.choose(this.resources.concaves)
			return Glb.instantiate(prop)
		},
		convex: () => {
			const prop = this.randy.choose(this.resources.convexes)
			return Glb.instantiate(prop)
		},
	}

	#prepare(part: string, size?: string) {
		const results = [...this.props.entries()]
			.filter(([propname]) => (
				(propname.get("part") === part) &&
				(size ? (propname.get("size") === size) : true)
			))
			.map(([,prop]) => prop)

		if (results.length === 0)
			throw new Error(`dungeon style "${this.style}" is missing part "${part}"`)

		return results
	}
}

