
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

export class AdditiveAnim {
	static frame(animationGroup: AnimationGroup, fraction: number) {
		const {from, to} = animationGroup
		const duration = to - from
		return from + (duration * fraction)
	}

	animationGroup: AnimationGroup

	constructor(originalGroup: AnimationGroup, referenceFraction: number) {
		const referenceFrame = AdditiveAnim.frame(originalGroup, referenceFraction)
		this.animationGroup = AnimationGroup.MakeAnimationAdditive(originalGroup, {referenceFrame})
	}

	goto(fraction: number) {
		const frame = AdditiveAnim.frame(this.animationGroup, fraction)
		this.animationGroup.goToFrame(frame)
	}
}

