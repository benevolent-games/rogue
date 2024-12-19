
import {Map2} from "@benev/slate"
import {Degrees, Randy, Vec2} from "@benev/toolbox"

import {WallSegment} from "./types.js"
import {DungeonStyle} from "../style.js"
import {mergeWalls} from "./merge-walls.js"
import {range} from "../../../../tools/range.js"
import {Vecset2} from "../../layouting/vecset2.js"

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

export function planWalls(
		randy: Randy,
		wallTiles: Vecset2,
		floorTiles: Vecset2,
		getStyle: (tile: Vec2) => DungeonStyle
	) {

	const wallSegments: WallSegment[] = []
	const concaves: WallSegment[] = []
	const convexes: WallSegment[] = []
	const stumps: WallSegment[] = []

	const considerPattern = (wallTile: Vec2, index: number) => {
		const radians = index * Degrees.toRadians(90)
		const [a, b, _c, d, e, f, g, h, i, j, _k, l, m] = fourPatterns.at(index)!

		const isFloor = (tile: Vec2) => floorTiles.has(wallTile.clone().add(tile))
		const notFloor = (tile: Vec2) => !floorTiles.has(wallTile.clone().add(tile))

		const place = (
			(draft: {offset: Vec2, radians: number}): WallSegment => ({
				size: 1,
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

		// concave
		else if ([e, i].every(notFloor) && isFloor(f)) {
			concaves.push(place({
				offset: new Vec2(0.5, 0.5),
				radians: Degrees.toRadians(-90),
			}))

			// left stump
			if (notFloor(a) && isFloor(b)) {
				stumps.push(place({
					offset: new Vec2(0.5, 1.25),
					radians: Degrees.toRadians(-90),
				}))
			}

			// right stump
			if (notFloor(j) && isFloor(g)) {
				stumps.push(place({
					offset: new Vec2(1.25, 0.5),
					radians: Degrees.toRadians(0),
				}))
			}
		}

		// convex
		else if ([e, f, i].every(isFloor)) {
			convexes.push(place({
				offset: new Vec2(0.5, 0.5),
				radians: Degrees.toRadians(-90),
			}))

			// left stump
			if (notFloor(l) && isFloor(m)) {
				stumps.push(place({
					offset: new Vec2(0.5, -0.25),
					radians: Degrees.toRadians(-90),
				}))
			}

			// right stump
			if (notFloor(h) && isFloor(d)) {
				stumps.push(place({
					offset: new Vec2(-0.25, 0.5),
					radians: Degrees.toRadians(0),
				}))
			}
		}
	}

	for (const wallTile of wallTiles.values())
		for (const index of fourPatterns.keys())
			considerPattern(wallTile, index)

	const wallSegmentsByStyle = new Map2<DungeonStyle, WallSegment[]>()

	for (const wall of wallSegments) {
		const style = getStyle(wall.tile)
		const walls = wallSegmentsByStyle.guarantee(style, () => [])
		walls.push(wall)
	}

	return {
		concaves,
		convexes,
		stumps,
		wallSegments: [...wallSegmentsByStyle.entries()]
			.flatMap(([style, walls]) => mergeWalls(
				randy,
				[...style.walls.keys()],
				walls,
			)),
	}
}

