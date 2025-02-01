
import {Vec2} from "@benev/toolbox"
import {Awareness} from "./awareness.js"
import {range} from "../../../tools/range.js"

export class Popsicle {
	frozen = true
	constructor(public point: Vec2) {}
}

export class Glacier {
	#all = new Set<Popsicle>
	#buckets: Set<Popsicle>[]
	#adder: BucketIndexer
	#updater: BucketIndexer

	constructor(
			public awareness: Awareness,
			public readonly bucketCount = 8,
		) {
		this.#buckets = range(bucketCount).map(_ => new Set())
		this.#adder = new BucketIndexer(this.#buckets)
		this.#updater = new BucketIndexer(this.#buckets)
	}

	add(point: Vec2) {
		const popsicle = new Popsicle(point)
		this.#all.add(popsicle)
		this.#adder.getNextBucket().add(popsicle)
		return popsicle
	}

	delete(popsicle: Popsicle) {
		this.#all.delete(popsicle)
		for (const bucket of this.#buckets)
			bucket.delete(popsicle)
	}

	recompute() {
		const bucket = this.#updater.getNextBucket()
		for (const popsicle of bucket)
			popsicle.frozen = !this.#isSeen(popsicle)
	}

	#isSeen(popsicle: Popsicle) {
		for (const aware of this.awareness.awares.values())
			if (aware.area.contains(popsicle.point))
				return true
		return false
	}
}

class BucketIndexer {
	index = 0
	constructor(public buckets: Set<Popsicle>[]) {}
	getNextBucket() {
		this.index = (this.index + 1) % this.buckets.length
		return this.buckets[this.index]
	}
}

