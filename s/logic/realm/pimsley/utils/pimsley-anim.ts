
import {Scene} from "@babylonjs/core/scene.js"
import {splitBodyAnimations} from "./split-body-animations.js"
import {BabylonAnimBucket} from "../../../../tools/buckets/babylon-anim.js"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

export class PimsleyAnim {
	upper: BabylonAnimBucket
	lower: BabylonAnimBucket

	constructor(scene: Scene, animationGroup: AnimationGroup) {
		const parts = splitBodyAnimations(scene, animationGroup)
		this.upper = new BabylonAnimBucket(parts.upper)
		this.lower = new BabylonAnimBucket(parts.lower)
	}

	goToFrame(frame: number) {
		this.upper.animationGroup.goToFrame(frame, true)
		this.lower.animationGroup.goToFrame(frame, true)
	}

	get speedRatio() {
		return this.upper.animationGroup.speedRatio
	}

	set speedRatio(x: number) {
		this.upper.animationGroup.speedRatio = x
		this.lower.animationGroup.speedRatio = x
	}

	get capacity() {
		return this.upper.capacity
	}

	set capacity(x: number) {
		this.upper.capacity = x
		this.lower.capacity = x
	}

	get water() {
		return this.upper.water
	}

	execute(fn: (animationGroup: AnimationGroup) => void) {
		fn(this.upper.animationGroup)
		fn(this.lower.animationGroup)
	}
}

