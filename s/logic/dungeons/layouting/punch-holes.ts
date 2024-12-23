
import {Randy, Vec2} from "@benev/toolbox"
import {Grid} from "./grid.js"
import {cardinals} from "../../../tools/directions.js"

export type HolesReport = {
	vector: Vec2
	forwardDirection: Vec2 | null
	// backwardDirection: Vec2 | null
	startSubvector: Vec2
	endSubvector: Vec2
}

export function punchHolesThroughSubgrids(o: {
		randy: Randy
		vectors: Vec2[]
		subgrid: Grid
		excludeCorners: boolean
	}) {

	const {randy, vectors, subgrid, excludeCorners} = o
	let previous: HolesReport | null = null

	return vectors.map((vector, index) => {
		// const previousVector = index === 0 ? null : vectors.at(index - 1)!
		const nextVector = vectors.at(index + 1) ?? null

		const forwardDirection = nextVector && nextVector.clone().subtract(vector)
		// const backwardDirection = previousVector && previousVector.clone().subtract(vector)

		const subVectors = subgrid.list()

		const endSubvector = forwardDirection
			? randy.choose(getBorder(subgrid, forwardDirection, excludeCorners))
			: randy.choose(subVectors)

		const startSubvector = previous
			? pickAdjacentBravoSubvector(
				subgrid,
				{vector, subvector: previous.endSubvector},
				{vector, subvectors: subVectors},
			)
			: randy.choose(subVectors)

		const subpath: HolesReport = {
			vector,
			startSubvector,
			endSubvector,
			forwardDirection,
			// backwardDirection,
		}

		previous = subpath
		return subpath
	})
}

function getBorder(subgrid: Grid, direction: Vec2, excludeCorners: boolean) {
	const border = subgrid.list()
		.filter(v => subgrid.isDirectionalBorder(v, direction))
		.filter(v => (excludeCorners ? !subgrid.isCorner(v) : true))
	if (border.length === 0)
		throw new Error("failure to obtain border")
	return border
}

function pickAdjacentBravoSubvector(
		subgrid: Grid,
		alpha: {vector: Vec2, subvector: Vec2},
		bravo: {vector: Vec2, subvectors: Vec2[]},
	) {

	const resolve = (vector: Vec2, subvector: Vec2) => {
		return subgrid.extent.clone().multiply(vector).add(subvector)
	}

	const commonAlpha = resolve(alpha.vector, alpha.subvector)

	const commonAdjacent = cardinals
		.map(cardinal => commonAlpha.clone().add(cardinal))

	const subVector = bravo.subvectors.find(sub => {
		const commonBravo = resolve(bravo.vector, sub)
		return commonAdjacent.some(adjacent => adjacent.equals(commonBravo))
	})

	if (!subVector)
		throw new Error("unable to find adjacent bravo subunit")

	return subVector
}

