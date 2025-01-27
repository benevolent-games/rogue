
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"
import {Bucket} from "./buckets.js"

export class BabylonAnimBucket extends Bucket {
	constructor(public animationGroup: AnimationGroup) {
		super()
		this.#setWeight(this.water)
	}

	#setWeight(weight: number) {
		this.animationGroup.weight = weight < 0.001
			? 0
			: weight

		// if (this.alwaysOn) {
		// 	this.animationGroup.weight = Math.max(weight, 0.001)
		// }
		// else {
		// 	this.animationGroup.weight = weight < 0.001
		// 		? 0
		// 		: weight
		// }
	}

	fill(amount: number) {
		const overflow = super.fill(amount)
		this.#setWeight(this.water)
		return overflow
	}
}

