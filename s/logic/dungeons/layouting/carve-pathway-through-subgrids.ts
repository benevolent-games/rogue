
import {Randy, Vec2} from "@benev/toolbox"
import {Grid} from "./grid.js"
import {cardinals} from "../../../tools/directions.js"

export function carvePathwayThroughSubgrids({randy, unitPath, subgrid, excludeCorners, locate}: {
		randy: Randy,
		unitPath: Vec2[],
		subgrid: Grid,
		excludeCorners: boolean,
		locate: (unit: Vec2) => Vec2,
	}) {

	const unitGoals: {
		unit: Vec2,
		start: Vec2,
		end: Vec2,
		forwardDirection: Vec2 | null,
		backwardDirection: Vec2 | null,
	}[] = []

	let previous: {unit: Vec2, end: Vec2, direction: Vec2} | null = null

	unitPath.forEach((unit, index) => {
		const subunits = subgrid.list()
		const nextUnit = unitPath.at(index + 1) ?? null

		const forwardDirection = nextUnit
			? locate(nextUnit).clone().subtract(locate(unit))
			: null

		const backwardDirection = previous && previous.direction

		const end = forwardDirection
			? randy.choose(getBorder(subgrid, forwardDirection, excludeCorners))
			: randy.choose(subunits)

		const start = previous
			? pickAdjacent(
				subgrid,
				{unit: locate(previous.unit), subunit: previous.end},
				{unit: locate(unit), subunits},
			)
			: randy.choose(subunits)

		unitGoals.push({unit, start, end, forwardDirection, backwardDirection})

		if (nextUnit)
			previous = {unit, end, direction: locate(unit).clone().subtract(locate(nextUnit))}
	})

	return unitGoals
}

function getBorder(subgrid: Grid, direction: Vec2, excludeCorners: boolean) {
	const border = subgrid.list()
		.filter(v => subgrid.isDirectionalBorder(v, direction))
		.filter(v => (excludeCorners ? !subgrid.isCorner(v) : true))
	if (border.length === 0)
		throw new Error("failure to obtain border")
	return border
}

function pickAdjacent(
		subgrid: Grid,
		alpha: {unit: Vec2, subunit: Vec2},
		bravo: {unit: Vec2, subunits: Vec2[]},
	) {

	const resolve = (unit: Vec2, subunit: Vec2) => {
		return subgrid.extent.clone().multiply(unit).add(subunit)
	}

	const commonAlpha = resolve(alpha.unit, alpha.subunit)

	const commonAdjacent = cardinals
		.map(cardinal => commonAlpha.clone().add(cardinal))

	const subunit = bravo.subunits.find(sub => {
		const commonBravo = resolve(bravo.unit, sub)
		return commonAdjacent.some(adjacent => adjacent.equals(commonBravo))
	})

	if (!subunit)
		throw new Error("unable to find adjacent bravo subunit")

	return subunit
}

