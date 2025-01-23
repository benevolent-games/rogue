
import {PimsleyAnim} from "./pimsley-anim.js"
import {Pallet} from "../../../../tools/babylon/logistics/pallet.js"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

export type PimsleyAnims = ReturnType<typeof choosePimsleyAnims>

export function choosePimsleyAnims(pallet: Pallet) {
	const anim = (s: string) => new PimsleyAnim(
		pallet.container.scene,
		pallet.animationGroups.require(s),
	)

	const additive = (s: string, referenceFraction: number) => {
		const animationGroup = pallet.animationGroups.require(s)
		const referenceFrame = animationGroup.from + (
			(animationGroup.to - animationGroup.from) * referenceFraction
		)
		return new PimsleyAnim(
			pallet.container.scene,
			AnimationGroup.MakeAnimationAdditive(animationGroup, {referenceFrame}),
		)
	}

	return {
		idle: anim("idle-standmovement"),

		forward: anim("run-forwards"),
		backward: anim("run-backwards"),
		leftward: anim("strafe-left"),
		rightward: anim("strafe-right"),

		turnLeft: anim("turn-left"),
		turnRight: anim("turn-right"),

		attack: anim("attack-swing"),
		block: anim("block-shield"),
		// leanCorrection: additive("spine-lean-correction", 50 / 100),
	}
}

