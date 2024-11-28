
import {flavors} from "./types.js"

export const CellFlavors = flavors({

	chaotic: ({randy}) => ({
		distanceAlgo: "euclidean",
		goalposts: Math.round(randy.between(1, 5)),
		fn: ({fattener, tileGrid, goalposts, start, end, backwardDirection, forwardDirection}) => {
			const p = tileGrid.percentageFn()

			fattener.growBorderPortals(
				[1, 4],
				[start, backwardDirection],
				[end, forwardDirection],
			)

			fattener.grow(p(5))

			fattener.knobbify({
				count: randy.between(p(2), p(3)),
				size: randy.between(1, 2),
			})

			fattener.knobbify({
				count: randy.between(2, p(1)),
				size: randy.between(3, 5),
			})

			fattener.makeGoalpostBulbs(goalposts)

			return fattener.tiles
		},
	}),

	mechanoid: ({randy}) => ({
		distanceAlgo: "manhattan",
		goalposts: Math.round(randy.between(1, 10)),
		fn: ({fattener, tileGrid, goalposts, start, end, backwardDirection, forwardDirection}) => {
			const p = tileGrid.percentageFn()

			fattener.shadow()

			fattener.growBorderPortals(
				[2, 2],
				[start, backwardDirection],
				[end, forwardDirection],
			)

			fattener.knobbify({
				count: randy.between(p(0.5), p(1)),
				size: randy.between(2, 3),
			})

			fattener.makeGoalpostBulbs(goalposts)

			return fattener.tiles
		},
	}),

	tatters: ({randy}) => ({
		distanceAlgo: "manhattan",
		goalposts: Math.round(randy.between(5, 10)),
		fn: ({fattener, tileGrid, goalposts}) => {
			const p = tileGrid.percentageFn()

			fattener.grow(p(10))

			fattener.knobbify({
				count: randy.between(p(2), p(3)),
				size: randy.between(1, 2),
			})

			fattener.knobbify({
				count: randy.between(1, 2),
				size: randy.between(2, 3),
			})

			fattener.makeGoalpostBulbs(goalposts)

			return fattener.tiles
		},
	}),

})

