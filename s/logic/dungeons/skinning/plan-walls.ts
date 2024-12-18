
import {Map2} from "@benev/slate"
import {Degrees, Vec2} from "@benev/toolbox"

import {range} from "../../../tools/range.js"
import {Vecset2} from "../layouting/vecset2.js"

//   a b c
// d e f g
// h @ i j
// k l m
const pattern = [
	Vec2.new(0, 2), // a
	Vec2.new(1, 2), // b
	Vec2.new(2, 2), // c
	Vec2.new(-1, 1), // d
	Vec2.new(0, 1), // e
	Vec2.new(1, 1), // f
	Vec2.new(2, 1), // g
	Vec2.new(-1, 0), // h
	Vec2.new(1, 0), // i
	Vec2.new(2, 0), // j
	Vec2.new(-1, -1), // k
	Vec2.new(0, -1), // l
	Vec2.new(1, -1), // m
]

const fourPatterns = range(4).map(i =>
	pattern.map(v =>
		v.clone()
			.rotate(i * Degrees.toRadians(90))
			.round()
	)
)

export type WallInfo = {
	tile: Vec2
	location: Vec2
	radians: number
}

export type BetterWallSegments = {
	size: number
	tile: Vec2
	location: Vec2
	radians: number
}

export function mergeWalls(sizes: number[], walls: WallInfo[]) {
	const betterTileMap = new Map2(walls.map(w => [w.tile, {...w, size: 1}]))

	for (const wall of walls) {
		for (const size of sizes) {

			// ignore the default size 1
			if (size === 1)
				break

			// TODO: search for contiguous wall segments along cardinal directions according with size, replacing existing tiles with the new ones
		}
	}

	return [...betterTileMap.values()]
}

export function planWalls(
		wallTiles: Vecset2,
		floorTiles: Vecset2,
	) {

	const wallSegments: WallInfo[] = []
	// const concaves: WallInfo[] = []
	// const convexes: WallInfo[] = []
	// const wallStumps: WallInfo[] = []

	const considerPattern = (wallTile: Vec2, index: number) => {
		const radians = index * Degrees.toRadians(90)
		const [a, b, c, d, e, f, g, h, i, j, k, l, m] = fourPatterns.at(index)!

		const isFloor = (tile: Vec2) => floorTiles.has(wallTile.clone().add(tile))
		const notFloor = (tile: Vec2) => !floorTiles.has(wallTile.clone().add(tile))

		const place = (
			(draft: {offset: Vec2, radians: number}): WallInfo => ({
				tile: wallTile,
				radians: draft.radians + radians,
				location: wallTile.clone().add(draft.offset.rotate(radians)),
			})
		)

		if ([d, e, f].every(isFloor) && [h, i].every(notFloor))
			wallSegments.push(place({
				radians: 0,
				offset: Vec2.new(0, 0.5),
			}))
	}

	for (const wallTile of wallTiles.values())
		for (const index of fourPatterns.keys())
			considerPattern(wallTile, index)

	return {wallSegments}
}

