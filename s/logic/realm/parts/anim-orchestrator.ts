
import {Vec2} from "@benev/toolbox"
import {range} from "../../../tools/range.js"
import {Prioritizer} from "../../../tools/prioritizer.js"

export type Animo = {
	getCoordinates: () => Vec2
	animate: (frame: number, seconds: number) => void
}

const bucketCount = 8

function makeEmptyBuckets(): Animo[][] {
	return range(bucketCount).map(() => [])
}

export class AnimOrchestrator {
	frame = 0

	buckets = makeEmptyBuckets()

	ranges = [
		{nth: 1, start: 0, end: 3},
		{nth: 2, start: 3, end: 9},
		{nth: 4, start: 9, end: 20},
		{nth: 8, start: 20, end: undefined},
	]

	animos = new Prioritizer<Animo>(
		animo => this.centerpoint.distanceSquared(animo.getCoordinates()),
	)

	constructor(public centerpoint: Vec2) {
		this.animos.onChange = () => this.#distributeIntoBuckets()
	}

	#distributeIntoBuckets() {
		this.buckets = makeEmptyBuckets()

		for (const {nth, start, end} of this.ranges) {
			const animos = this.animos.sorted.slice(start, end)

			animos.forEach((animo, index) => {
				const offset = index % bucketCount

				for (let i = 0; i < bucketCount; i += nth) {
					const bucket = this.buckets[(i + offset) % bucketCount]
					bucket.push(animo)
				}
			})
		}
	}

	animate(seconds: number) {
		this.frame += 1

		const bucket = this.buckets[this.frame % bucketCount]

		for (const animo of bucket)
			animo.animate(this.frame, seconds)
	}
}

