
import {Vec2} from "@benev/toolbox"
import {Grid} from "./grid.js"
import {Vecset2} from "./vecset2.js"
import {cardinals, ordinals} from "../../../tools/directions.js"

const _ = undefined
const X = "untraversable"
const O = "traversable"

type Pat = undefined | "untraversable" | "traversable"

const badPatterns: Pat[][][] = [
	[
		[X, O, _],
		[O, X, _],
		[_, _, _],
	],
	[
		[_, O, X],
		[_, X, O],
		[_, _, _],
	],
	[
		[_, _, _],
		[_, X, O],
		[_, O, X],
	],
	[
		[_, _, _],
		[O, X, _],
		[X, O, _],
	],
]

export function fixAllDiagonalKisses(grid: Grid, walkables: Vecset2) {
	const attempts = 100
	for (const _ of Array(attempts)) {
		const fixes = fixDiagonalKissingTiles(grid, walkables.list())
		if (fixes.length === 0)
			break
		walkables.add(...fixes)
	}
	return walkables
}

export function fixDiagonalKissingTiles(grid: Grid, tiles: Vec2[]) {
	const walkable = new Vecset2(tiles)

	function isOffsetWalkable(alpha: Vec2, offset: Vec2) {
		const bravo = alpha.clone().add(offset)
		return walkable.has(bravo)
			? bravo
			: null
	}

	const considerableTiles = grid.list()
		// // TODO
		// // worry about this if kissing-diagonals are found,
		// // or if cells are unintentionally connected when they should not be..
		// .filter(tile => !grid.isBorder(tile))

	const fixes = new Vecset2()

	for (const tile of considerableTiles) {

		// a  b  c
		// h  z  d
		// g  f  e

		const [b, d, f, h] = cardinals.map(c => isOffsetWalkable(tile, c))
		const [c, e, g, a] = ordinals.map(c => isOffsetWalkable(tile, c))

		const match = (vec: Vec2 | null, pat: Pat) => {
			if (pat === undefined) return true
			if (pat === "traversable" && !!vec) return true
			if (pat === "untraversable" && !vec) return true
			return false
		}

		const isBad = badPatterns.some(pattern => {
			const [[A, B, C], [H, Z, D], [G, F, E]] = pattern
			const z = walkable.has(tile) ? tile : null
			return [
				match(z, Z),
				match(a, A),
				match(b, B),
				match(c, C),
				match(d, D),
				match(e, E),
				match(f, F),
				match(g, G),
				match(h, H),
			].every(m => m)
		})

		if (isBad)
			fixes.add(tile)
	}

	return fixes.list()
}

