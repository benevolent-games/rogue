
// class Fullgrid extends Grid {
// 	#nodes: Vec2[] = []
//
// 	constructor(public extent: Vec2) {
// 		super(extent)
// 		for (const [x, y] of loop2d(extent.array()))
// 			this.#nodes.push(Vec2.new(x, y))
// 	}
//
// 	get(v: Vec2) {
// 		const index = this.#index(v)
// 		return this.#nodes[index]
// 	}
//
// 	#index(v: Vec2) {
// 		if (!this.inBounds(v))
// 			throw new Error("vector out of grid bounds")
// 		const {x, y} = v
// 		return (x * y) + x
// 	}
// }

