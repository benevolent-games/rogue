
import {Randy, Vec2} from "@benev/toolbox"
import {Grid} from "../../grid.js"
import {Fattener} from "./fattener.js"
import {Pathfinder} from "../../pathfinder.js"
import {range} from "../../../../../tools/range.js"
import {DistanceAlgo} from "../../../../../tools/distance.js"
import { Vecset2 } from "../../vecset2.js"

export function goalposting(options: {
		end: Vec2
		start: Vec2
		randy: Randy
		tileGrid: Grid
		distanceAlgo: DistanceAlgo
		goalcountRange: [number, number]
	}) {

	const {
		end,
		start,
		randy,
		tileGrid,
		distanceAlgo,
		goalcountRange,
	} = options

	const walkables = new Vecset2()
	const pathfinder = new Pathfinder(randy, tileGrid)
	const innerTiles = tileGrid.excludeBorders()
	const goalposts = [
		start,
		...range(randy.integerRange(...goalcountRange))
			.map(() => randy.yoink(innerTiles)),
		end,
	]

	const tilePath = pathfinder.aStarChain(goalposts, distanceAlgo)
	if (!tilePath)
		throw new Error("failure to produce tilepath")

	walkables.add(...tilePath)
	return {tilePath, goalposts, innerTiles, walkables}
}

