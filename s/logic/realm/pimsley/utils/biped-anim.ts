
import {Scene} from "@babylonjs/core/scene.js"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

import {splitBodyAnimations} from "./split-body-animations.js"
import {BabylonAnimBucket} from "../../../../tools/buckets/babylon-anim.js"

export class BipedAnim {
	upper: BabylonAnimBucket
	lower: BabylonAnimBucket

	constructor(scene: Scene, animationGroup: AnimationGroup) {
		const parts = splitBodyAnimations(scene, animationGroup)
		this.upper = new BabylonAnimBucket(parts.upper)
		this.lower = new BabylonAnimBucket(parts.lower)
	}

	goToFrame(frame: number, useWeights: boolean) {
		// if (useWeights && this.upper.animationGroup.weight > 0)
			this.upper.animationGroup.goToFrame(frame, useWeights)
		// if (useWeights && this.lower.animationGroup.weight > 0)
			this.lower.animationGroup.goToFrame(frame, useWeights)
	}

	goToPercent(percent: number, useWeights: boolean) {
		const durationFrames = (this.to - this.from)
		const frame = this.from + (durationFrames * percent)
		this.goToFrame(frame, useWeights)
	}

	get from() {
		return this.upper.animationGroup.from
	}

	get to() {
		return this.upper.animationGroup.to
	}

	get durationSeconds() {
		return (this.to - this.from) / 60
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

