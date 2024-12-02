
import {Randy, Vec2} from "@benev/toolbox"

import {Grid} from "./grid.js"
import {Vecset2} from "./vecset2.js"
import {cardinals} from "../../../tools/directions.js"
import {distance, DistanceAlgo} from "../../../tools/distance.js"

export class Pathfinder {
	constructor(public randy: Randy, public grid: Grid) {}

	pickRandomPoint() {
		return Vec2.new(
			this.randy.integerRange(0, this.grid.extent.x),
			this.randy.integerRange(0, this.grid.extent.y),
		)
	}

	drunkardWithPerseverance(start: Vec2, end: Vec2) {
		let attempts = 0
		let path: Vec2[] | null = null

		while (attempts < 1000 && path === null) {
			path = this.drunkAttempt(start, end)
		}

		if (!path)
			throw new Error("drunkard failed to find a path in 1000 attempts")

		return path
	}

	drunkAttempt(start: Vec2, end: Vec2) {
		const path = new Vecset2()
		let current = start.clone()
		path.add(current)

		while (!current.equals(end)) {
			const possibleSteps = this.grid.neighbors(current)
				.filter(step => !path.has(step))

			if (possibleSteps.length === 0)
				return null

			current = this.randy.choose(possibleSteps)
			path.add(current)
		}

		return path.list()
	}

	aStar(start: Vec2, end: Vec2, distanceAlgo?: DistanceAlgo): null | Vec2[] {
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
			heuristic: distance(start, end, distanceAlgo),
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
						heuristic: distance(nextLocation, end, distanceAlgo),
					})
				}
			}
		}

		return null
	}

	aStarChain(points: Vec2[], distanceAlgo?: DistanceAlgo): Vec2[] | null {
		if (points.length < 2)
			throw new Error("throw a star chain")

		const path: Vec2[] = []
		let count = 0
		let last: Vec2 | null = null

		for (const point of points) {
			if (last) {
				const subpath = this.aStar(last, point, distanceAlgo)
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

