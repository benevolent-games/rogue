//
// import {Vec2} from "@benev/toolbox"
// import {deferPromise} from "@benev/slate"
//
// import {Box2} from "../../physics/shapes/box2.js"
// import {Exogrid} from "../../physics/facilities/exogrid.js"
// import {Coordinates} from "../../realm/utils/coordinates.js"
//
// export class SpawnPlacer {
// 	#promise = deferPromise<Coordinates[]>()
// 	#obstacles = new Exogrid<Box2>(new Vec2(16, 16), item => item.center)
//
// 	addObstacle(box: Box2) {
// 		this.#obstacles.add(box)
// 		this.#obstacles.update(box)
// 		return new SpawnObstacle()
// 	}
//
// 	addPossibleSpawnpoints(coordinates: Coordinates[]) {
// 	}
// }
//
// export class SpawnObstacle {
// 	constructor(
// 		public box: Box2,
// 		public dispose: () => void,
// 	) {}
//
// 	update() {
// 	}
// }
//
