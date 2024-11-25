
import {Randy, Vec2} from "@benev/toolbox"

import {Grid} from "./grid.js"
import {cardinals} from "../../../tools/directions.js"

export class Pathfinder {
	constructor(public randy: Randy, public grid: Grid) {}

	pickRandomPoint() {
		return Vec2.new(
			Math.floor(this.randy.between(0, this.grid.extent.x)),
			Math.floor(this.randy.between(0, this.grid.extent.y)),
		)
	}

	drunkard(start: Vec2, end: Vec2) {
		const path = [start.clone()]
		let current = start.clone()

		while (!current.equals(end)) {
			const possibleSteps = cardinals
				.map(v => current.clone().add(v))
				.filter(v => this.grid.inBounds(v))

			const freshSteps = possibleSteps
				.filter(v => !path.some(p => p.equals(v)))

			const availableSteps = freshSteps.length > 0
				? freshSteps
				: possibleSteps

			current = this.randy.choose(availableSteps).clone()
			path.push(current)
		}

		return path
	}

	#manhattanDistance(a: Vec2, b: Vec2) {
		return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
	}

	aStar(start: Vec2, end: Vec2): null | Vec2[] {
		const {grid} = this

		if (start.equals(end))
			return [start]

		type Pathnode = {
			location: Vec2
			cost: number
			heuristic: number
			parent: Pathnode | null
		}

		const closedNodes: Pathnode[] = []
		const openNodes: Pathnode[] = [{
			location: start,
			cost: 0,
			heuristic: this.#manhattanDistance(start, end),
			parent: null,
		}]

		function consolidatePath(node: Pathnode) {
			const path: Pathnode[] = [node]
			while (node.parent) {
				path.push(node.parent)
				node = node.parent
			}
			return path
				.toReversed()
				.map(n => n.location)
		}

		function getNextValidSteps(location: Vec2) {
			return cardinals
				.map(c => location.clone().add(c))
				.filter(step => grid.inBounds(step))
		}

		while (openNodes.length > 0) {
			openNodes.sort((a, b) => (a.cost + a.heuristic) - (b.cost + b.heuristic))

			const current = openNodes.shift()!
			closedNodes.push(current)

			// done
			if (current.location.equals(end))
				return consolidatePath(current)

			for (const nextLocation of getNextValidSteps(current.location)) {
				if (closedNodes.some(node => node.location.equals(nextLocation)))
					continue
				const cost = current.cost + 1
				const existingNode = openNodes.find(node => node.location.equals(nextLocation))
				if (existingNode) {
					if (cost < existingNode.cost) {
						existingNode.cost = cost
						existingNode.parent = current
					}
				}
				else {
					openNodes.push({
						parent: current,
						location: nextLocation,
						cost: cost,
						heuristic: this.#manhattanDistance(nextLocation, end),
					})
				}
			}
		}

		return null
	}

	aStarChain(points: Vec2[]): Vec2[] | null {
		if (points.length < 2)
			throw new Error("throw a star chain")

		const path: Vec2[] = []
		let count = 0
		let last: Vec2 | null = null

		for (const point of points) {
			if (last) {
				const subpath = this.aStar(last, point)
				if (!subpath) return null
				path.push(...(count++ === 0)
					? subpath
					: subpath.slice(1))
			}
			last = point
		}

		return path
	}
}

