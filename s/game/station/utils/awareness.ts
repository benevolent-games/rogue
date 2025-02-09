
import {Map2} from "@benev/slate"
import {Box2} from "../../physics/shapes/box2.js"

export class Aware {
	constructor(
		public author: number,
		public area: Box2,
	) {}
}

export class Awareness {
	awares = new Map2<number, Aware>()

	add(author: number, area: Box2) {
		const aware = new Aware(author, area)
		this.awares.set(author, aware)
		return aware
	}

	delete(aware: Aware) {
		this.awares.delete(aware.author)
	}

	list() {
		return this.awares.values()
	}
}

