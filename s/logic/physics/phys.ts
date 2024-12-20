
import {Vec2} from "@benev/toolbox"
import {Box2} from "./shapes/box2.js"
import {Circle} from "./shapes/circle.js"
import {Exogrid} from "./facilities/exogrid.js"
import {Vecset2} from "../dungeons/layouting/vecset2.js"

export class PhysDynamic {
	mass = 1
	force = Vec2.zero()
	constructor(public shape: Box2 | Circle) {}
}

export class PhysArena {
	static makeGrid = <X>(locator: (item: X) => Vec2) => new Exogrid<X>(new Vec2(16, 16), locator)
	floorGrid = PhysArena.makeGrid<Vec2>(v => v)
	wallGrid = PhysArena.makeGrid<Vec2>(v => v)
	dynamicGrid = PhysArena.makeGrid<PhysDynamic>(dynamic => dynamic.shape.center)
	dynamics = new Set<PhysDynamic>()
}

export class Phys {
	arena = new PhysArena()

	reset(floorTiles: Vecset2, wallTiles: Vecset2) {
		this.arena = new PhysArena()
		for (const tile of floorTiles.values())
			this.arena.floorGrid.add(tile)
		for (const tile of wallTiles.values())
			this.arena.wallGrid.add(tile)
	}

	add(dynamic: PhysDynamic) {
		this.arena.dynamics.add(dynamic)
		this.arena.dynamicGrid.add(dynamic)
	}

	tick() {}
}

